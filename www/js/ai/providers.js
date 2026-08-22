// ════════════════════════════════════════════════════════════════
// AI PROVIDERS — Adapters
// ----------------------------------------------------------------
// - Gemini: custom generateContent format.
// - Baaki sab: OpenAI-compatible /chat/completions format
//   (OpenRouter, NVIDIA NIM, OpenAI, Claude, Groq, DeepSeek...).
//
// Naya OpenAI-compatible provider = sirf config.js me entry daalo.
// Naya custom provider = niche ek adapter object banao (return {ok,text}
//   ya {ok:false,status,errorType}) aur config.js me entry daalo.
// ════════════════════════════════════════════════════════════════

function _aiKeyFrom(keyStorage, keyInput){
  if (Array.isArray(keyStorage)) {
    for (let i = 0; i < keyStorage.length; i++) {
      try {
        const v = localStorage.getItem(keyStorage[i]);
        if (v && v.trim()) return v.trim().replace(/^["']+|["']+$/g, '');
      } catch(e){}
    }
  }
  if (keyInput) {
    try {
      const el = document.getElementById(keyInput);
      if (el && el.value && el.value.trim()) return el.value.trim().replace(/^["']+|["']+$/g, '');
    } catch(e){}
  }
  return '';
}

// dataURL → { mimeType, data(base64) }
function _aiBase64Parts(images){
  return (images || []).map(function(dataUrl){
    if (typeof dataUrl !== 'string') return { mimeType: 'image/jpeg', data: '' };
    const comma = dataUrl.indexOf(',');
    const header = comma > -1 ? dataUrl.slice(0, comma) : '';
    const body = comma > -1 ? dataUrl.slice(comma + 1) : dataUrl;
    const mimeType = (header.split(';')[0].split(':')[1]) || 'image/jpeg';
    return { mimeType: mimeType, data: body };
  });
}

// ── GEMINI ADAPTER (custom format) ──────────────────────────────
function createGeminiAdapter(cfg){
  return {
    id: cfg.id,
    name: cfg.name,
    models: cfg.models,

    // server proxy available ho (bina client key) to bhi chalega
    async isAvailable(){
      if (window.__syncConnected) return true;
      return !!_aiKeyFrom(cfg.keyStorage, cfg.keyInput);
    },

    // Server proxy pehle try — API key server par rehti hai
    async tryServer(body){
      if (!window.__syncConnected) return null;
      try {
        const res = await fetch((window.SYNC_URL || '') + '/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: body, model: cfg.models.text })
        });
        if (!res.ok) return null;
        const data = await res.json();
        const cand = data && data.candidates && data.candidates[0];
        const text = (cand && cand.content && cand.content.parts &&
          cand.content.parts[0].text) || null;
        if (!text) return null;
        return {
          text: text,
          truncated: cand.finishReason === 'MAX_TOKENS'
        };
      } catch(e){ return null; }
    },

    async send(req, ctx){
      const bodyObj = {
        contents: [{
          role: 'user',
          parts: req.type === 'vision'
            ? [{ text: req.prompt }].concat(_aiBase64Parts(req.images).map(function(p){
                return { inlineData: { mimeType: p.mimeType, data: p.data } };
              }))
            : [{ text: req.prompt }]
        }],
        generationConfig: {
          maxOutputTokens: req.maxTokens,
          temperature: 0.7,
          topP: 0.95
        }
      };
      if (req.systemPrompt) bodyObj.systemInstruction = { parts: [{ text: req.systemPrompt }] };
      if (req.jsonMode) bodyObj.generationConfig.responseMimeType = 'application/json';
      const body = JSON.stringify(bodyObj);

      const serverText = await this.tryServer(body);
      if (serverText && !serverText.truncated) return { ok: true, text: serverText.text };

      const key = _aiKeyFrom(cfg.keyStorage, cfg.keyInput);
      if (!key) {
        // proxy ka text cut gaya tha aur client key nahi — aadha jawab
        // bhi jawab hai, fail se behtar (warna cooldown chain shuru hoti hai)
        if (serverText && serverText.text) return { ok: true, text: serverText.text };
        return { ok: false, status: 0, errorType: 'no-key' };
      }

      const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
        cfg.models[req.type] + ':generateContent?key=' + encodeURIComponent(key);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        signal: ctx.signal
      });
      const data = await res.json().catch(function(){ return {}; });
      if (res.ok && !data.error) {
        const cand = data.candidates && data.candidates[0];
        const text = (cand && cand.content && cand.content.parts &&
          cand.content.parts[0].text) || null;
        if (text) {
          // MAX_TOKENS (cut hua output) bhi success maano — aadha jawab
          // poore fail se behtar, warna cooldown-chain sab band kar deti hai
          return { ok: true, text: text };
        }
        return { ok: false, status: res.status, errorType: null };
      }
      return { ok: false, status: res.status, errorType: null };
    }
  };
}

// ── OPENAI-COMPATIBLE ADAPTER (OpenRouter / NVIDIA / Groq / ...) ─
function createOpenAIAdapter(cfg){
  return {
    id: cfg.id,
    name: cfg.name,
    models: cfg.models,
    endpoint: cfg.endpoint,

    async isAvailable(){
      // proxy config ho to key check ke bina bhi available (key server par)
      if (cfg.proxy) return true;
      return !!_aiKeyFrom(cfg.keyStorage, cfg.keyInput);
    },

    async send(req, ctx){
      const key = _aiKeyFrom(cfg.keyStorage, cfg.keyInput);
      if (!key) return { ok: false, status: 0, errorType: 'no-key' };
      const model = cfg.models[req.type] || cfg.models.text;

      let content;
      if (req.type === 'vision') {
        content = [{ type: 'text', text: req.prompt }];
        _aiBase64Parts(req.images).forEach(function(p){
          content.push({ type: 'image_url', image_url: { url: 'data:' + p.mimeType + ';base64,' + p.data } });
        });
      } else {
        content = req.prompt;
      }

      const messages = [];
      if (req.systemPrompt) messages.push({ role: 'system', content: req.systemPrompt });
      messages.push({ role: 'user', content: content });

      const body = JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: req.maxTokens,
        temperature: 0.7
      });

      // server proxy configured ho to pehle wahan bhejo (key server par,
      // browser CORS issues bhi avoid hoti hain)
      if (cfg.proxy) {
        try {
          const base = (typeof SL_SERVER !== 'undefined' && SL_SERVER) || '';
          const res = await fetch(base + cfg.proxy, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: model, body: body }),
            signal: ctx.signal
          });
          const data = await res.json().catch(function(){ return {}; });
          if (res.ok && data.choices && data.choices[0]) {
            const c = data.choices[0].message && data.choices[0].message.content;
            let text = null;
            if (typeof c === 'string') text = c;
            else if (Array.isArray(c)) text = c.map(function(x){ return (x && x.text) || ''; }).join('');
            if (text && text.trim()) {
              // finish_reason = 'length' (cut hua output) bhi success —
              // aadha jawab fail se behtar
              return { ok: true, text: text };
            }
            return { ok: false, status: res.status, errorType: null };
          }
          return { ok: false, status: res.status, errorType: null };
        } catch(e){
          // proxy fail → direct try karo (agar key ho)
        }
      }

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key
        },
        body: body,
        signal: ctx.signal
      });
      const data = await res.json().catch(function(){ return {}; });
      if (res.ok && data.choices && data.choices[0]) {
        const c = data.choices[0].message && data.choices[0].message.content;
        let text = null;
        if (typeof c === 'string') text = c;
        else if (Array.isArray(c)) text = c.map(function(x){ return (x && x.text) || ''; }).join('');
        if (text && text.trim()) {
          // finish_reason = length → output cut hai (max_tokens hit),
          // phir bhi success — aadha jawab > cooldown-chain
          return { ok: true, text: text };
        }
        return { ok: false, status: res.status, errorType: null };
      }
      return { ok: false, status: res.status, errorType: null };
    }
  };
}

// ── REGISTRY ────────────────────────────────────────────────────
// config.js me jo providers enabled hain, unke adapters banao.
// Sirf wahi providers aate hain jinke paas key hai (ya Gemini ka
// server-proxy path active hai) — bina key wale skip hote hain,
// kyunki unhe fatal error nahi maana jaata.
function _providerHasKey(cfg){
  if (cfg.proxy) return true;                       // server proxy configured → key server par
  if (cfg.apiKey && cfg.apiKey.trim()) return true;
  return !!_aiKeyFrom(cfg.keyStorage, cfg.keyInput);
}

function getAIProviders(){
  const list = [];
  (AI_CONFIG.providers || []).forEach(function(cfg){
    if (cfg.enabled === false) return;
    // config.apiKey ho to localStorage me daal do (runtime override),
    // par sirf tab jab wahan pehle se koi key na ho
    if (cfg.apiKey && cfg.apiKey.trim()) {
      const store = (cfg.keyStorage && cfg.keyStorage[0]) || null;
      if (store) {
        try { if (!localStorage.getItem(store)) localStorage.setItem(store, cfg.apiKey.trim()); } catch(e){}
      }
    }
    // gemini ka server-proxy path bina client key bhi chal sakta hai
    const geminiProxy = (!cfg.openaiCompat && !!window.__syncConnected);
    if (!geminiProxy && !_providerHasKey(cfg)) return;
    const adapter = cfg.openaiCompat ? createOpenAIAdapter(cfg) : createGeminiAdapter(cfg);
    list.push(adapter);
  });
  return list;
}

// kya koi bhi provider usable hai (kuch key available)?
function hasAnyAIKey(){
  return (AI_CONFIG.providers || []).some(function(cfg){
    if (cfg.enabled === false) return false;
    if (!cfg.openaiCompat && window.__syncConnected) return true;
    return _providerHasKey(cfg);
  });
}
