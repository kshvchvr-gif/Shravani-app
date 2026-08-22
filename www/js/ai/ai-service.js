// ════════════════════════════════════════════════════════════════
// AI SERVICE — Central Router
// ----------------------------------------------------------------
// - Queue: single-flight — ek waqt mein sirf 1 AI request.
// - Rate limiter: vision requests ke beech 3s gap.
// - Smart retry: exponential backoff 5s/15s/30s/60s (sirf 429/503/
//   timeout/network par; invalid request par kabhi retry nahi).
// - Provider failover: Gemini → OpenRouter → NVIDIA (silent, koi
//   popup nahi, user ko pata nahi chalta).
// - Abort: cancelPending() — naya image select hua to purana khatam.
// - Logging: provider, retry count, queue size, upload size,
//   response time, switch reason.
//
// Naya provider add karna = sirf config.js — yahan kuch mat badlo.
// ════════════════════════════════════════════════════════════════

const AIProvider = (function(){

  let _queue = [];
  let _running = false;
  let _lastVisionAt = 0;
  let _providerIdx = 0;
  let _activeCtrl = null;
  let _epoch = 0;                 // cancel detection counter
  let _statusListeners = [];
  let _providerFailUntil = {};     // { providerId: unlockTimestamp }
  const SKIP_QUOTA_MS = 120000;    // 429/403 quota — 2 min cooldown
  const SKIP_TRANSIENT_MS = 30000; // timeout/network/5xx — sirf 30s (jaldi recover)
  const MANUAL_TIMEOUT_MS = 90000;   // 90s manual timeout (CapacitorHttp ignores AbortController)

  // compatibility: purana global (app.js `var lastGeminiStatus` bhi
  // yahi window property par point karta hai)
  window.lastGeminiStatus = 0;

  function aiSleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

  function aiLog(tag, msg){
    try { console.log('[AI]', new Date().toISOString().slice(11, 19), tag, msg || ''); } catch(e){}
  }

  function notify(evt){
    _statusListeners.slice().forEach(function(cb){
      try { cb(evt); } catch(e){}
    });
  }

  function classify(res){
    const status = (res && res.status) || 0;
    const type = res && res.errorType;
    const retryable =
      type === 'timeout' || type === 'network' ||
      status === 429 || status === 503 ||
      status === 408 || status === 502 || status === 504;
    // Failover: koi bhi galat response (400/404/413/422/empty/401/403)
    // par next provider try karo — ek provider ki galti pe poora request
    // "Could not read photo" ke saath khatam nahi hona chahiye jab baaki
    // providers ke keys already working hain. Sirf cancel (aborted) aur
    // no-key fatal hain, wahan retry/switch kuch nahi karega.
    const switchable = !(type === 'aborted' || type === 'no-key');
    return { retryable: retryable, switchable: switchable };
  }

  function hasAnyKey(){
    try { return window.hasAnyAIKey ? window.hasAnyAIKey() : false; } catch(e){ return false; }
  }

  // ── QUEUE ─────────────────────────────────────────────────────
  function enqueue(req){
    return new Promise(function(resolve, reject){
      _queue.push({ req: req, resolve: resolve, reject: reject });
      aiLog('queued', { queueSize: _queue.length });
      pump();
    });
  }

  function pump(){
    if (_running) return;
    const item = _queue.shift();
    if (!item) return;
    _running = true;
    Promise.resolve(execute(item.req))
      .then(item.resolve)
      .catch(item.reject)
      .finally(function(){
        _running = false;
        pump();
      });
  }

  // ── EXECUTE: retry + failover loop ────────────────────────────
  async function execute(req){
    // cancel detection: har request apne start par current epoch capture
    // karta hai; cancelPending() epoch badha deta hai → ye request khatam
    const myEpoch = _epoch;

    if (!hasAnyKey()) {
      try { if (window.showAdminPanel) window.showAdminPanel(); } catch(e){}
      return null;
    }

    // vision rate limiter (3s gap)
    if (req.type === 'vision') {
      const wait = Math.max(0, _lastVisionAt + AI_CONFIG.queue.minGapVisionMs - Date.now());
      if (wait > 0) {
        aiLog('rate-limit', { waitMs: wait });
        await aiSleep(wait);
        if (_epoch !== myEpoch) return null;
      }
      _lastVisionAt = Date.now();
    }

    const providers = window.getAIProviders ? window.getAIProviders() : [];
    if (!providers.length) return null;

    const start = Date.now();
    const uploadSize = req.type === 'vision'
      ? (req.images || []).reduce(function(s, d){ return s + (typeof d === 'string' ? d.length : 0); }, 0)
      : 0;

    aiLog('start', {
      type: req.type,
      uploadSizeBytes: uploadSize,
      queueSize: _queue.length,
      providers: providers.map(function(p){ return p.id; })
    });

    const delays = (AI_CONFIG.retry && AI_CONFIG.retry.delaysMs) || [5000, 15000, 30000, 60000];
    const maxAttempts = (AI_CONFIG.retry && AI_CONFIG.retry.maxAttempts) || delays.length;
    const count = providers.length;

    for (let pi = 0; pi < count; pi++) {
      const p = providers[(_providerIdx + pi) % count];

      // cooldown check — provider recently fail hua toh skip
      const failUntil = _providerFailUntil[p.id] || 0;
      if (failUntil > Date.now()) {
        aiLog('skip', { provider: p.id, retryInMs: failUntil - Date.now() });
        continue;
      }

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (_epoch !== myEpoch) return null;   // cancel ho chuka

        const ctrl = new AbortController();
        _activeCtrl = ctrl;

        aiLog('send', { provider: p.id, retryCount: attempt, queueSize: _queue.length });

        let res = null;
        try {
          res = await safeSend(p, req, ctrl);
        } finally {
          if (_activeCtrl === ctrl) _activeCtrl = null;
        }

        if (_epoch !== myEpoch) return null;

        // success
        if (res && res.ok && res.text) {
          _providerIdx = (_providerIdx + pi + 1) % count;
          if (p.id === 'gemini') window.lastGeminiStatus = 0;
          aiLog('success', {
            provider: p.id,
            responseMs: Date.now() - start,
            textLen: res.text.length
          });
          notify({ type: 'success', provider: p.id });
          return res.text;
        }

        if (p.id === 'gemini') window.lastGeminiStatus = (res && res.status) || 0;

        const cls = classify(res);
        aiLog('fail', {
          provider: p.id,
          status: res && res.status,
          errorType: res && res.errorType,
          retryable: cls.retryable,
          switchable: cls.switchable
        });

        // invalid request (400/404/413/422/aborted/no-key) →
        // retry nahi, switch nahi
        if (!cls.switchable) {
          notify({ type: 'fatal' });
          return null;
        }

        // retryable → exponential backoff, phir same provider.
        // Par agar network error turant aya (<3s) to provider reach
        // hi nahi ho raha (DNS/blocked) — retry se kuch nahi hoga,
        // seedha next provider par switch karo.
        const fastNetDown = res && res.errorType === 'network' &&
          (Date.now() - start) < 3000;
        const is429 = res && res.status === 429;
        const isTimeout = res && res.errorType === 'timeout';
        if (cls.retryable && !fastNetDown && !is429 && !isTimeout && attempt < maxAttempts - 1) {
          const waitMs = delays[attempt] || delays[delays.length - 1];
          aiLog('retry', { provider: p.id, waitMs: waitMs, retryCount: attempt + 1 });
          notify({ type: 'retry', provider: p.id });
          await aiSleep(waitMs);
          continue;
        }

        // retries khatam → switch provider
        const reason = 'status=' + (res && res.status) +
          ((res && res.errorType) ? ' ' + res.errorType : '');
        aiLog('switch', { from: p.id, reason: reason });
        // quota fail (429/403) pe lamba cooldown, transient pe chhota —
        // timeout/network errors seconds me theek ho jate hain
        const quotaFail = res && (res.status === 429 || res.status === 403);
        _providerFailUntil[p.id] = Date.now() +
          (quotaFail ? SKIP_QUOTA_MS : SKIP_TRANSIENT_MS);
        notify({ type: 'switch', from: p.id, reason: reason });
        break;
      }
    }

    aiLog('all-failed', { responseMs: Date.now() - start });
    notify({ type: 'all-failed' });
    return null;
  }

  // ── SAFE SEND: timeout + abort-aware ──────────────────────────
  async function safeSend(p, req, ctrl){
    const timeoutMs = MANUAL_TIMEOUT_MS;
    try {
      // Promise.race: fetch vs manual timeout (CapacitorHttp ignores AbortController)
      const fetchPromise = p.send(req, { signal: ctrl.signal });
      const timeoutPromise = new Promise(function(_, reject){
        setTimeout(function(){ reject(new Error('timeout')); }, timeoutMs);
      });
      const res = await Promise.race([fetchPromise, timeoutPromise]);
      if (res && res.ok === false && res.errorType === 'no-key') return res;
      return res;
    } catch (err) {
      if (err && err.message === 'timeout') {
        return { ok: false, status: 0, errorType: 'timeout' };
      }
      if (ctrl.signal.aborted) {
        if (ctrl.__cancel) return { ok: false, status: 0, errorType: 'aborted' };
        return { ok: false, status: 0, errorType: 'timeout' };
      }
      return { ok: false, status: 0, errorType: 'network' };
    } finally {
      // cleanup — timeout promise auto-garbage-collects
    }
  }

  // ── ABORT ─────────────────────────────────────────────────────
  // User naya image select kare / nayi generation shuru kare →
  // chal raha fetch cancel + queue clear + sirf naya request process.
  function cancelPending(){
    _epoch++;
    if (_activeCtrl) {
      try { _activeCtrl.__cancel = true; _activeCtrl.abort(); } catch(e){}
      _activeCtrl = null;
    }
    const dropped = _queue;
    _queue = [];
    if (dropped.length) {
      aiLog('cancelled', { dropped: dropped.length });
      // drop kiye hue requests ko settle karo — warna caller hang rahega
      dropped.forEach(function(item){
        try { item.resolve(null); } catch(e){}
      });
    }
  }

  function onStatus(cb){
    _statusListeners.push(cb);
    return function(){
      _statusListeners = _statusListeners.filter(function(x){ return x !== cb; });
    };
  }

  return {
    // ek reusable central service — koi duplicated Gemini code nahi
    askText: function(prompt, systemPrompt, maxTokens, jsonMode){
      return enqueue({
        type: 'text',
        prompt: prompt || '',
        systemPrompt: systemPrompt || '',
        maxTokens: maxTokens || 250,
        jsonMode: !!jsonMode,
        images: []
      });
    },
    askVision: function(images, prompt, systemPrompt, maxTokens){
      return enqueue({
        type: 'vision',
        prompt: prompt || '',
        systemPrompt: systemPrompt || '',
        maxTokens: maxTokens || 4000,
        images: images || []
      });
    },
    switchProvider: function(){ _providerIdx = (_providerIdx + 1) % Math.max(1, (window.getAIProviders ? window.getAIProviders().length : 1)); },
    cancelPending: cancelPending,
    onStatus: onStatus,
    getQueueSize: function(){ return _queue.length; }
  };
})();
