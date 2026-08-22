// ════════════════════════════════════════════════════════════════
// IMAGE OPTIMIZER — class ke hisaab se adaptive compression
// ----------------------------------------------------------------
// Max width + JPEG quality config.js se aati hai (AI_CONFIG.image).
// Class level upload modal ke <select id="classLevelSelect"> se.
// Chhoti class = chhoti image (quota bachao),
// badi class = badi image (dense pages readable).
// ════════════════════════════════════════════════════════════════

const ImageOptimizer = (function(){

  function currentClassLevel(){
    try {
      const el = document.getElementById('classLevelSelect');
      const v = el ? parseInt(el.value, 10) : NaN;
      if (!isNaN(v) && v > 0) return v;
    } catch(e){}
    try {
      const lh = localStorage.getItem('lh_classLevel');
      const v = lh ? parseInt(lh, 10) : NaN;
      if (!isNaN(v) && v > 0) return v;
    } catch(e){}
    return 3;
  }

  // class → { maxWidth, quality }
  function settingsForClass(classLevel){
    const level = classLevel || currentClassLevel();
    const out = {
      maxWidth: AI_CONFIG.image.defaultMaxWidth,
      quality: AI_CONFIG.image.defaultQuality
    };
    (AI_CONFIG.image.classLevels || []).forEach(function(band){
      if (level >= band.minClass && level <= band.maxClass) {
        out.maxWidth = band.maxWidth;
        out.quality = band.quality;
      }
    });
    return out;
  }

  // dataUrl → optimized JPEG dataUrl.
  // opts.classLevel nahi diya to auto detect hota hai.
  function compress(dataUrl, opts){
    opts = opts || {};
    return new Promise(function(resolve){
      if (typeof dataUrl !== 'string') { resolve(dataUrl); return; }
      let img;
      try { img = new Image(); } catch(e){ resolve(dataUrl); return; }
      img.onload = function(){
        try {
          const w0 = img.naturalWidth;
          const h0 = img.naturalHeight;
          if (!w0 || !h0) { resolve(dataUrl); return; }
          const s = settingsForClass(opts.classLevel);
          const maxWidth = opts.maxWidth || s.maxWidth;
          const quality = (typeof opts.quality === 'number') ? opts.quality : s.quality;
          let w = w0;
          let h = h0;
          if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
          const c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(c.toDataURL('image/jpeg', quality));
        } catch(err){ resolve(dataUrl); }
      };
      img.onerror = function(){ resolve(dataUrl); };
      img.src = dataUrl;
    });
  }

  // ── AUTO CROP ───────────────────────────────────────────────────
  // Photo me textbook page dhundh ke baaki background (table, haath,
  // shadow) hata deta hai → chhoti image + AI ko clean input.
  // Lightweight: analysis sirf ~240px canvas pe hoti hai (low-end
  // devices pe fast), phir detected rectangle proportionally full-res
  // pe apply hota hai.
  // Conservative: confident page region na mile to original image
  // waisi ki waisi pass hoti hai — kabhi andaaza laga ke content
  // cut nahi karte.

  function _log(msg){
    try { console.log('[AI]', new Date().toISOString().slice(11, 19), 'optimizer', msg); } catch(e){}
  }

  // page ka normalized rect detect karo (ya null = crop skip).
  // v3 CASCADE — 2 strategies, jo pehle confident ho wahi jeetata hai:
  //   A) Background-profile: coarse color bins + cluster merge se bg,
  //      mask-only profiles + iterative margin-trim (sirf bilkul khaali
  //      kinare cut hote hain), content-concentration check.
  //   B) Bright-blob fallback: jab kinare mixed hon (haath/copy cover/
  //      shadow) — page frame ka sabse bada BRIGHT connected block hota
  //      hai; uska bbox lo. Fill-density gate loose blobs reject karta hai.
  // Safety: dono strategies me content kata nahi jaata — trim sirf
  // <15%-mass khaali boundary hatata hai, plausibility+fill gates galat
  // box reject karte hain, aur 5% padding har taraf di jaati hai.
  function _detectPageBox(img){
    const w0 = img.naturalWidth;
    const h0 = img.naturalHeight;
    if (!w0 || !h0) return null;

    // 1) analysis canvas — chhota resolution (speed ke liye)
    const AMAX = 240;
    const sc = Math.min(1, AMAX / Math.max(w0, h0));
    const aw = Math.max(48, Math.round(w0 * sc));
    const ah = Math.max(48, Math.round(h0 * sc));
    const ac = document.createElement('canvas');
    ac.width = aw;
    ac.height = ah;
    const actx = ac.getContext('2d', { willReadFrequently: true });
    actx.drawImage(img, 0, 0, aw, ah);
    let px;
    try { px = actx.getImageData(0, 0, aw, ah).data; } catch(e){ return null; }
    const n = aw * ah;
    const gray = new Float32Array(n);
    for (let i = 0; i < n; i++){
      const p = i * 4;
      gray[i] = 0.299 * px[p] + 0.587 * px[p + 1] + 0.114 * px[p + 2];
    }

    const ctx = { px: px, gray: gray, n: n, aw: aw, ah: ah };
    const byBg = _detectByBackground(ctx);
    if (byBg){ byBg.src = 'bg'; return byBg; }
    const byBright = _detectByBrightness(ctx);
    if (byBright){ byBright.src = 'bright'; return byBright; }
    return null;
  }

  // ── STRATEGY A: background-cluster profiles ────────────────────
  function _detectByBackground(ctx){
    const px = ctx.px, gray = ctx.gray, n = ctx.n, aw = ctx.aw, ah = ctx.ah;

    // border ring histogram (coarse bins — gradient-proof)
    const hist = {};
    const B = Math.max(3, Math.round(Math.min(aw, ah) * 0.05));
    for (let y = 0; y < ah; y++){
      const ro = y * aw;
      for (let x = 0; x < aw; x++){
        const i = ro + x;
        const p = i * 4;
        if (x < B || y < B || x >= aw - B || y >= ah - B){
          const key = ((px[p] >> 5) << 10) | ((px[p + 1] >> 5) << 5) | (px[p + 2] >> 5);
          hist[key] = (hist[key] || 0) + 1;
        }
      }
    }
    let brTot = 0, seedKey = -1, seedCnt = 0;
    for (const k in hist){ brTot += hist[k]; if (hist[k] > seedCnt){ seedCnt = hist[k]; seedKey = +k; } }
    if (!brTot || seedKey < 0) return null;

    // dominant bin ke center ke aas-paas ke bins merge karo — shadow/
    // lighting gradient ek hi background cluster ban jata hai
    const sr = ((seedKey >> 10) & 31) * 32 + 16;
    const sg = ((seedKey >> 5) & 31) * 32 + 16;
    const sb = (seedKey & 31) * 32 + 16;
    let mCnt = 0, mr = 0, mg = 0, mb = 0;
    for (const k in hist){
      const kr = ((+k >> 10) & 31) * 32 + 16;
      const kg = ((+k >> 5) & 31) * 32 + 16;
      const kb = (+k & 31) * 32 + 16;
      if (Math.abs(kr - sr) + Math.abs(kg - sg) + Math.abs(kb - sb) <= 96){
        mCnt += hist[k];
        mr += kr * hist[k];
        mg += kg * hist[k];
        mb += kb * hist[k];
      }
    }
    // border ring mein merged cluster bhi dominant nahi (haath/clutter
    // frame kinare tak) → background estimate unreliable → next strategy
    if (mCnt / brTot < 0.22) return null;
    const bgr = Math.round(mr / mCnt);
    const bgg = Math.round(mg / mCnt);
    const bgb = Math.round(mb / mCnt);

    // flat/washed photo me kuch reliable detect nahi hota
    let s1 = 0, s2 = 0;
    for (let i = 0; i < n; i++){ s1 += gray[i]; s2 += gray[i] * gray[i]; }
    const mean = s1 / n;
    const std = Math.sqrt(Math.max(0, s2 / n - mean * mean));
    if (std < 14) return null;

    // content mask (bg se alag pixels) + projection masses
    const T = 88; // sum-abs color distance threshold (~29/channel avg)
    const mask = new Uint8Array(n);
    const colM = new Float32Array(aw), rowM = new Float32Array(ah);
    let mTot = 0;
    for (let y = 0; y < ah; y++){
      const ro = y * aw;
      for (let x = 0; x < aw; x++){
        const i = ro + x;
        const p = i * 4;
        const d = Math.abs(px[p] - bgr) + Math.abs(px[p + 1] - bgg) + Math.abs(px[p + 2] - bgb);
        if (d > T){ mask[i] = 1; mTot++; colM[x]++; rowM[y]++; }
      }
    }
    // content frame ka bahut chhota hissa = noise false positive;
    // lagbhag poora frame alag = background estimate hi galat tha
    const fr = mTot / n;
    if (fr < 0.06 || fr > 0.94) return null;

    // initial bounds @25% of peak, phir khaali kinare trim karo
    // (mass < 15% of max wali boundary rows/cols — content-line ki
    // mass ~40-60% hoti hai, wo kabhi cut nahi hoti)
    function _peak(a, len){
      let mx = 0;
      for (let i = 0; i < len; i++) if (a[i] > mx) mx = a[i];
      return mx;
    }
    const colMax = _peak(colM, aw);
    const rowMax = _peak(rowM, ah);
    if (colMax <= 0 || rowMax <= 0) return null;
    let bx0 = 0, bx1 = aw - 1, by0 = 0, by1 = ah - 1;
    while (bx0 < bx1 && colM[bx0] < colMax * 0.25) bx0++;
    while (bx1 > bx0 && colM[bx1] < colMax * 0.25) bx1--;
    while (by0 < by1 && rowM[by0] < rowMax * 0.25) by0++;
    while (by1 > by0 && rowM[by1] < rowMax * 0.25) by1--;
    for (let iter = 0; iter < 6; iter++){
      let changed = false;
      const tC = colMax * 0.15;
      const tR = rowMax * 0.15;
      while (by0 < by1 && rowM[by0] < tR){ by0++; changed = true; }
      while (by1 > by0 && rowM[by1] < tR){ by1--; changed = true; }
      while (bx0 < bx1 && colM[bx0] < tC){ bx0++; changed = true; }
      while (bx1 > bx0 && colM[bx1] < tC){ bx1--; changed = true; }
      if (!changed) break;
    }

    // plausibility checks — confident nahi to next strategy better
    const bwf = (bx1 - bx0 + 1) / aw;
    const bhf = (by1 - by0 + 1) / ah;
    if (bwf < 0.35 || bhf < 0.35) return null;   // bahut chhota region
    if (bwf * bhf > 0.92) return null;           // gain < ~8%, bekaar
    const ar = bwf / bhf;
    if (ar < 0.38 || ar > 2.6) return null;      // implausible shape

    // box ke andar kitna % content masa hai — content poore frame me
    // bikhra ho (concentration kam) to box par bharosa nahi → skip
    let inside = 0;
    for (let y = by0; y <= by1; y++){
      const ro = y * aw;
      for (let x = bx0; x <= bx1; x++) if (mask[ro + x]) inside++;
    }
    if (inside / mTot < 0.55) return null;

    return { x0: bx0 / aw, y0: by0 / ah, x1: (bx1 + 1) / aw, y1: (by1 + 1) / ah };
  }

  // ── STRATEGY B: brightest-large-region blob ────────────────────
  // Kinare mixed hon (haath, copy cover, shadow) tab bhi page frame ka
  // sabse bada BRIGHT connected block hota hai. Adaptive threshold =
  // min(fixed, 90th-percentile*0.92). Loose/garbage blobs fill-gate se
  // reject hote hain.
  function _detectByBrightness(ctx){
    const px = ctx.px, n = ctx.n, aw = ctx.aw, ah = ctx.ah;

    // luminance + 90th percentile
    const lums = new Float32Array(n);
    for (let i = 0; i < n; i++) lums[i] = ctx.gray[i];
    const sorted = Float32Array.from(lums).sort();
    const p90 = sorted[Math.floor(n * 0.90)];
    const thr = Math.min(170, p90 * 0.92);

    // bright mask + largest 4-connected component (BFS)
    const lab = new Int32Array(n);
    const q = new Int32Array(n);
    let nl = 0, best = 0, bestSz = 0;
    for (let s = 0; s < n; s++){
      if (lab[s]) continue;                    // visited (label ya -1)
      if (lums[s] < thr){ lab[s] = -1; continue; }
      nl++;
      let head = 0, tail = 0, sz = 0;
      q[tail++] = s; lab[s] = nl;
      while (head < tail){
        const i = q[head++];
        sz++;
        const x = i % aw, y = (i / aw) | 0;
        if (x > 0 && !lab[i - 1]){
          if (lums[i - 1] >= thr){ lab[i - 1] = nl; q[tail++] = i - 1; } else lab[i - 1] = -1;
        }
        if (x < aw - 1 && !lab[i + 1]){
          if (lums[i + 1] >= thr){ lab[i + 1] = nl; q[tail++] = i + 1; } else lab[i + 1] = -1;
        }
        if (y > 0 && !lab[i - aw]){
          if (lums[i - aw] >= thr){ lab[i - aw] = nl; q[tail++] = i - aw; } else lab[i - aw] = -1;
        }
        if (y < ah - 1 && !lab[i + aw]){
          if (lums[i + aw] >= thr){ lab[i + aw] = nl; q[tail++] = i + aw; } else lab[i + aw] = -1;
        }
      }
      if (sz > bestSz){ bestSz = sz; best = nl; }
    }
    // blob chhota (noise/highlight) ya frame ka bahut bada hissa
    // (background hi bright tha) → crop bekaar
    if (!best || bestSz < n * 0.10 || bestSz > n * 0.85) return null;

    let x0 = aw, x1 = -1, y0 = ah, y1 = -1, cnt = 0;
    for (let y = 0; y < ah; y++){
      const ro = y * aw;
      for (let x = 0; x < aw; x++){
        if (lab[ro + x] === best){
          cnt++;
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }

    const bwf = (x1 - x0 + 1) / aw;
    const bhf = (y1 - y0 + 1) / ah;
    if (bwf < 0.35 || bhf < 0.35) return null;
    if (bwf * bhf > 0.92) return null;
    const ar = bwf / bhf;
    if (ar < 0.38 || ar > 2.6) return null;
    // bbox ke andar blob kitna bhara hai — L-shaped/loose blob (do alag
    // cheezein jude hue) reject karta hai
    if (cnt / ((x1 - x0 + 1) * (y1 - y0 + 1)) < 0.55) return null;

    return { x0: x0 / aw, y0: y0 / ah, x1: (x1 + 1) / aw, y1: (y1 + 1) / ah };
  }

  // dataUrl → cropped dataUrl (confident na ho to original hi wapas).
  // compress() jaisa hi pattern: kabhi reject/throw nahi karta.
  function autoCrop(dataUrl){
    return new Promise(function(resolve){
      if (typeof dataUrl !== 'string') { resolve(dataUrl); return; }
      let img;
      try { img = new Image(); } catch(e){ resolve(dataUrl); return; }
      img.onload = function(){
        try {
          const w0 = img.naturalWidth;
          const h0 = img.naturalHeight;
          const box = (w0 && h0) ? _detectPageBox(img) : null;
          if (!box){ _log('auto-crop: skip (page region confident nahi mila)'); resolve(dataUrl); return; }

          // full-res pe proportional crop + 5% padding (text edge se
          // katne se bachne ke liye)
          const padX = Math.round((box.x1 - box.x0) * w0 * 0.05);
          const padY = Math.round((box.y1 - box.y0) * h0 * 0.05);
          const cx0 = Math.max(0, Math.round(box.x0 * w0) - padX);
          const cy0 = Math.max(0, Math.round(box.y0 * h0) - padY);
          const cx1 = Math.min(w0, Math.round(box.x1 * w0) + padX);
          const cy1 = Math.min(h0, Math.round(box.y1 * h0) + padY);
          const cw = cx1 - cx0;
          const ch = cy1 - cy0;
          if (cw < 60 || ch < 60 || (cw / w0 > 0.985 && ch / h0 > 0.985)){
            _log('auto-crop: skip (gain marginal)');
            resolve(dataUrl);
            return;
          }
          const c = document.createElement('canvas');
          c.width = cw;
          c.height = ch;
          c.getContext('2d').drawImage(img, cx0, cy0, cw, ch, 0, 0, cw, ch);
          const out = c.toDataURL('image/jpeg', 0.95);
          _log('auto-crop: applied [' + (box.src || 'bg') + '] ' +
               Math.round(cw / w0 * 100) + '%x' + Math.round(ch / h0 * 100) +
               '% | size ' + Math.round(sizeOf(dataUrl) / 1024) + 'KB -> ' + Math.round(sizeOf(out) / 1024) + 'KB');
          resolve(out);
        } catch(err){
          _log('auto-crop: error, original pass kiya — ' + (err && err.message ? err.message : err));
          resolve(dataUrl);
        }
      };
      img.onerror = function(){ resolve(dataUrl); };
      img.src = dataUrl;
    });
  }

  // base64 dataURL ka approx byte size (upload size logging ke liye)
  function sizeOf(dataUrl){
    if (typeof dataUrl !== 'string') return 0;
    const comma = dataUrl.indexOf(',');
    const b64 = comma > -1 ? dataUrl.slice(comma + 1) : dataUrl;
    return Math.round((b64.length * 3) / 4);
  }

  return {
    compress: compress,
    autoCrop: autoCrop,
    sizeOf: sizeOf,
    settingsForClass: settingsForClass,
    currentClassLevel: currentClassLevel
  };
})();
