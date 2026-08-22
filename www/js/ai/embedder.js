// ════════════════════════════════════════════════════════════════
// EMBEDDER — Gemini text-embedding-004 adapter
// ----------------------------------------------------------------
// Text → vector (768 dimensions). Batch support.
// Free tier: 1M tokens/day. Sirf naya content embed hota hai.
// ════════════════════════════════════════════════════════════════

const Embedder = (function(){

  const EMBED_MODEL = 'gemini-embedding-2';
  const EMBED_DIMS = 768;
  const BATCH_SIZE = 20;

  function _getKey(){
    try {
      var k = localStorage.getItem('admin_gemini_key');
      if (k) return k;
      var i = document.getElementById('apiKeyInput');
      if (i && i.value && i.value.trim()) return i.value.trim().replace(/^["']+|["']+$/g, '');
      var s = localStorage.getItem('gemini_key');
      if (s) return s.replace(/^["']+|["']+$/g, '');
    } catch(e){}
    return '';
  }

  // Single text embed
  async function embedOne(text){
    var key = _getKey();
    if (!key) return null;
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
      EMBED_MODEL + ':embedContent?key=' + encodeURIComponent(key);
    var body = {
      model: 'models/' + EMBED_MODEL,
      content: { parts: [{ text: text.substring(0, 2000) }] },
      outputDimensionality: EMBED_DIMS
    };
    try {
      var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      var data = await res.json();
      if (data && data.embedding && data.embedding.values) {
        return data.embedding.values;
      }
      var errMsg = (data && data.error && (data.error.message || JSON.stringify(data.error))) || JSON.stringify(data).substring(0, 200);
      console.warn('[Embedder] embedOne failed:', errMsg);
      return null;
    } catch(e){
      console.warn('[Embedder] embedOne error:', e.message || e);
      return null;
    }
  }

  // Batch embed (Gemini batchEmbedContents)
  async function embedBatch(texts){
    var key = _getKey();
    if (!key) return null;
    var url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
      EMBED_MODEL + ':batchEmbedContents?key=' + encodeURIComponent(key);
    var body = {
      requests: texts.map(function(t){
        return {
          model: 'models/' + EMBED_MODEL,
          content: { parts: [{ text: t.substring(0, 2000) }] },
          outputDimensionality: EMBED_DIMS
        };
      })
    };
    try {
      var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      var data = await res.json();
      if (data && data.embeddings) {
        return data.embeddings.map(function(e){ return e.values; });
      }
      var errMsg = (data && data.error && (data.error.message || JSON.stringify(data.error))) || JSON.stringify(data).substring(0, 200);
      console.warn('[Embedder] batch failed:', errMsg);
      return null;
    } catch(e){
      console.warn('[Embedder] batch error:', e.message || e);
      return null;
    }
  }

  // Batch with splitting (BATCH_SIZE per call)
  async function embedAll(texts, onProgress){
    var all = [];
    for (var i = 0; i < texts.length; i += BATCH_SIZE) {
      var batch = texts.slice(i, i + BATCH_SIZE);
      var vectors = await embedBatch(batch);
      if (!vectors) {
        // fallback: one by one
        for (var j = 0; j < batch.length; j++) {
          var v = await embedOne(batch[j]);
          all.push(v);
        }
      } else {
        all = all.concat(vectors);
      }
      if (onProgress) onProgress(Math.min(i + BATCH_SIZE, texts.length), texts.length);
    }
    return all;
  }

  return {
    embedOne: embedOne,
    embedBatch: embedBatch,
    embedAll: embedAll
  };

})();
