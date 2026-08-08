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

  // base64 dataURL ka approx byte size (upload size logging ke liye)
  function sizeOf(dataUrl){
    if (typeof dataUrl !== 'string') return 0;
    const comma = dataUrl.indexOf(',');
    const b64 = comma > -1 ? dataUrl.slice(comma + 1) : dataUrl;
    return Math.round((b64.length * 3) / 4);
  }

  return {
    compress: compress,
    sizeOf: sizeOf,
    settingsForClass: settingsForClass,
    currentClassLevel: currentClassLevel
  };
})();
