// ════════════════════════════════════════════════════════════════
// RAG — Retrieval-Augmented Generation
// ----------------------------------------------------------------
// Chapter ke theory sections ko chunks me todta hai, embed karta
// hai, aur query time pe relevant chunks dhundhta hai.
//
// Flow:
//   1. Chapter save → chunkChapter() → embedChunks() → saveRagData()
//   2. Student question → embedQuery() → cosineSearch() → top chunks
//   3. Chunks + question → AI ko bhejo → accurate answer
//
// Storage: localStorage['lh_rag_{subjectId}']
// ════════════════════════════════════════════════════════════════

const RAG = (function(){

  var TOP_N = 3;

  // ── CHUNKING ────────────────────────────────────────────────
  // Chapter ke theory sections ko individual chunks me todta hai.
  // Har section = 1 chunk. theory + theory_hi dono se text uthata hai.
  function chunkChapter(chapter, subjectId, chapterIdx){
    var chunks = [];
    var theory = chapter.theory || {};
    var theoryHi = chapter.theory_hi || {};
    var sections = theory.sections || [];
    var sectionsHi = theoryHi.sections || [];

    for (var i = 0; i < sections.length; i++){
      var s = sections[i];
      var sHi = sectionsHi[i] || {};

      // English text
      var enText = (s.heading || '') + '. ' + (s.content || '');
      if (s.examples && s.examples.length) enText += ' Examples: ' + s.examples.join('; ');
      if (s.list && s.list.length) enText += ' Points: ' + s.list.join('; ');

      // Hindi text
      var hiText = (sHi.heading || '') + '. ' + (sHi.content || '');
      if (sHi.examples && sHi.examples.length) hiText += ' उदाहरण: ' + sHi.examples.join('; ');
      if (sHi.list && sHi.list.length) hiText += ' बिंदु: ' + sHi.list.join('; ');

      // Dono lang ka text combine (embedding ke liye)
      var combined = enText.trim();
      if (hiText.trim() && hiText.trim() !== combined.trim()) {
        combined += ' | ' + hiText.trim();
      }

      if (combined.length < 20) continue; // bahut chhota skip

      chunks.push({
        id: subjectId + '_ch' + chapterIdx + '_s' + i,
        subjectId: subjectId,
        chapterIdx: chapterIdx,
        chapterName: chapter.name || chapter.label || '',
        heading: s.heading || sHi.heading || 'Section ' + (i + 1),
        text: combined,
        embedding: null
      });
    }

    // Exercise questions bhi ek chunk me (extra context)
    var questions = chapter.learn || [];
    if (questions.length > 0) {
      var qText = questions.slice(0, 10).map(function(q){
        return (q.q || '') + ' → ' + (q.a || q.answer || '');
      }).join('. ');
      if (qText.length > 20) {
        chunks.push({
          id: subjectId + '_ch' + chapterIdx + '_q',
          subjectId: subjectId,
          chapterIdx: chapterIdx,
          chapterName: chapter.name || chapter.label || '',
          heading: 'Questions from ' + (chapter.name || ''),
          text: qText,
          embedding: null
        });
      }
    }

    return chunks;
  }

  // ── EMBEDDING ───────────────────────────────────────────────
  // Chunks ki embedding banata hai via Embedder API
  async function embedChunks(chunks, onProgress){
    var texts = chunks.map(function(c){ return c.text; });
    var vectors = await Embedder.embedAll(texts, onProgress);
    if (!vectors) return chunks;
    for (var i = 0; i < chunks.length; i++){
      chunks[i].embedding = vectors[i] || null;
    }
    return chunks;
  }

  // ── STORAGE ─────────────────────────────────────────────────
  function _storageKey(subjectId){
    return 'lh_rag_' + subjectId;
  }

  function saveRagData(subjectId, chunks){
    var existing = loadRagData(subjectId);
    // purane chunks ko naye se replace karo (same chapterIdx ke)
    var chapterIdxs = {};
    chunks.forEach(function(c){ chapterIdxs[c.chapterIdx] = true; });
    var filtered = existing.filter(function(c){ return !chapterIdxs[c.chapterIdx]; });
    var merged = filtered.concat(chunks);
    var data = { chunks: merged, embeddedAt: new Date().toISOString() };
    try {
      localStorage.setItem(_storageKey(subjectId), JSON.stringify(data));
    } catch(e){
      console.warn('[RAG] Storage full, removing oldest chapters');
      // oldest chapter delete karo
      var sorted = merged.slice().sort(function(a,b){ return a.chapterIdx - b.chapterIdx; });
      if (sorted.length > 0) {
        var oldest = sorted[0].chapterIdx;
        merged = merged.filter(function(c){ return c.chapterIdx !== oldest; });
        data = { chunks: merged, embeddedAt: new Date().toISOString() };
        try { localStorage.setItem(_storageKey(subjectId), JSON.stringify(data)); } catch(e2){}
      }
    }
  }

  function loadRagData(subjectId){
    try {
      var raw = localStorage.getItem(_storageKey(subjectId));
      if (!raw) return [];
      var data = JSON.parse(raw);
      return data.chunks || [];
    } catch(e){ return []; }
  }

  function clearRagData(subjectId){
    localStorage.removeItem(_storageKey(subjectId));
  }

  // ── COSINE SIMILARITY ───────────────────────────────────────
  function cosineSimilarity(a, b){
    if (!a || !b || a.length !== b.length) return 0;
    var dot = 0, magA = 0, magB = 0;
    for (var i = 0; i < a.length; i++){
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    var denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }

  // ── SEARCH ──────────────────────────────────────────────────
  // Query embed karo, sab chunks se cosine similarity, top N return
  async function searchRelevant(query, subjectId, topN){
    topN = topN || TOP_N;
    var chunks = loadRagData(subjectId);
    if (!chunks.length){ console.log('[RAG] No chunks for subject', subjectId); return []; }

    console.log('[RAG] Searching', chunks.length, 'chunks for subject', subjectId);

    // Embed query
    var qVec = await Embedder.embedOne(query);
    if (!qVec){ console.log('[RAG] Embed query failed'); return []; }

    // Score every chunk
    var scored = [];
    for (var i = 0; i < chunks.length; i++){
      if (!chunks[i].embedding) continue;
      var score = cosineSimilarity(qVec, chunks[i].embedding);
      scored.push({ chunk: chunks[i], score: score });
    }

    // Sort by score descending
    scored.sort(function(a, b){ return b.score - a.score; });

    var top = scored.slice(0, topN);
    console.log('[RAG] Top results:', top.map(function(s){ return { heading: s.chunk.heading, score: s.score.toFixed(3) }; }));

    // Return top N
    return top.map(function(s){ return s.chunk; });
  }

  // ── SYSTEM PROMPT BUILDER ───────────────────────────────────
  // RAG context ko system prompt me convert karo
  async function getRagContext(question, subjectId){
    console.log('[RAG] getRagContext called — question:', question.substring(0, 60), 'subjectId:', subjectId);
    var chunks = await searchRelevant(question, subjectId, TOP_N);
    if (!chunks.length){ console.log('[RAG] No context found'); return ''; }

    var ctx = chunks.map(function(c){
      return '[' + c.chapterName + ' → ' + c.heading + ']: ' + c.text;
    }).join('\n\n');

    console.log('[RAG] Context ready —', chunks.length, 'chunks, prompt length:', ctx.length);
    return 'Use ONLY this textbook context to answer. Do not add information not present in the context.\n\nTEXTBOOK CONTEXT:\n' + ctx;
  }

  // ── RE-EMBED ALL CHAPTERS ───────────────────────────────────
  // Purane chapters ko re-embed karo (jab RAG pehli baar add ho)
  async function reEmbedAll(subjectId, chapters, onProgress){
    var allChunks = [];
    for (var i = 0; i < chapters.length; i++){
      var ch = chunkChapter(chapters[i], subjectId, i);
      allChunks = allChunks.concat(ch);
    }
    if (onProgress) onProgress(0, allChunks.length, 'chunking');
    var embedded = await embedChunks(allChunks, function(done, total){
      if (onProgress) onProgress(done, total, 'embedding');
    });
    saveRagData(subjectId, embedded);
    return embedded.length;
  }

  // ── GET STATS ───────────────────────────────────────────────
  function getStats(subjectId){
    var chunks = loadRagData(subjectId);
    var chapters = {};
    chunks.forEach(function(c){
      if (!chapters[c.chapterIdx]) chapters[c.chapterIdx] = { name: c.chapterName, chunks: 0 };
      chapters[c.chapterIdx].chunks++;
    });
    return {
      totalChunks: chunks.length,
      chapters: chapters,
      embedded: chunks.length > 0
    };
  }

  return {
    chunkChapter: chunkChapter,
    embedChunks: embedChunks,
    saveRagData: saveRagData,
    loadRagData: loadRagData,
    clearRagData: clearRagData,
    searchRelevant: searchRelevant,
    getRagContext: getRagContext,
    reEmbedAll: reEmbedAll,
    getStats: getStats
  };

})();
