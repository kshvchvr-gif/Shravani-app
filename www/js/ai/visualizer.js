// ════════════════════════════════════════════════════════════════
// VISUALIZER — Educational Infographic Generator
// ----------------------------------------------------------------
// RAG context + AI answer se Canvas pe infographic banata hai.
// Pollinations.ai se background illustration generate hota hai.
// Text overlay Canvas API se hota hai (clean, readable).
//
// Flow:
//   1. RAG chunks + answer + language → buildPrompt()
//   2. Prompt → Pollinations.ai → background image
//   3. Canvas pe: background + text overlay = infographic
//   4. Return as <img> element
// ════════════════════════════════════════════════════════════════

const Visualizer = (function(){

  var W = 720;   // canvas width
  var H = 1280;  // canvas height (phone screen ratio)
  var PAD = 36;  // padding

  // ── IMAGE PROMPT BUILDER ────────────────────────────────────
  // RAG context se educational image prompt banata hai
  function buildImagePrompt(chunks, lang){
    if (!chunks || !chunks.length) return null;
    var heading = chunks[0].heading || 'Education';
    var chapter = chunks[0].chapterName || '';

    var base = 'Educational illustration for students, ';
    var style = ', colorful cartoon style, clean simple design, white background, no text in image';

    if (lang === 'hi') {
      return encodeURIComponent(base + chapter + ' - ' + heading + style);
    }
    return encodeURIComponent(base + chapter + ' - ' + heading + style);
  }

  // ── TEXT EXTRACTION FROM RAG CHUNKS ─────────────────────────
  function extractKeyPoints(chunks, lang, maxPoints){
    maxPoints = maxPoints || 5;
    var points = [];
    for (var i = 0; i < chunks.length && points.length < maxPoints; i++){
      var c = chunks[i];
      if (!c.text) continue;

      // text se meaningful lines nikalo
      var lines = c.text.split(/[.।|]/);
      for (var j = 0; j < lines.length && points.length < maxPoints; j++){
        var line = lines[j].trim();
        // bahut chhota ya sirf heading skip
        if (line.length < 15) continue;
        // pipe separator se English part lo
        if (lang === 'en' && line.indexOf('|') > -1){
          line = line.split('|')[0].trim();
        }
        // bullet point banao
        if (line.length > 80) line = line.substring(0, 77) + '...';
        if (points.indexOf(line) === -1) points.push(line);
      }
    }
    return points;
  }

  // ── WRAP TEXT UTILITY ───────────────────────────────────────
  function wrapText(ctx, text, maxW){
    var words = text.split(' ');
    var lines = [];
    var line = '';
    for (var i = 0; i < words.length; i++){
      var test = line + (line ? ' ' : '') + words[i];
      if (ctx.measureText(test).width > maxW && line){
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // ── DRAW ROUNDED RECT ──────────────────────────────────────
  function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  // ── MAIN: GENERATE INFOGRAPHIC ─────────────────────────────
  async function generate(opts){
    var chunks = opts.chunks || [];
    var answer = opts.answer || '';
    var lang = opts.lang || 'en';
    var subjectName = opts.subjectName || '';
    var chapterName = opts.chapterName || '';
    var heading = (chunks.length && chunks[0].heading) || '';

    console.log('[VIS] Generating infographic —', heading, 'lang:', lang, 'chunks:', chunks.length);

    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');

    // Step 1: Load background image from Pollinations.ai
    var imgLoaded = false;
    var bgImg = null;
    var imgPrompt = buildImagePrompt(chunks, lang);
    if (imgPrompt){
      console.log('[VIS] Fetching background image from Pollinations.ai...');
      bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      try {
        await new Promise(function(resolve, reject){
          bgImg.onload = function(){ imgLoaded = true; console.log('[VIS] Background image loaded ✅'); resolve(); };
          bgImg.onerror = function(){ console.log('[VIS] Background image failed ❌'); reject(); };
          bgImg.src = 'https://image.pollinations.ai/prompt/' + imgPrompt + '?width=' + W + '&height=' + H + '&nologo=true';
          // 8s timeout
          setTimeout(function(){ if(!imgLoaded){ console.log('[VIS] Background image timeout ⏰'); reject(); } }, 8000);
        });
      } catch(e){ imgLoaded = false; }
    }

    // Step 2: Draw background
    if (imgLoaded){
      // semi-transparent white overlay on image for text readability
      ctx.globalAlpha = 0.15;
      ctx.drawImage(bgImg, 0, 0, W, H);
      ctx.globalAlpha = 1.0;
      // white overlay
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.fillRect(0, 0, W, H);
    } else {
      // fallback: gradient background
      var grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#f0f4ff');
      grad.addColorStop(1, '#e8f5e9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    // Step 3: Draw text overlay
    var y = PAD;
    var textW = W - (PAD * 2);

    // Title bar
    ctx.fillStyle = '#1a237e';
    roundRect(ctx, PAD, y, textW, 60, 14);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Nunito, sans-serif';
    ctx.textAlign = 'center';
    var titleText = heading || (lang === 'hi' ? 'शिक्षा' : 'Learn');
    if (titleText.length > 35) titleText = titleText.substring(0, 32) + '...';
    ctx.fillText(titleText, W / 2, y + 42);
    ctx.textAlign = 'left';
    y += 74;

    // Subject + Chapter tag
    var tagParts = [];
    if (subjectName) tagParts.push(subjectName);
    if (chapterName) tagParts.push(chapterName);
    if (tagParts.length){
      ctx.font = '16px Nunito, sans-serif';
      var tagText = tagParts.join(' · ');
      var tagW = ctx.measureText(tagText).width + 16;
      ctx.fillStyle = '#e8eaf6';
      roundRect(ctx, PAD, y, tagW + 4, 30, 8);
      ctx.fill();
      ctx.fillStyle = '#3949ab';
      ctx.fillText(tagText, PAD + 8, y + 20);
      y += 44;
    }

    // Key Points
    var points = extractKeyPoints(chunks, lang, 8);
    var sectionLabel = lang === 'hi' ? '📚 मुख्य बिंदु' : '📚 Key Points';
    ctx.fillStyle = '#283593';
    ctx.font = 'bold 26px Nunito, sans-serif';
    ctx.fillText(sectionLabel, PAD, y + 26);
    y += 42;

    ctx.font = '20px Nunito, sans-serif';
    ctx.fillStyle = '#333';
    for (var i = 0; i < points.length; i++){
      var bulletLines = wrapText(ctx, '• ' + points[i], textW - 8);
      for (var k = 0; k < bulletLines.length; k++){
        if (y > H - 200) break;
        ctx.fillText(bulletLines[k], PAD + 4, y + 20);
        y += 28;
      }
      y += 8;
      if (y > H - 200) break;
    }
    y += 12;

    // Answer summary box
    if (answer && y < H - 200){
      var ansLabel = lang === 'hi' ? '💡 समझाइए' : '💡 Explanation';
      ctx.fillStyle = '#1b5e20';
      ctx.font = 'bold 24px Nunito, sans-serif';
      ctx.fillText(ansLabel, PAD, y + 24);
      y += 34;

      var ansShort = answer;
      if (ansShort.length > 350) ansShort = ansShort.substring(0, 347) + '...';

      ctx.fillStyle = '#e8f5e9';
      roundRect(ctx, PAD, y, textW, H - y - PAD - 40, 12);
      ctx.fill();

      ctx.fillStyle = '#2e7d32';
      ctx.font = '18px Nunito, sans-serif';
      var ansLines = wrapText(ctx, ansShort, textW - 24);
      for (var a = 0; a < Math.min(ansLines.length, 8); a++){
        ctx.fillText(ansLines[a], PAD + 12, y + 26 + a * 26);
      }
      y += Math.min(ansLines.length, 8) * 26 + 20;
    }

    // Footer
    ctx.fillStyle = '#aaa';
    ctx.font = '14px Nunito, sans-serif';
    ctx.textAlign = 'center';
    var footerText = lang === 'hi' ? 'श्रावणी — तुम्हारा AI शिक्षक' : 'Shravani — Your AI Teacher';
    ctx.fillText(footerText, W / 2, H - 20);
    ctx.textAlign = 'left';

    // Step 4: Return as data URL
    var dataUrl = canvas.toDataURL('image/png');
    console.log('[VIS] Infographic generated ✅ size:', Math.round(dataUrl.length / 1024), 'KB');
    return dataUrl;
  }

  // ── PUBLIC: CREATE IMAGE ELEMENT ───────────────────────────
  async function createInfographic(opts){
    try {
      var dataUrl = await generate(opts);
      if (!dataUrl) return null;
      var img = document.createElement('img');
      img.src = dataUrl;
      img.style.cssText = 'width:100%;max-width:540px;border-radius:12px;margin:8px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1)';
      img.alt = opts.heading || 'Educational Infographic';
      console.log('[VIS] Infographic element ready ✅');
      return img;
    } catch(e) {
      console.warn('[VIS] Infographic failed:', e.message || e);
      return null;
    }
  }

  return {
    generate: generate,
    createInfographic: createInfographic,
    buildImagePrompt: buildImagePrompt
  };

})();
