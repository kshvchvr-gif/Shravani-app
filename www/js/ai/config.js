// ════════════════════════════════════════════════════════════════
// AI SERVICE — PLUGIN CONFIG (v2.0)
// ----------------------------------------------------------------
// Ye ek hi jagah hai jahan naya AI provider add hota hai.
//
// Naya provider (OpenAI, Claude, Groq, DeepSeek, Mistral...) add:
//   1. Most providers OpenAI-compatible hain → providers.js me kuch
//      nahi karna padta, bas niche AI_CONFIG.providers me entry daalo.
//   2. Provider agar Gemini jaisa custom format ho → providers.js me
//      ek chhota adapter likhna padega.
//   3. API key do tarike se: config mein (apiKey = owner key) ya user ka
//      localStorage key (keyStorage, admin panel se). Priority:
//      user localStorage key > DOM input > config apiKey.
//      Yaani user apni key daal de to wahi use hoti hai (BYOK), warna
//      owner ki embedded key (config) backup ban jaati hai.
//
// Done — Router queue/retry/failover/logging automatic handle karega.
// ════════════════════════════════════════════════════════════════

const AI_CONFIG = {
  version: '2.0.0',

  // ── PROVIDERS ──────────────────────────────────────────────────
  // Priority = array order (Gemini → OpenRouter → NVIDIA).
  // enabled:false → skip. Failover isi order mein hota hai.
  providers: [
    {
      id: 'gemini',
      name: 'Gemini',
      enabled: true,
      apiKey: '',                       // build-time key (optional)
      keyStorage: ['admin_gemini_key', 'gemini_key'],  // runtime keys (admin panel)
      keyInput: 'apiKeyInput',          // DOM input bhi check hota hai
      openaiCompat: false,              // custom Gemini format
      models: {
        text: 'gemini-3-flash-preview',
        vision: 'gemini-3-flash-preview'
      }
    },
    {
      id: 'openrouter',
      name: 'OpenRouter (Qwen2.5-VL)',
      enabled: true,
      apiKey: '',                       // admin panel se set hoti hai
      keyStorage: ['openrouter_key'],   // runtime: user apni key localStorage me dal sakta hai (priority)
      keyInput: '',
      openaiCompat: true,
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      models: {
        // 2026 me qwen :free models hata diye gaye the; gemma-4-26b multimodal
        // hai (text + vision dono), free, fast, verified 7s
        text: 'google/gemma-4-26b-a4b-it:free',
        vision: 'google/gemma-4-26b-a4b-it:free'
      }
    },
    {
      id: 'nvidia',
      name: 'NVIDIA NIM',
      enabled: true,
      apiKey: '',                       // admin panel se set hoti hai
      proxy: '/api/nvidia',             // browser CORS block karta hai → server se proxy
      keyStorage: ['nvidia_key'],       // runtime: user apni key localStorage me dal sakta hai (priority)
      keyInput: '',
      openaiCompat: true,
      endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
      models: {
        text: 'meta/llama-3.1-8b-instruct',
        vision: 'meta/llama-3.2-11b-vision-instruct'
      }
    }
  ],

  // ── QUEUE ─────────────────────────────────────────────────────
  queue: {
    maxConcurrent: 1,        // ek waqt mein sirf 1 AI request
    minGapVisionMs: 3000     // 2 vision requests ke beech minimum gap
  },

  // ── SMART RETRY (exponential backoff) ─────────────────────────
  // Chhote delays = fail hone wale provider pe jaldi failover.
  // Gemini free-tier gen request ~60-75s leta hai; timeout 120s rakha
  // taaki sahi response cut na ho.
  retry: {
    delaysMs: [3000, 6000, 12000],
    maxAttempts: 3
  },

  // ── IMAGE OPTIMIZER (class ke hisaab se adaptive) ─────────────
  // Band wahi apply hota hai jisme class level aata hai.
  image: {
    defaultMaxWidth: 1400,
    defaultQuality: 0.75,
    classLevels: [
      { minClass: 1,  maxClass: 3,  maxWidth: 1000, quality: 0.70 },  // Class 1-3: bade akshar
      { minClass: 4,  maxClass: 6,  maxWidth: 1300, quality: 0.75 },  // Class 4-6: medium pages
      { minClass: 7,  maxClass: 10, maxWidth: 1600, quality: 0.80 }   // Class 7-10: dense pages
    ]
  },

  // ── FETCH TIMEOUT (network/timeout error classify hone ke liye) ─
  // Gemini free-tier bada gen request ~60-75s me aata hai — 120s
  // rakho taaki response timeout na ho (75s par woh cut jata tha).
  timeoutMs: 120000
};
