// ══════════════════════════════════════
// LOTTIE
// ══════════════════════════════════════
const L={
  welcome:"https://assets10.lottiefiles.com/packages/lf20_qp1q7mct.json",
  trophy:"https://assets4.lottiefiles.com/packages/lf20_touohxv0.json",
  ai:"https://assets5.lottiefiles.com/packages/lf20_fcfjwiyb.json",
  ch1:"https://assets5.lottiefiles.com/packages/lf20_ysrn2iwp.json",
  ch2:"https://assets7.lottiefiles.com/packages/lf20_kkflmtur.json",
  ch3:"https://assets5.lottiefiles.com/packages/lf20_ysrn2iwp.json",
  ch4:"https://assets2.lottiefiles.com/packages/lf20_xlmz9xwm.json",
  ch5:"https://assets6.lottiefiles.com/packages/lf20_qp1q7mct.json",
};
const chAnims=[L.ch1,L.ch2,L.ch3,L.ch4,L.ch5];
function loadLottie(el,url,loop=true){
  if(!el||typeof lottie==='undefined')return null;
  el.innerHTML='';
  try{return lottie.loadAnimation({container:el,renderer:'svg',loop,autoplay:true,path:url})}catch(e){return null}
}

// ══════════════════════════════════════
// SPEECH - Web Speech API only (CORS-safe for Capacitor)
// ══════════════════════════════════════
let hindiVoice=null,englishVoice=null;
function initVoices(){
  if(!window.speechSynthesis)return;
  const v=window.speechSynthesis.getVoices();
  hindiVoice=v.find(x=>x.lang==='hi-IN')||v.find(x=>x.lang.startsWith('hi'))||null;
  englishVoice=v.find(x=>x.lang==='en-IN')||v.find(x=>x.lang.startsWith('en'))||null;
}
if(window.speechSynthesis){
  window.speechSynthesis.onvoiceschanged=initVoices;
  initVoices();
}

function isHindiText(t){
  const deva=(t.match(/[\u0900-\u097F]/g)||[]).length;
  const eng=(t.match(/[a-zA-Z]/g)||[]).length;
  if(eng===0)return true;
  return deva/(deva+eng)>=0.3;
}
function chapterIsHindi(ch){
  if(!ch)return false;
  if(ch.lang==='hi')return true;
  if(ch.lang==='en')return false;
  const t=ch.theory||ch.theory_hi;
  const head=(t&&(t.title||''))+' '+(t&&t.sections&&t.sections[0]&&(t.sections[0].heading||t.sections[0].content||'')||'');
  return head.trim()?isHindiText(head):false;
}
const SEC_LABELS_HI={Theory:'पाठ',Learn:'सीखें',Exercise:'अभ्यास',Game:'खेल'};
const SEC_ICONS={Theory:'📖',Learn:'📝',Exercise:'✏️',Game:'🎮'};
const GAME_HI_LABELS={
  match:['शब्द मिलान','प्रश्न को उत्तर से मिलाओ'],
  scramble:['शब्द-उलट','उत्तर के अक्षर सही क्रम में लगाओ'],
  speed:['स्पीड राउंड','बोनस अंकों के लिए तेज़ जवाब दो!'],
  memory:['मेमोरी मैच','मिलते हुए प्रश्न-उत्तर जोड़े ढूँढो'],
  fill:['रिक्त स्थान','छूटे हुए शब्द भरो'],
  mcq:['एमसीक्यू चैलेंज','बहुविकल्पीय प्रश्न'],
  tf:['सही या गलत','सही या गलत जवाब दो']
};
const DIFF_HI={easy:'आसान',medium:'मध्यम',hard:'कठिन'};

const EDICT={
"photosynthesis":"प्रकाश संश्लेषण","chlorophyll":"क्लोरोफिल","mitochondria":"माइटोकॉन्ड्रिया","nucleus":"केंद्रक","cytoplasm":"साइटोप्लाज़्म","atom":"परमाणु","molecule":"अणु","electron":"इलेक्ट्रॉन","proton":"प्रोटॉन","neutron":"न्यूट्रॉन","gravity":"गुरुत्व","friction":"घर्षण","energy":"ऊर्जा","force":"बल","mass":"द्रव्यमान","temperature":"तापमान","evaporation":"वाष्पीकरण","condensation":"संघनन","precipitation":"वर्षा","erosion":"अपरदन","volcanic":"ज्वालामुखी","earthquake":"भूकंप","ecosystem":"पारिस्थितिकी तंत्र","organism":"जीव","bacteria":"जीवाणु","virus":"विषाणु","protein":"प्रोटीन","carbon":"कार्बन","oxygen":"ऑक्सीजन","hydrogen":"हाइड्रोजन","nitrogen":"नाइट्रोजन","compound":"यौगिक","solution":"विलयन","acid":"अम्ल","base":"क्षार","reaction":"अभिक्रिया","history":"इतिहास","geography":"भूगोल","science":"विज्ञान","mathematics":"गणित","literature":"साहित्य","democracy":"लोकतंत्र","government":"सरकार","economy":"अर्थव्यवस्था","society":"समाज","culture":"संस्कृति","independence":"स्वतंत्रता","revolution":"क्रांति","constitution":"संविधान","republic":"गणराज्य","population":"जनसंख्या","agriculture":"कृषि","industry":"उद्योग","technology":"प्रौद्योगिकी","education":"शिक्षा","environment":"पर्यावरण","pollution":"प्रदूषण","forest":"वन","mountain":"पर्वत","river":"नदी","ocean":"महासागर","continent":"महाद्वीप","renewable":"नवीकरणीय","fossil":"जीवाश्म","combustion":"दहन","oxidation":"ऑक्सीकरण","frequency":"आवृत्ति","wavelength":"तरंगदैर्घ्य","spectrum":"वर्णक्रम","electricity":"विद्युत","circuit":"सर्किट","voltage":"वोल्टता","current":"धारा","resistance":"प्रतिरोध","algorithm":"एल्गोरिदम","equation":"समीकरण","triangle":"त्रिभुज","rectangle":"आयत","circle":"वृत्त","area":"क्षेत्रफल","perimeter":"परिमाप","volume":"आयतन","fraction":"भिन्न","decimal":"दशमलव","percent":"प्रतिशत","average":"औसत","ratio":"अनुपात","probability":"संभावना","statistics":"सांख्यिकी","tissue":"ऊतक","organ":"अंग","system":"तंत्र","digestion":"पाचन","circulation":"संचरण","cell":"कोशिका","process":"प्रक्रिया","product":"उत्पाद","property":"गुण","matter":"पदार्थ","liquid":"द्रव","solid":"ठोस","gas":"गैस",
"respiration":"श्वसन","noun":"संज्ञा","verb":"क्रिया","adjective":"विशेषण","adverb":"क्रिया विशेषण","preposition":"संबंधबोधक",
"chapter":"अध्याय","subject":"विषय","question":"प्रश्न","answer":"उत्तर","exam":"परीक्षा","mark":"अंक","grade":"श्रेणी",
"earth":"पृथ्वी","sun":"सूर्य","moon":"चंद्रमा","star":"तारा","planet":"ग्रह","satellite":"उपग्रह","orbit":"कक्षा","gravity":"गुरुत्वाकर्षण",
"number":"संख्या","addition":"जोड़","subtraction":"घटाव","multiplication":"गुणा","division":"भाग",
"noun":"संज्ञा","verb":"क्रिया","pronoun":"सर्वनाम","conjunction":"संयोजक","interjection":"विस्मयादिबोधक"
};

const BHASHINI_TTS="https://bhashini-tts-proxy.shravani-tts.workers.dev";
let _bhashiniAudio=null;
let _ttsGen=0;
function _getBhashiniAudio(){if(!_bhashiniAudio){try{_bhashiniAudio=new Audio();}catch(e){_bhashiniAudio=null;}}return _bhashiniAudio;}
function _stopBhashini(){try{if(_bhashiniAudio){_bhashiniAudio.pause();_bhashiniAudio.removeAttribute('src');}}catch(e){}}
function splitSegments(text){
  const segs=[];let cur='';let curType=null;
  for(const ch of text){
    const isD=/[\u0900-\u097F]/.test(ch);
    const isE=/[a-zA-Z]/.test(ch);
    const type=isD?'hi':isE?'en':null;
    if(type===curType||(type===null&&curType)){cur+=ch;}
    else{
      if(cur)segs.push({text:cur,lang:curType});
      cur=ch;curType=type;
    }
  }
  if(cur)segs.push({text:cur,lang:curType});
  return segs;
}
function replaceDictInHindi(segs){
  return segs.map(s=>{
    if(s.lang!=='hi')return s;
    const replaced=s.text.replace(/\b([a-zA-Z]{2,})\b/g,(m,w)=>EDICT[w.toLowerCase()]||w);
    return{text:replaced,lang:'hi'};
  });
}
function blobToDataURL(blob){
  return new Promise((res,rej)=>{
    const fr=new FileReader();
    fr.onload=()=>res(fr.result);
    fr.onerror=()=>rej(fr.error||new Error('FileReader error'));
    fr.readAsDataURL(blob);
  });
}
function _voiceSpeedFactor(){
  const s=parseFloat(localStorage.getItem('lh_pref_voiceSpeed'))||1.0;
  return Math.max(0.6,Math.min(1.3,s));
}
function _sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function splitSentences(text){
  const out=[];let cur='';
  for(const ch of text){
    cur+=ch;
    if(cur.trim()&&'।.!?'.indexOf(ch)>=0){out.push(cur.trim());cur='';}
  }
  if(cur.trim())out.push(cur.trim());
  return out;
}
function bhashiniSpeak(text,gen){
  return new Promise(res=>{
    const a=_getBhashiniAudio();
    if(!a){res(false);return;}
    a.playbackRate=_voiceSpeedFactor();
    const done=()=>{a.removeAttribute('src');if(gen===_ttsGen)hideStopBtn();res(true);};
    const fail=()=>{a.removeAttribute('src');if(gen===_ttsGen)hideStopBtn();res(false);};
    const play=src=>{
      if(gen!==_ttsGen){res(false);return;}
      a.onended=done;
      a.onerror=fail;
      a.src=src;
      const p=a.play();
      if(p&&p.catch)p.catch(fail);
    };
    const headers={'Content-Type':'application/json'};
    const payload=JSON.stringify({text:text.substring(0,5000),language:'Hindi',voiceName:'Female2'});
    let http=null;
    try{
      if(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.CapacitorHttp)http=window.Capacitor.Plugins.CapacitorHttp;
    }catch(e){}
    if(http){
      http.request({url:BHASHINI_TTS,method:'POST',data:payload,responseType:'blob',headers})
        .then(r=>{
          const ct=(r.headers&&(r.headers['Content-Type']||r.headers['content-type']))||'audio/mpeg';
          play('data:'+ct+';base64,'+r.data);
        })
        .catch(fail);
      return;
    }
    fetch(BHASHINI_TTS,{method:'POST',headers,body:payload})
      .then(r=>{if(!r.ok)throw new Error('http '+r.status);return r.blob();})
      .then(blobToDataURL)
      .then(play)
      .catch(fail);
  });
}

function cleanForTTS(t){
  if(!t)return'';
  let s=t.replace(/\n/g,' ');
  s=s.replace(/_+/g,'blank');
  s=s.replace(/- - -/g,'blank');
  s=s.replace(/\bblank\s+blank\b/g,'blank');
  s=s.replace(/\(.*?\)/g,'');
  s=s.replace(/\s+/g,' ').trim();
  s=s.replace(/[^\u0900-\u097Fa-zA-Z0-9\s.,!?।,।]/g,'');
  return s;
}

function _capacitorTTS(){
  try{
    if(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.TextToSpeech)return window.Capacitor.Plugins.TextToSpeech;
  }catch(e){}
  return null;
}
function _speakNative(text,lang,gen){
  return new Promise(res=>{
    const done=()=>{if(gen===_ttsGen)hideStopBtn();res(true);};
    const fail=()=>{if(gen===_ttsGen)hideStopBtn();res(false);};
    const tts=_capacitorTTS();
    if(tts){
      tts.speak({text:text,lang:lang==='hi'?'hi-IN':'en-IN',rate:0.85,pitch:1.0}).then(done).catch(fail);
      return;
    }
    if(window.speechSynthesis){
      try{window.speechSynthesis.cancel();}catch(e){}
      const u=new SpeechSynthesisUtterance(text);
      u.rate=0.85;
      u.pitch=1.0;
      u.lang=lang==='hi'?'hi-IN':'en-IN';
      u.onend=done;
      u.onerror=fail;
      try{window.speechSynthesis.speak(u);}catch(e){fail();}
      return;
    }
    fail();
  });
}
async function _speakHindi(text,gen){
  const sents=splitSentences(text);
  for(let si=0;si<sents.length;si++){
    if(gen!==_ttsGen)return;
    const segs=replaceDictInHindi(splitSegments(sents[si]));
    for(const seg of segs){
      if(gen!==_ttsGen)return;
      if(!seg.text.trim())continue;
      let ok;
      if(seg.lang==='en'){
        ok=await _speakNative(seg.text,'en',gen);
      }else{
        ok=await bhashiniSpeak(seg.text,gen);
        if(!ok&&gen===_ttsGen){
          await _speakNative(text,'hi',gen);
          return;
        }
      }
      if(!ok)return;
    }
    if(gen===_ttsGen&&si<sents.length-1)await _sleep(300);
  }
  if(gen===_ttsGen)hideStopBtn();
}
function speakSmart(text,lang){
  if(!text||!text.trim())return;
  const clean=cleanForTTS(text);
  if(!clean)return;
  const gen=++_ttsGen;
  _stopBhashini();
  if(window.speechSynthesis){try{window.speechSynthesis.cancel();}catch(e){}}
  showStopBtn();
  if(lang==='hi'&&isHindiText(clean)){
    _speakHindi(clean,gen);
    return;
  }
  _speakNative(clean,lang,gen);
}
function speakEN(t){if(!t)return;speakSmart(t,'en');}
function speakHI(t){if(!t)return;speakSmart(t,'hi');}
function stopSpeaking(){
  _ttsGen++;
  const tts=_capacitorTTS();
  if(tts){tts.stop().catch(()=>{});}
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  _stopBhashini();
  hideStopBtn();
}
function showStopBtn(){const b=document.getElementById('globalStopTTS');if(b)b.style.display='flex';}
function hideStopBtn(){const b=document.getElementById('globalStopTTS');if(b)b.style.display='none';}

// ══════════════════════════════════════
// AVATAR
// ══════════════════════════════════════
function loadAvatar(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=function(ev){const u=ev.target.result;localStorage.setItem('lh_avatar',u);applyAvatar(u);applyAvatarToSettings();};r.readAsDataURL(f);}
function applyAvatar(u){document.querySelectorAll('[id^="avatarImg"]').forEach(i=>{i.src=u;i.style.display='block'});document.querySelectorAll('[id^="avatarPlaceholder"]').forEach(p=>p.style.display='none');}
function loadSavedAvatar(){const s=localStorage.getItem('lh_avatar');if(s)applyAvatar(s);}

// ══════════════════════════════════════
// SUBJECTS CONFIG
// ══════════════════════════════════════
const SUBJECTS=[
  {id:'grammar',name:'English Grammar',emoji:'📝',color:'#FF6B9D',light:'#FFE4F3'},
  {id:'maths',name:'Maths',emoji:'🔢',color:'#48CAE4',light:'#E4F9FF'},
  {id:'hindi',name:'Hindi',emoji:'📚',color:'#FF9F43',light:'#FFF3E0'},
  {id:'evs',name:'EVS / Science',emoji:'🔬',color:'#10AC84',light:'#E0FFF6'},
  {id:'gk',name:'General Knowledge',emoji:'🌍',color:'#5F27CD',light:'#EDE7FF'},
  {id:'custom1',name:'My Subject 1',emoji:'✨',color:'#E84393',light:'#FFE8F5',custom:true},
  {id:'custom2',name:'My Subject 2',emoji:'🎯',color:'#6C5CE7',light:'#F0EDFF',custom:true},
];
function getSubjectName(sub){
  const saved=localStorage.getItem('lh_subname_'+sub.id);
  return saved||sub.name;
}
function renameSubject(subId){
  const sub=SUBJECTS.find(s=>s.id===subId);
  const cur=getSubjectName(sub);
  const newName=prompt('Enter new name:',cur);
  if(newName&&newName.trim()){
    localStorage.setItem('lh_subname_'+subId,newName.trim());
    buildSubjectGrid();
  }
}
function deleteSubject(subId){
  const sub=SUBJECTS.find(s=>s.id===subId);
  if(!sub)return;
  const name=getSubjectName(sub);
  const msg=sub.custom?`Delete "${name}" and all its chapters?`:`Clear all data for "${name}"?`;
  if(!confirm(msg))return;
  if(sub.custom){
    const idx=SUBJECTS.indexOf(sub);
    if(idx>-1)SUBJECTS.splice(idx,1);
    localStorage.setItem('lh_subjects_extra',JSON.stringify(SUBJECTS.filter(s=>s.id.startsWith('custom_'))));
  }
  localStorage.removeItem('lh_sub_'+subId);
  localStorage.removeItem('lh_subname_'+subId);
  buildSubjectGrid();
  updateGlobalStats();
}


// ══════════════════════════════════════
// STATE
// ══════════════════════════════════════
let curSubjectId=null,curChIdx=0,curSection='theory',shuffledQs=[],curQ=0,score=0,answered=false;
let qAnimObj=null,endAnimObj=null,currentQ=null,qboxOpen=true;
let chatHistory=[],timerInterval=null,timerSeconds=30,wrongAnswers=[];
let uploadedImages=[];
let theoryLang=localStorage.getItem('lh_theoryLang')||'en';
let hintsRemaining=0,hintLimit=3,streak=0,bestStreak=0;
let removedOptions=[];

// ══════════════════════════════════════
// PERSISTENCE
// ══════════════════════════════════════
function safeParse(str,fallback){if(str===null||str===undefined)return fallback;try{return JSON.parse(str);}catch(e){return fallback;}}
function parseJsonArray(text){
  const t=(text||'').replace(/```(?:json)?/gi,'').trim();
  const a=t.indexOf('['),b=t.lastIndexOf(']');
  return JSON.parse(a>-1&&b>a?t.slice(a,b+1):t);
}
function getSubjectData(subId){return safeParse(localStorage.getItem('lh_sub_'+subId),null);}
function saveSubjectData(subId,data){localStorage.setItem('lh_sub_'+subId,JSON.stringify(data));}
function getSubjectChapters(subId){const d=getSubjectData(subId);return d?d.chapters:[];}
function saveSubjectChapters(subId,chapters){const d=getSubjectData(subId)||{scores:{},wrong:[],totalC:0,totalA:0};d.chapters=chapters;saveSubjectData(subId,d);}
function getProgress(){return{streak:parseInt(localStorage.getItem('lh_streak')||'0'),lastPlay:localStorage.getItem('lh_lastPlay')||'',totalC:parseInt(localStorage.getItem('lh_totalC')||'0'),totalA:parseInt(localStorage.getItem('lh_totalA')||'0'),name:localStorage.getItem('lh_name')||'Student'};}
function saveProgressUpdate(){
  let p={streak:parseInt(localStorage.getItem('lh_streak')||'0'),lastPlay:localStorage.getItem('lh_lastPlay')||'',totalC:parseInt(localStorage.getItem('lh_totalC')||'0'),totalA:parseInt(localStorage.getItem('lh_totalA')||'0')};
  const today=new Date().toDateString();
  if(p.lastPlay!==today){const last=new Date(p.lastPlay);const diff=Math.floor((new Date(today)-last)/(1000*60*60*24));if(diff===1)p.streak++;else if(diff>1)p.streak=1;}
  p.lastPlay=today;
  localStorage.setItem('lh_streak',p.streak);localStorage.setItem('lh_lastPlay',p.lastPlay);
}
function recordScore(chId,score,total,wrong){
  const subId=curSubjectId;const d=getSubjectData(subId)||{chapters:[],scores:{},wrong:[],totalC:0,totalA:0};
  d.scores=d.scores||{};d.scores[chId]={score,total,date:new Date().toDateString()};
  d.totalC=(d.totalC||0)+score;d.totalA=(d.totalA||0)+total;
  d.wrong=d.wrong||[];wrong.forEach(w=>d.wrong.push({...w,chId,date:new Date().toDateString()}));
  if(d.wrong.length>100)d.wrong=d.wrong.slice(-100);
  saveSubjectData(subId,d);
  let gt=parseInt(localStorage.getItem('lh_totalC')||'0')+score;
  let ga=parseInt(localStorage.getItem('lh_totalA')||'0')+total;
  localStorage.setItem('lh_totalC',gt);localStorage.setItem('lh_totalA',ga);
  saveProgressUpdate();
}

// ══════════════════════════════════════
// SERVER TRACKING + REMOTE CONTROL
// ══════════════════════════════════════
var SL_SERVER=localStorage.getItem('sl_server_url')||'https://shravani-app.onrender.com';
var DEVICE_ID=localStorage.getItem('sl_device_id');
if(!DEVICE_ID){DEVICE_ID='dev_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);localStorage.setItem('sl_device_id',DEVICE_ID);}
var _sessionStart=Date.now();
function checkStorageQuota(){
  try{localStorage.setItem('__quota_test__','1');localStorage.removeItem('__quota_test__');return true;}catch(e){showToast({message:'Storage is full! Please free up space in Settings.',type:'error'});return false;}
}
var _offlineBanner=null;
function showOfflineBanner(){
  if(_offlineBanner)return;
  _offlineBanner=document.createElement('div');
  _offlineBanner.style.cssText='position:fixed;top:0;left:0;right:0;z-index:999;background:#E74C3C;color:white;text-align:center;padding:8px;font-family:Nunito,sans-serif;font-size:.85rem;font-weight:700';
  _offlineBanner.textContent='🌐 No internet connection — some features may not work';
  document.body.prepend(_offlineBanner);
}
function hideOfflineBanner(){
  if(_offlineBanner){_offlineBanner.remove();_offlineBanner=null;}
}
if(!navigator.onLine)showOfflineBanner();
window.addEventListener('online',hideOfflineBanner);
window.addEventListener('offline',showOfflineBanner);

function getUsers(){try{return JSON.parse(localStorage.getItem('sl_users')||'[]');}catch(e){return[];}}
function saveUsers(u){localStorage.setItem('sl_users',JSON.stringify(u));}

function reportUsage(){
  var users=getUsers();
  var report={deviceId:DEVICE_ID,device:navigator.userAgent,users:[]};
  users.forEach(function(u){
    var key='sl_usage_'+u.name;
    var usage=safeParse(localStorage.getItem(key),{});
    report.users.push({name:u.name,usage:usage});
  });
  fetch(SL_SERVER+'/api/usage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(report)}).then(function(r){}).catch(function(e){});
}

var _lastSync=localStorage.getItem('sl_last_sync')||'0';
function checkRemoteLock(){
  fetch(SL_SERVER+'/api/config?deviceId='+DEVICE_ID+'&lastSync='+_lastSync).then(function(r){return r.json();}).then(function(cfg){
    if(cfg.locked){
      document.getElementById('welcomeScreen').style.display='none';
      document.getElementById('subjectScreen').classList.add('hidden');
      document.getElementById('loginScreen').style.display='flex';
      document.getElementById('lockScreen').style.display='block';
      document.getElementById('lockMsg').textContent=cfg.lockMsg||'Admin has locked the app';
    }
    if(cfg.broadcast){
      var lastBroadcast=localStorage.getItem('sl_last_broadcast');
      if(cfg.broadcast!==lastBroadcast){
        alert('📢 '+cfg.broadcast);
        localStorage.setItem('sl_last_broadcast',cfg.broadcast);
      }
    }
    if(cfg.apiKey&&!localStorage.getItem('admin_gemini_key')){
      localStorage.setItem('admin_gemini_key',cfg.apiKey);
    }
    if(cfg.openrouterKey&&!localStorage.getItem('openrouter_key')){
      localStorage.setItem('openrouter_key',cfg.openrouterKey);
    }
    if(cfg.nvidiaKey&&!localStorage.getItem('nvidia_key')){
      localStorage.setItem('nvidia_key',cfg.nvidiaKey);
    }
    if(cfg.subjects){
      localStorage.setItem('sl_subjects',JSON.stringify(cfg.subjects));
    }
    if(cfg.contentUpdates){
      cfg.contentUpdates.forEach(function(upd){
        if(upd.type==='add_chapter'&&upd.data){
          var subId=upd.data.subjectId;
          var chapters=safeParse(localStorage.getItem('sl_chapters_'+subId),[]);
          chapters.push(upd.data.chapter);
          localStorage.setItem('sl_chapters_'+subId,JSON.stringify(chapters));
        }
        if(upd.type==='remove_chapter'&&upd.data){
          var subId2=upd.data.subjectId;
          var chId=upd.data.chapterId;
          if(subId2&&chId){
            var chapters2=safeParse(localStorage.getItem('sl_chapters_'+subId2),[]);
            chapters2=chapters2.filter(function(c){return c.id!==chId;});
            localStorage.setItem('sl_chapters_'+subId2,JSON.stringify(chapters2));
          }
        }
      });
    }
    _lastSync=Date.now().toString();
    localStorage.setItem('sl_last_sync',_lastSync);
  }).catch(function(e){});
}

function saveSession(){
  var now=Date.now();
  var mins=Math.round((now-_sessionStart)/60000);
  if(mins<1)return;
  var today=new Date().toISOString().slice(0,10);
  if(_loginUser){
    var key='sl_usage_'+_loginUser.name;
    var usage=safeParse(localStorage.getItem(key),{});
    if(!usage[today])usage[today]={minutes:0,sessions:0};
    usage[today].minutes+=mins;
    usage[today].sessions+=1;
    localStorage.setItem(key,JSON.stringify(usage));
  }else{
    var users=getUsers();
    users.forEach(function(u){
      var key='sl_usage_'+u.name;
    var usage=safeParse(localStorage.getItem(key),{});
      if(!usage[today])usage[today]={minutes:0,sessions:0};
      usage[today].minutes+=mins;
      usage[today].sessions+=1;
      localStorage.setItem(key,JSON.stringify(usage));
    });
  }
  _sessionStart=Date.now();
}

function startScreenTimer(){
  setInterval(function(){saveSession();reportUsage();},60000);
  setInterval(function(){checkRemoteLock();},300000);
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){saveSession();}
    else{_sessionStart=Date.now();reportUsage();checkRemoteLock();}
  });
  window.addEventListener('beforeunload',function(){saveSession();reportUsage();});
}
setTimeout(startScreenTimer,2000);

// ══════════════════════════════════════
// LOGIN SYSTEM (Multi-user + PIN)
// ══════════════════════════════════════
var _loginUser=null;

function renderLoginScreen(){
  // Remove test accounts
  try{var _u=JSON.parse(localStorage.getItem('sl_users')||'[]');_u=_u.filter(function(x){return x.name.toLowerCase()!=='tani';});localStorage.setItem('sl_users',JSON.stringify(_u));}catch(e){}
  var newUserForm=document.getElementById('loginNewUser');
  var isAdding=newUserForm&&newUserForm.style.display==='block';
  var users=getUsers();
  var seen={};
  users=users.filter(function(u){
    var key=u.name.toLowerCase();
    if(seen[key])return false;
    seen[key]=true;return true;
  });
  saveUsers(users);
  var list=document.getElementById('loginUserList');
  list.innerHTML='';
  if(users.length===0&&!isAdding){
    list.innerHTML='<p style="font-family:\'Nunito\',sans-serif;font-size:.85rem;color:#7B7A9A">Create your first account 👇</p>';
    return;
  }
  users.forEach(function(u){
    var initials=u.name.charAt(0).toUpperCase();
    var card=document.createElement('div');
    card.className='user-card';
    card.innerHTML='<div class="user-avatar">'+initials+'</div><div class="user-name">'+u.name+'</div><div class="user-lock">'+(u.pin?'🔒':'🔓')+'</div>';
    card.onclick=function(){
      if(u.pin){
        document.getElementById('loginPinModal').style.display='block';
        document.getElementById('loginPinName').textContent=u.name+"'s PIN:";
        document.getElementById('loginPinInput').value='';
        document.getElementById('loginPinInput').focus();
        window._loginPinUser=u;
      }else{
        doLogin(u);
      }
    };
    list.appendChild(card);
  });
}

function createUser(){
  var name=document.getElementById('loginNewName').value.trim();
  var pin=document.getElementById('loginNewPin').value.trim();
  if(!name){alert('Please enter a name!');return;}
  if(pin&&pin.length!==4){alert('PIN must be 4 digits!');return;}
  var users=getUsers();
  var exists=users.find(function(u){return u.name.toLowerCase()===name.toLowerCase();});
  if(exists){
    renderLoginScreen();
    document.getElementById('loginNewUser').style.display='none';
    document.getElementById('loginUserList').style.display='';
    document.getElementById('loginAddBtn').style.display='';
    if(exists.pin){
      document.getElementById('loginPinModal').style.display='block';
      document.getElementById('loginPinName').textContent=exists.name+"'s PIN:";
      document.getElementById('loginPinInput').value='';
      document.getElementById('loginPinInput').focus();
      window._loginPinUser=exists;
    }else{
      doLogin(exists);
    }
    return;
  }
  users.push({name:name,pin:pin||'',createdAt:Date.now()});
  saveUsers(users);
  renderLoginScreen();
  document.getElementById('loginNewUser').style.display='none';
  document.getElementById('loginUserList').style.display='';
  document.getElementById('loginAddBtn').style.display='';
}

function verifyPin(){
  var pin=document.getElementById('loginPinInput').value.trim();
  var u=window._loginPinUser;
  if(!u)return;
  if(pin===u.pin){doLogin(u);}
  else{alert('Wrong PIN!');}
}

function doLogin(u){
  _loginUser=u;
  _sessionStart=Date.now();
  localStorage.setItem('sl_current_user',u.name);
  localStorage.setItem('lh_name',u.name);
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('studentNameInput').value=u.name;
  document.getElementById('welcomeName').textContent=u.name+'!';
  loadSavedAvatar();
  buildHomeScreen();
  document.getElementById('welcomeScreen').style.display='none';
  document.getElementById('subjectScreen').classList.remove('hidden');
  document.getElementById('subGreeting').textContent=u.name+'!';
  checkRemoteLock();
  startScreenTimer();
  setTimeout(reportUsage,2000);
}

function logoutUser(){
  if(!_loginUser)return;
  saveSession();
  reportUsage();
  _loginUser=null;
  localStorage.removeItem('sl_current_user');
  document.getElementById('loginScreen').style.display='flex';
  document.getElementById('welcomeScreen').style.display='none';
  document.getElementById('subjectScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('gameScreen').classList.add('hidden');
  renderLoginScreen();
}

function showUsageStats(){
  var users=getUsers();
  var html='<div style="max-height:300px;overflow-y:auto">';
  if(users.length===0){html+='<div style="font-family:\'Nunito\',sans-serif;font-size:.82rem;color:#7B7A9A">No users yet</div>';}
  users.forEach(function(u){
    var key='sl_usage_'+u.name;
    var usage=safeParse(localStorage.getItem(key),{});
    html+='<div style="background:white;border-radius:14px;padding:12px;margin-bottom:8px;border:2px solid #E8E8F0">';
    html+='<div style="font-family:\'Baloo 2\',cursive;font-size:1rem;font-weight:700;color:#2D2A4A;margin-bottom:6px">'+u.name+'</div>';
    var days=Object.keys(usage).sort().slice(-7);
    if(days.length===0){
      html+='<div style="font-family:\'Nunito\',sans-serif;font-size:.82rem;color:#7B7A9A">No data yet</div>';
    }else{
      days.forEach(function(d){
        var ud=usage[d];
        html+='<div style="display:flex;justify-content:space-between;font-family:\'Nunito\',sans-serif;font-size:.8rem;padding:3px 0;border-bottom:1px solid #f0f0f0">';
        html+='<span style="color:#7B7A9A">'+d+'</span>';
        html+='<span style="font-weight:700;color:#2D2A4A">⏱ '+ud.minutes+'min | 📝 '+ud.sessions+' sessions</span>';
        html+='</div>';
      });
    }
    html+='</div>';
  });
  html+='</div>';
  return html;
}

// ═══ ADMIN HELPER FUNCTIONS ═══
function openGeminiKeySite(){
  window.open('https://aistudio.google.com/apikey','_blank');
}
function testAdminKey(){
  const el=document.getElementById('adminApiKey');
  const key=(el?el.value.trim():'')||localStorage.getItem('admin_gemini_key')||'';
  const st=document.getElementById('adminStatus');
  if(!key){st.textContent='❌ Pehle key paste karo';st.style.color='#E74C3C';return;}
  if(key.indexOf('AIza')!==0){st.textContent='❌ Key "AIza" se shuru nahi ho rahi — galat key hai. Google AI Studio se copy karo.';st.style.color='#E74C3C';return;}
  st.textContent='⏳ Testing key...';st.style.color='#7B7A9A';
  fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key='+encodeURIComponent(key),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{role:'user',parts:[{text:'Say OK'}]}],generationConfig:{maxOutputTokens:10}})})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d&&d.candidates&&d.candidates[0]&&d.candidates[0].content&&d.candidates[0].content.parts&&d.candidates[0].content.parts.length){
        st.textContent='✅ Key WORKING! Ab Save dabao aur app restart karo.';
        st.style.color='#27AE60';
      }else{
        var msg=(d&&d.error&&(d.error.message||d.error.status))||'invalid key';
        st.textContent='❌ Key kaam nahi kar rahi — '+msg;
        st.style.color='#E74C3C';
      }
    })
    .catch(function(){
      st.textContent='❌ Internet connection check karo, phir Test dobara dabao';
      st.style.color='#E74C3C';
    });
}
function saveAdminKey(){
  var v=document.getElementById('adminApiKey').value.trim();
  if(!v){document.getElementById('adminStatus').textContent='❌ Enter a valid key';document.getElementById('adminStatus').style.color='#E74C3C';return;}
  if(v.indexOf('AIza')!==0){document.getElementById('adminStatus').textContent='❌ Galat key — "AIza" se shuru honi chahiye. Google AI Studio se copy karo.';document.getElementById('adminStatus').style.color='#E74C3C';return;}
  localStorage.setItem('admin_gemini_key',v);
  document.getElementById('adminStatus').textContent='✅ API Key saved! Restart app to use.';
  document.getElementById('adminStatus').style.color='#27AE60';
}
function adminPasteKey(){
  if(navigator.clipboard&&navigator.clipboard.readText){
    navigator.clipboard.readText().then(function(t){
      document.getElementById('adminApiKey').value=t.trim();
      document.getElementById('adminStatus').textContent='✅ Pasted!';
      document.getElementById('adminStatus').style.color='#27AE60';
    }).catch(function(){
      document.getElementById('adminStatus').textContent='❌ Clipboard access denied — paste manually';
      document.getElementById('adminStatus').style.color='#E74C3C';
      document.getElementById('adminApiKey').focus();
    });
  }else{
    document.getElementById('adminStatus').textContent='❌ Tap textarea and paste manually';
    document.getElementById('adminStatus').style.color='#7B7A9A';
    document.getElementById('adminApiKey').focus();
  }
}
function prefillAdminKeys(){
  var i=document.getElementById('adminApiKey');if(i){var k=localStorage.getItem('admin_gemini_key');if(k)i.value=k;}
}
function adminExport(){
  var data={};
  for(var i=0;i<localStorage.length;i++){var key=localStorage.key(i);try{data[key]=JSON.parse(localStorage.getItem(key));}catch(e){data[key]=localStorage.getItem(key);}}
  var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='shravani_backup_'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href);
}
function adminImport(e){
  var file=e.target.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(ev){
    try{
      var data=JSON.parse(ev.target.result);var count=0;
      for(var key of Object.keys(data)){localStorage.setItem(key,JSON.stringify(data[key]));count++;}
      alert('✅ '+count+' items imported! Reloading...');location.reload();
    }catch(err){alert('❌ Invalid JSON!');}
  };
  reader.readAsText(file);
}
function adminSyncUp(){
  try{
    var data={};
    for(var i=0;i<localStorage.length;i++){var key=localStorage.key(i);try{data[key]=JSON.parse(localStorage.getItem(key));}catch(e){data[key]=localStorage.getItem(key);}}
    fetch(SL_SERVER+'/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).then(function(r){return r.json();}).then(function(o){alert('✅ Synced! '+Object.keys(o).length+' items saved');}).catch(function(e){alert('❌ Sync failed: '+e.message);});
  }catch(e){alert('❌ '+e.message);}
}
function adminSyncDown(){
  try{
    fetch(SL_SERVER+'/api/data').then(function(r){return r.json();}).then(function(data){
      var count=0;
      for(var key of Object.keys(data)){
        var existing=localStorage.getItem(key);
        var incoming=JSON.stringify(data[key]);
        if(!existing||incoming.length>existing.length){localStorage.setItem(key,incoming);count++;}
      }
      alert('✅ Loaded! '+count+' items restored');
      if(count>0)setTimeout(function(){location.reload();},500);
    }).catch(function(e){alert('❌ Load failed: '+e.message);});
  }catch(e){alert('❌ '+e.message);}
}

// ══════════════════════════════════════
// AI SERVICE — Central Router (www/js/ai/*)
// Plugin-based: naya provider = bas www/js/ai/config.js me entry.
// Neeche ke functions purane names hain — existing call sites bilkul
// waise chalte hain, bas andar ab AIProvider router hai
// (queue + retry + failover + rate limit + logging).
// ══════════════════════════════════════

var lastGeminiStatus=0;
function getGeminiKey(){
  var k=localStorage.getItem('admin_gemini_key');if(k)return k;
  const i=document.getElementById('apiKeyInput');if(i&&i.value.trim())return i.value.trim().replace(/^["']+|["']+$/g,'');
  const s=localStorage.getItem('gemini_key');if(s){const clean=s.replace(/^["']+|["']+$/g,'');if(i)i.value=clean;return clean;}
  return '';
}
async function callGemini(prompt,systemPrompt='',maxTokens=250,jsonMode=false){
  return AIProvider.askText(prompt,systemPrompt,maxTokens,jsonMode);
}
async function callGeminiVision(base64Image,mimeType,prompt,systemPrompt='',maxTokens=4000){
  return AIProvider.askVision([base64Image],prompt,systemPrompt,maxTokens);
}
async function callGeminiVisionMulti(images,prompt,systemPrompt='',maxTokens=4000){
  return AIProvider.askVision(images,prompt,systemPrompt,maxTokens);
}

// ══════════════════════════════════════
// AUTO UPDATE CHECKER
// ══════════════════════════════════════
const APP_VERSION='1.0.22';
const GITHUB_REPO='kshvchvr-gif/Shravani-app';
function isVersionNewer(v,cur){
  const a=v.split('.').map(Number),b=cur.split('.').map(Number);
  for(let i=0;i<Math.max(a.length,b.length);i++){
    const x=a[i]||0,y=b[i]||0;
    if(x!==y)return x>y;
  }
  return false;
}
async function checkForUpdate(){
  try{
    if(!window.navigator.onLine)return;
    const res=await fetch('https://api.github.com/repos/'+GITHUB_REPO+'/releases/latest');
    if(!res.ok)return;
    const release=await res.json();
    const latestVersion=release.tag_name.replace('v','');
    if(!isVersionNewer(latestVersion,APP_VERSION))return;
    const apkAsset=release.assets.find(a=>a.name.endsWith('.apk'));
    if(!apkAsset)return;
    showUpdatePopup(latestVersion,apkAsset.browser_download_url);
  }catch(e){console.log('Update check failed:',e);}
}
function showUpdatePopup(version,url){
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:999999;display:flex;align-items:center;justify-content:center';
  overlay.innerHTML=`<div style="background:white;border-radius:20px;padding:28px 24px;max-width:320px;width:90%;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.3)">
    <div style="font-size:2.5rem;margin-bottom:8px">🔄</div>
    <div style="font-family:'Baloo 2',cursive;font-size:1.3rem;font-weight:800;color:#2D2A4A;margin-bottom:6px">Update Available!</div>
    <div style="font-family:'Nunito',sans-serif;font-size:.9rem;color:#7B7A9A;margin-bottom:16px">Version ${version} is now available.</div>
    <div id="updateProgress" style="display:none;margin-bottom:12px">
      <div style="background:#E8E8F0;border-radius:10px;height:8px;overflow:hidden">
        <div id="updateProgressBar" style="background:linear-gradient(135deg,#FF6B9D,#C77DFF);height:100%;width:0%;transition:width .3s;border-radius:10px"></div>
      </div>
      <div id="updateStatus" style="font-family:'Nunito',sans-serif;font-size:.8rem;color:#7B7A9A;margin-top:6px">Downloading...</div>
    </div>
    <div style="display:flex;gap:10px;justify-content:center">
      <button onclick="this.closest('div[style*=fixed]').remove()" style="font-family:'Nunito',sans-serif;font-size:.9rem;font-weight:700;padding:10px 20px;background:#E8E8F0;color:#7B7A9A;border:none;border-radius:12px;cursor:pointer">Later</button>
      <button id="updateBtn" onclick="downloadUpdate('${url}',this)" style="font-family:'Nunito',sans-serif;font-size:.9rem;font-weight:700;padding:10px 24px;background:linear-gradient(135deg,#FF6B9D,#C77DFF);color:white;border:none;border-radius:12px;cursor:pointer">Update</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
}
async function downloadUpdate(url){
  const progress=document.getElementById('updateProgress');
  const bar=document.getElementById('updateProgressBar');
  const status=document.getElementById('updateStatus');
  const btn=document.getElementById('updateBtn');
  progress.style.display='block';btn.style.display='none';
  if(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.Plugins&&window.Capacitor.Plugins.UpdatePlugin){
    status.textContent='⬇️ Downloading new version...';
    bar.style.width='0%';
    try{
      const plugin=window.Capacitor.Plugins.UpdatePlugin;
      if(plugin.addListener){
        plugin.addListener('progress',function(info){
          const p=info&&info.progress?info.progress:0;
          bar.style.width=(p>=0?p:50)+'%';
          if(info&&info.status==='downloaded'){
            status.textContent='📦 Downloaded! Install ho raha hai...';
          }else{
            status.textContent='⬇️ Downloading... '+(p>=0?p+'%':'');
          }
        });
      }
      plugin.downloadAndInstall({url:url}).then(function(r){
        bar.style.width='100%';
        status.textContent='📦 Download complete! Install popup check karein...';
      }).catch(function(e){
        status.textContent='Download failed: '+(e&&e.message?e.message:'try again');
        fallbackDownloadLink(url,status,bar,btn);
      });
      return;
    }catch(e){}
  }
  fallbackDownloadLink(url,status,bar,btn);
}
function fallbackDownloadLink(url,status,bar,btn){
  try{
    bar.style.width='50%';
    status.textContent='Copy link and paste in browser to download';
    bar.style.width='100%';
    var copyDiv=document.createElement('div');copyDiv.style.cssText='margin-top:10px;padding:10px;background:#f0f0f5;border-radius:8px;word-break:break-all;font-size:.75rem;color:#555;cursor:pointer;border:1px dashed #C77DFF';
    copyDiv.textContent=url;
    copyDiv.onclick=function(){navigator.clipboard.writeText(url).then(function(){copyDiv.textContent='✅ Copied! Open Chrome & paste';copyDiv.style.background='#e8ffe8';setTimeout(function(){copyDiv.textContent=url;copyDiv.style.background='#f0f0f5';},3000);}).catch(function(){var ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);copyDiv.textContent='✅ Copied! Open Chrome & paste';});};
    status.parentElement.appendChild(copyDiv);
    if(window.Capacitor&&window.Capacitor.isNativePlatform){
      window.open(url,'_system');
    }
  }catch(e){
    status.textContent='Copy this link and open in browser:';
    var link=document.createElement('a');link.href=url;link.textContent='Download APK';link.style.cssText='display:block;margin-top:8px;color:#C77DFF;font-weight:700;word-break:break-all';
    status.parentElement.appendChild(link);
  }
}
setTimeout(checkForUpdate,5000);

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════

window.addEventListener('DOMContentLoaded',()=>{
  loadLottie(document.getElementById('welcomeAnim'),L.welcome);
  if(window.speechSynthesis)window.speechSynthesis.getVoices();

  const verEl=document.getElementById('settShareVersion');
  if(verEl)verEl.textContent='v'+APP_VERSION;

  loadExtraSubjects();
  const savedKey=localStorage.getItem('gemini_key');if(savedKey){const i=document.getElementById('apiKeyInput');if(i)i.value=savedKey;}

  // Always show login screen — user picks account
  localStorage.removeItem('sl_current_user');
  document.getElementById('loginScreen').style.display='flex';
  document.getElementById('welcomeScreen').style.display='none';
  renderLoginScreen();
  checkRemoteLock();
});

function startApp(){
  var name=document.getElementById('studentNameInput').value.trim();
  if(!name){
    document.getElementById('studentNameInput').style.borderColor='#E74C3C';
    document.getElementById('studentNameInput').placeholder='Please enter your name!';
    document.getElementById('studentNameInput').focus();
    return;
  }
  localStorage.setItem('lh_name',name);
  if(!_loginUser){
    _loginUser={name:name};
    localStorage.setItem('sl_current_user',name);
  }
  var users=getUsers();
  if(!users.find(function(u){return u.name===name;})){
    users.push({name:name});
    saveUsers(users);
  }
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('subjectScreen').classList.remove('hidden');
  document.getElementById('subGreeting').textContent=name+'!';
  loadSavedAvatar();
  buildHomeScreen();
  setTimeout(function(){setQBoxLang(theoryLang);},100);
}
function addNewBook(){
  const name=prompt('Enter Book/Subject name:');
  if(!name||!name.trim())return;
  const id='custom_'+Date.now();
  const colors=['#E84393','#6C5CE7','#00B894','#FDCB6E','#E17055','#0984E3','#D63031','#A29BFE'];
  const emojis=['📖','📕','📗','📘','📙','📓','📔','📒'];
  const color=colors[Math.floor(Math.random()*colors.length)];
  const emoji=emojis[Math.floor(Math.random()*emojis.length)];
  const light=color+'20';
  SUBJECTS.push({id:id,name:name.trim(),emoji:emoji,color:color,light:light,custom:true});
  localStorage.setItem('lh_subjects_extra',JSON.stringify(SUBJECTS.filter(s=>s.id.startsWith('custom_'))));
  buildSubjectGrid();
}
function loadExtraSubjects(){
  const extra=safeParse(localStorage.getItem('lh_subjects_extra'),[]);
  extra.forEach(s=>{
    if(!SUBJECTS.find(x=>x.id===s.id)){
      SUBJECTS.push(s);
    }
  });
}

// ══════════════════════════════════════
// SUBJECT GRID
// ══════════════════════════════════════
function buildSubjectGrid(maxItems){
  const grid=document.getElementById('subGrid');grid.innerHTML='';
  const list=maxItems===undefined?SUBJECTS:SUBJECTS.slice(0,maxItems);
  const seeBtn=document.querySelector('.see-all-btn');
  if(seeBtn)seeBtn.style.display=maxItems===undefined?'none':'';
  list.forEach(sub=>{
    const chapters=getSubjectChapters(sub.id);
    const hasData=chapters&&chapters.length>0;
    const displayName=getSubjectName(sub);
    const subData=getSubjectData(sub.id);
    const totalC=subData?(subData.totalC||0):0;
    const totalA=subData?(subData.totalA||0):0;
    const pct=totalA>0?Math.round(totalC/totalA*100):0;
    const div=document.createElement('div');
    div.className='sub-card'+(hasData?'':' add-subject-card');
    div.style.background=hasData?sub.color:sub.light;
    div.style.color=hasData?'white':sub.color;
    const editBtn=sub.custom?`<span onclick="event.stopPropagation();renameSubject('${sub.id}')" style="position:absolute;top:6px;right:26px;font-size:.75rem;cursor:pointer;opacity:.7" title="Rename">✏️</span>`:'';
    const delBtn=`<span onclick="event.stopPropagation();deleteSubject('${sub.id}')" style="position:absolute;top:6px;right:8px;font-size:.75rem;cursor:pointer;opacity:.6" title="${sub.custom?'Delete subject':'Clear chapters'}">🗑️</span>`;
    div.style.position='relative';
    const progBar=hasData?`<div class="sub-card-progress"><div class="sub-card-progress-fill" style="width:${pct}%"></div></div>`:'';
    div.innerHTML=`${editBtn}${delBtn}<div class="sub-emoji">${sub.emoji}</div><div class="sub-name">${displayName}</div><div class="sub-chapters">${hasData?chapters.length+' chapters':'Tap to create content'}</div>${progBar}`;
    div.onclick=()=>openSubject(sub.id);
    grid.appendChild(div);
  });
}
function updateGlobalStats(){
  const p=getProgress();
  document.getElementById('globalStreak').textContent=p.streak;
  document.getElementById('globalScore').textContent=p.totalC+'/'+p.totalA;
  const lv=document.getElementById('homeLevel');
  if(lv)lv.textContent=Math.max(1,Math.floor((p.totalC||0)/50)+1);
  const todayEl=document.getElementById('todayProgressCount');
  if(todayEl){
    const goal=getDailyGoalProgress();
    todayEl.textContent=goal.completed+' ch';
  }
  const xpEl=document.getElementById('achTotalXP');
  if(xpEl)xpEl.textContent='⭐ '+p.totalC+' XP';
}

// ══════════════════════════════════════
// OPEN SUBJECT
// ══════════════════════════════════════
function openSubject(subId){
  curSubjectId=subId;
  const sub=SUBJECTS.find(s=>s.id===subId);
  document.getElementById('subjectScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('dashSubjIcon').textContent=sub.emoji;
  document.getElementById('dashSubjectTitle').textContent=getSubjectName(sub);
  currentDashFilter='all';dashSearchQuery='';
  document.getElementById('dashSearchInput').value='';
  buildSubjectDash();
}
function goToSubjects(){
  stopTimer();
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('subjectScreen').classList.remove('hidden');
  buildHomeScreen();
}
function goToSubjectDash(){
  stopTimer();
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  buildSubjectDash();
}

// ══════════════════════════════════════
// SUBJECT DASHBOARD — REDESIGNED
// ══════════════════════════════════════

const CH_EMOJIS=['📖','📕','📗','📘','📙','📓','📔','📒','📃','📑'];
const DIFFICULTIES=['easy','medium','hard'];

let currentDashFilter='all';
let dashSearchQuery='';

function buildSubjectDash(){
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  const chapters=getSubjectChapters(curSubjectId)||[];
  const d=getSubjectData(curSubjectId)||{scores:{},wrong:[],totalC:0,totalA:0};
  const totalCh=chapters.length;
  const completedCh=chapters.filter(ch=>d.scores&&d.scores[ch.id]).length;
  const pct=totalCh?Math.round(completedCh/totalCh*100):0;
  const totalC=d.totalC||0;
  const totalA=d.totalA||0;
  const remainCh=totalCh-completedCh;
  const estMin=remainCh*5;

  const msgs=[
    "Let's start learning! 🚀",
    "Great job! Keep learning! 🌟",
    "You're doing amazing! 💪",
    "Stay focused! You got this! ⭐",
    "Keep going, superstar! 🎉"
  ];
  document.getElementById('dashMotivation').textContent=msgs[Math.min(completedCh,msgs.length-1)];

  const topCirc=100.53;
  document.getElementById('dashTopRing').style.strokeDashoffset=topCirc-(topCirc*pct/100);
  document.getElementById('dashTopPct').textContent=pct+'%';

  renderDashProgressCard(pct,totalC,totalA,completedCh,remainCh,estMin);
  renderDashContinueCard(chapters,d,sub);
  renderDashChapterCards(chapters,d,sub);

  document.getElementById('dashStatsGrid').innerHTML=`
    <div class="summary-stat" style="background:${sub.light}"><div class="num">${totalC}</div><div class="lbl">Correct</div></div>
    <div class="summary-stat" style="background:${sub.light}"><div class="num">${totalA}</div><div class="lbl">Attempts</div></div>
    <div class="summary-stat" style="background:${sub.light}"><div class="num">${totalCh}</div><div class="lbl">Chapters</div></div>
    <div class="summary-stat" style="background:${sub.light}"><div class="num">${totalA?Math.round(totalC/totalA*100):0}%</div><div class="lbl">Accuracy</div></div>`;

  const rl=document.getElementById('revisionList');
  const wrong=(d.wrong||[]).slice(-20).reverse();
  if(wrong.length===0)rl.innerHTML='<p style="font-family:\'Nunito\',sans-serif;color:#7B7A9A;text-align:center;padding:14px">No wrong answers! Great job! 🎉</p>';
  else rl.innerHTML=wrong.map(w=>`<div class="wrong-item"><strong>${(w.chId||'').toUpperCase()}</strong> ${(w.q||'').split('\n')[0]} → <strong>${w.correct||'?'}</strong></div>`).join('');

  // Reset view to chapters
  showDashView('chapters',document.querySelector('.dash-view-tab.active')||document.querySelector('.dash-view-tab'));
}

function renderDashProgressCard(pct,totalC,totalA,completedCh,remainCh,estMin){
  const el=document.getElementById('dashProgressCard');
  el.innerHTML=`
    <div class="dash-progress-card-header"><span>📊 Your Progress</span></div>
    <div class="dash-progress-grid">
      <div class="dash-progress-item"><div class="dash-progress-value">${pct}%</div><div class="dash-progress-label">Complete</div></div>
      <div class="dash-progress-item"><div class="dash-progress-value">${totalC}</div><div class="dash-progress-label">XP Earned</div></div>
      <div class="dash-progress-item"><div class="dash-progress-value">${completedCh}</div><div class="dash-progress-label">Lessons Done</div></div>
      <div class="dash-progress-item"><div class="dash-progress-value">${remainCh}</div><div class="dash-progress-label">Remaining</div></div>
    </div>
    <div class="dash-progress-bar-wrap">
      <div class="dash-progress-bar-track"><div class="dash-progress-bar-fill" style="width:${pct}%"></div></div>
      <span class="dash-progress-bar-time">~${estMin} min left</span>
    </div>`;
}

function renderDashContinueCard(chapters,d,sub){
  const el=document.getElementById('dashContinueCard');
  const nextIdx=chapters.findIndex((ch,i)=>!d.scores||!d.scores[ch.id]);
  if(nextIdx>=0){
    const ch=chapters[nextIdx];
    const isLocked=nextIdx>0&&(!d.scores||!d.scores[chapters[nextIdx-1].id]);
    if(isLocked){
      el.className='dash-continue-card dash-continue-empty';
      el.innerHTML=`<div class="dash-continue-left"><span class="dash-continue-badge">🔒 Locked</span><div class="dash-continue-title">Complete previous chapter first</div><div class="dash-continue-sub">Keep going to unlock this chapter!</div></div>`;
      el.onclick=null;
    }else{
      const pct=d.scores&&d.scores[ch.id]?Math.round(d.scores[ch.id].score/d.scores[ch.id].total*100):0;
      const chCirc=213.6;
      el.className='dash-continue-card';
      el.innerHTML=`<div class="dash-continue-left"><span class="dash-continue-badge">📖 Continue Learning</span><div class="dash-continue-title">${ch.label}</div><div class="dash-continue-sub">~5 min • ${getDifficultyLabel(nextIdx)}</div><button class="dash-continue-btn">Continue →</button></div><div class="dash-continue-right"><svg viewBox="0 0 80 80" class="dash-continue-ring-svg"><circle cx="40" cy="40" r="34" fill="none" stroke="#E8E0F0" stroke-width="6"/><circle class="dash-continue-ring-fill" id="dashContinueRingFill" cx="40" cy="40" r="34" fill="none" stroke="#FF4FA3" stroke-width="6" stroke-linecap="round" stroke-dasharray="213.6" stroke-dashoffset="${chCirc-(chCirc*pct/100)}" transform="rotate(-90 40 40)"/></svg><span class="dash-continue-pct">${pct}%</span></div>`;
      el.onclick=()=>startChapter(nextIdx);
    }
  }else{
    el.className='dash-continue-card dash-continue-empty';
    el.innerHTML=`<div class="dash-continue-left"><span class="dash-continue-badge">🎉 All Done!</span><div class="dash-continue-title">You completed all chapters!</div><div class="dash-continue-sub">Amazing work! 🌟</div></div>`;
    el.onclick=null;
  }
}

function getDifficultyLabel(idx){
  return DIFFICULTIES[idx%3].charAt(0).toUpperCase()+DIFFICULTIES[idx%3].slice(1);
}

function renderDashChapterCards(chapters,d,sub){
  const container=document.getElementById('dashChapterList');
  container.innerHTML='';

  if(chapters.length===0){
    container.innerHTML=`<div class="dash-ch-empty"><div class="dash-ch-empty-icon">📷</div><div class="dash-ch-empty-text">No chapters yet!</div><div class="dash-ch-empty-sub">Upload a photo of your textbook page to get started</div><button onclick="showUploadModal()" style="font-family:'Poppins',sans-serif;font-size:.85rem;font-weight:600;padding:10px 24px;background:${sub.color};color:white;border:none;border-radius:50px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.1)">📷 Upload First Page</button></div>`;
    return;
  }

  const filtered=getFilteredChapters(chapters,d);
  if(filtered.length===0){
    container.innerHTML=`<div class="dash-ch-empty"><div class="dash-ch-empty-icon">🔍</div><div class="dash-ch-empty-text">No matching chapters</div><div class="dash-ch-empty-sub">Try a different filter or search term</div></div>`;
    return;
  }

  filtered.forEach((ch,i)=>{
    const origIdx=chapters.indexOf(ch);
    const sc=d.scores?d.scores[ch.id]:null;
    const pct=sc?Math.round(sc.score/sc.total*100):0;
    const done=sc!==undefined;
    const prevDone=origIdx===0||(d.scores&&d.scores[chapters[origIdx-1]?.id]);
    const locked=!prevDone;
    const current=d.scores&&d.scores[ch.id]&&pct<100;
    const diff=DIFFICULTIES[origIdx%3];
    const emoji=CH_EMOJIS[origIdx%CH_EMOJIS.length];

    let cardClass='dash-ch-card';
    if(done)cardClass+=' completed';
    if(locked)cardClass+=' locked';
    if(current)cardClass+=' current';

    const deleteBtn=`<button onclick="event.stopPropagation();deleteChapter(${origIdx})" style="position:absolute;top:8px;right:8px;font-size:.65rem;cursor:pointer;opacity:.4;background:none;border:none;padding:4px" title="Delete chapter">🗑️</button>`;

    const diffColors={easy:'#22C55E',medium:'#FF9F43',hard:'#E74C3C'};

    let rightContent;
    if(done){
      rightContent=`<div class="dash-ch-completed-badge">✅ Done</div><div class="dash-ch-xp">⭐ ${sc.score} XP</div>`;
    }else if(locked){
      rightContent=`<div style="font-size:1rem;opacity:.5">🔒</div>`;
    }else{
      const circ=125.66;
      rightContent=`
        <div class="dash-ch-progress-ring">
          <svg viewBox="0 0 44 44" class="dash-ch-ring-svg">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#F0EEF5" stroke-width="3"/>
            <circle class="dash-ch-ring-fill" cx="22" cy="22" r="18" fill="none" stroke="${sub.color}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ-(circ*pct/100)}" transform="rotate(-90 22 22)"/>
          </svg>
          <span class="dash-ch-ring-text">${pct}%</span>
        </div>
        <button class="dash-ch-action-btn" style="background:${sub.color}" onclick="event.stopPropagation();startChapter(${origIdx})">Start →</button>`;
    }

    const card=document.createElement('div');
    card.className=cardClass;
    if(!locked)card.onclick=()=>startChapter(origIdx);
    card.style.animationDelay=(origIdx*0.06)+'s';
    card.innerHTML=`
      ${deleteBtn}
      <div class="dash-ch-left" style="background:${done?sub.color:sub.light}20;color:${done?'white':sub.color}">
        ${emoji}
        ${locked?'<span class="ch-lock">🔒</span>':''}
      </div>
      <div class="dash-ch-body">
        <div class="dash-ch-number">Chapter ${origIdx+1}</div>
        <div class="dash-ch-name">${ch.label}</div>
        <div class="dash-ch-meta">
          <span class="dash-ch-time">⏱️ ~5 min</span>
          <span class="dash-ch-diff ${diff}" style="background:${diffColors[diff]}">${getDifficultyLabel(origIdx)}</span>
        </div>
        ${done&&pct<100?`<div class="dash-ch-bar"><div class="dash-ch-bar-fill" style="width:${pct}%;background:${sub.color}"></div></div>`:''}
      </div>
      <div class="dash-ch-right">
        ${rightContent}
      </div>`;
    container.appendChild(card);
  });
}

function getFilteredChapters(chapters,d){
  return chapters.filter((ch,i)=>{
    const sc=d.scores?d.scores[ch.id]:null;
    const done=sc!==undefined;
    const prevDone=i===0||(d.scores&&d.scores[chapters[i-1]?.id]);
    const locked=!prevDone;

    if(currentDashFilter==='completed'&&!done)return false;
    if(currentDashFilter==='pending'&&(done||locked))return false;
    if(currentDashFilter==='locked'&&!locked)return false;

    if(dashSearchQuery){
      const q=dashSearchQuery.toLowerCase();
      const name=(ch.label||'').toLowerCase();
      const chNum='chapter '+(i+1);
      if(!name.includes(q)&&!chNum.includes(q))return false;
    }
    return true;
  });
}

function onDashSearch(){
  dashSearchQuery=document.getElementById('dashSearchInput').value;
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  const chapters=getSubjectChapters(curSubjectId)||[];
  const d=getSubjectData(curSubjectId)||{scores:{},wrong:[],totalC:0,totalA:0};
  renderDashChapterCards(chapters,d,sub);
}
var dashSearchDebounced=debounce(onDashSearch,300);

function showDashView(view,btn){
  const isChapters=view==='chapters';
  document.getElementById('dashProgressCard').style.display=isChapters?'':'none';
  document.getElementById('dashContinueCard').style.display=isChapters?'':'none';
  document.getElementById('dashFilterBar').style.display=isChapters?'':'none';
  document.getElementById('dashSearchInput').style.display=isChapters?'':'none';
  document.querySelector('.dash-search-bar').style.display=isChapters?'':'none';
  document.getElementById('dashChapterList').style.display=isChapters?'':'none';
  document.querySelector('.dash-upload-area').style.display=isChapters?'':'none';

  document.getElementById('dashStatsPanel').style.display=view==='stats'?'':'none';
  document.getElementById('dashRevisionPanel').style.display=view==='revision'?'':'none';

  if(btn){
    document.querySelectorAll('.dash-view-tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  }
}

// ══════════════════════════════════════
// FILTER CHIPS
// ══════════════════════════════════════
document.addEventListener('click',function(e){
  const chip=e.target.closest('.dash-chip');
  if(!chip)return;
  if(!chip.closest('#dashFilterBar'))return;
  document.querySelectorAll('#dashFilterBar .dash-chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  currentDashFilter=chip.dataset.filter;
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  const chapters=getSubjectChapters(curSubjectId)||[];
  const d=getSubjectData(curSubjectId)||{scores:{},wrong:[],totalC:0,totalA:0};
  renderDashChapterCards(chapters,d,sub);
});

// ══════════════════════════════════════
// IMAGE UPLOAD & AI GENERATION
// ══════════════════════════════════════
function showUploadModal(){
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  document.getElementById('modalSubjectName').textContent=getSubjectName(sub);
  document.getElementById('uploadModal').classList.remove('hidden');
  uploadedImages=[];
  document.getElementById('previewImg').removeAttribute('src');
  document.getElementById('previewImg').classList.add('hidden');
  document.getElementById('genBtn').disabled=true;
  document.getElementById('genProgress').classList.add('hidden');
  document.getElementById('chapterNameInput').value='';
  document.getElementById('pageCameraInput').value='';
  document.getElementById('pageGalleryInput').value='';
  document.getElementById('uploadPageCount').textContent='';
  resetGenSteps();
}
function closeUploadModal(){document.getElementById('uploadModal').classList.add('hidden');uploadedImages=[];const p=document.getElementById('previewImg');if(p){p.removeAttribute('src');p.classList.add('hidden');}}
function compressImage(dataUrl,maxDim,quality){
  // Backward-compatible wrapper → ImageOptimizer (www/js/ai/optimizer.js).
  // Adaptive class-based settings default hain; explicit maxDim/quality
  // diye gaye to wahi use hote hain.
  return ImageOptimizer.compress(dataUrl,{maxWidth:maxDim,quality:quality});
}
function previewImages(e){
  const files=Array.from(e.target.files);
  if(!files.length)return;
  files.forEach(f=>{
    const reader=new FileReader();
    reader.onload=function(ev){
      ImageOptimizer.compress(ev.target.result).then(function(compressed){
        uploadedImages.push(compressed);
        const cnt=uploadedImages.length;
        document.getElementById('uploadPageCount').textContent='📷 '+cnt+' pages selected';
        document.getElementById('previewImg').src=uploadedImages[cnt-1];
        document.getElementById('previewImg').classList.remove('hidden');
        document.getElementById('genBtn').disabled=false;
      });
    };reader.readAsDataURL(f);
  });
}
function resetGenSteps(){
  ['step1','step2','step3','step4'].forEach((id,i)=>{
    const el=document.getElementById(id);el.className='gen-step';
    el.querySelector('.step-icon').textContent=i+1;
  });
}
function setGenStep(stepIdx,status){
  for(let i=0;i<4;i++){
    const el=document.getElementById('step'+(i+1));
    if(i<stepIdx)el.className='gen-step done';
    else if(i===stepIdx)el.className='gen-step active';
    else el.className='gen-step';
    if(i<stepIdx)el.querySelector('.step-icon').textContent='✓';
  }
}
let _genSeq=0;
async function generateFromImage(){
  if(!uploadedImages.length)return;
  const myGen=++_genSeq;
  AIProvider.cancelPending();
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  const customName=document.getElementById('chapterNameInput').value.trim();
  const classLevel=document.getElementById('classLevelSelect').value;

  document.getElementById('genBtn').disabled=true;
  document.getElementById('genProgress').classList.remove('hidden');
  const pgText=uploadedImages.length>1?uploadedImages.length+' pages':'1 page';
  document.getElementById('genStatus').textContent=pgText+' pages reading...';
  setGenStep(0);document.getElementById('genProgressFill').style.width='15%';

  // STEP 1: Vision - extract text from all pages (har page ka ALAG
  // chhota request. Ek hi request mein 4 pages bhejne par payload bada
  // ho jaata tha → phone ke internet par ERR_CONNECTION_ABORTED, aur
  // output-token budget bhi khatam hota tha → "All AI unavailable".
  // Har page alag se → chhota upload, chhota timeout, ek page fail ho
  // to baaki pages phir bhi padhe jaate hain.)
  const subjectLabel=getSubjectName(sub);
  const pageTexts=[];
  let visionFatal=false;
  const statusOff=AIProvider.onStatus(function(evt){
    if(myGen!==_genSeq)return;
    if(evt.type==='fatal'){visionFatal=true;return;}
    if(evt.type==='retry'||evt.type==='switch'){
      const el=document.getElementById('genStatus');
      if(el)el.textContent='AI is busy. Trying another AI...';
    }
  });
  try{
    for(let pi=0;pi<uploadedImages.length;pi++){
      if(myGen!==_genSeq)return;
      const pagePrompt=`This is page ${pi+1} of ${uploadedImages.length} from a Class ${classLevel} ${subjectLabel} textbook. Extract ALL the text content from THIS page. Include:
1. Chapter title/name
2. All headings and subheadings
3. All content/text/rules/formulas/examples
4. All questions and exercises
5. Any important points or notes

Format the extracted text clearly with sections. Preserve the structure.`;
      const statusEl=document.getElementById('genStatus');
      if(statusEl)statusEl.textContent='Reading page '+(pi+1)+'/'+uploadedImages.length+'...';
      const pageText=await callGeminiVisionMulti([uploadedImages[pi]],pagePrompt,'',4000);
      if(myGen!==_genSeq)return;
      if(pageText){pageTexts.push('— PAGE '+(pi+1)+' —\n'+pageText);}
      if(uploadedImages.length>1){
        const fill=document.getElementById('genProgressFill');
        if(fill)fill.style.width=Math.min(35,15+((pi+1)/uploadedImages.length)*20)+'%';
      }
    }
  }finally{statusOff();}
  if(myGen!==_genSeq)return;
  const extractedText=pageTexts.length?pageTexts.join('\n\n'):null;
  if(!extractedText){
    document.getElementById('genStatus').textContent=visionFatal
      ?'❌ Could not read photo. Please upload a clear photo.'
      :'All AI services are temporarily unavailable. Please try again.';
    document.getElementById('genBtn').disabled=false;return;
  }
  setGenStep(1);document.getElementById('genProgressFill').style.width='40%';
  const devaCount=(extractedText.match(/[\u0900-\u097F]/g)||[]).length;
  const bookHindi=(sub&&sub.id==='hindi')||devaCount>=15||isHindiText(extractedText);
  document.getElementById('genStatus').textContent=bookHindi?'सामग्री पढ़ी गई! हिंदी में प्रश्न बना रहे हैं...':'Content read! Creating questions...';

  // STEP 2 & 3: Generate chapter data (language auto-detect from textbook)
  const schemaDemo=bookHindi?`{
  "id": "auto_${Date.now()}",
  "label": "${customName||(bookHindi?'अध्याय':'Chapter')}",
  "name": "${customName||extractedText.split('\\n')[0]||'Chapter'}",
  "color": "${sub.color}",
  "anim": "ch1",
  "theory": {
    "title": "अध्याय का शीर्षक हिंदी में",
    "sections": [
      {"heading": "धारा शीर्षक हिंदी में", "content": "सरल हिंदी में व्याख्या", "examples": ["उदाहरण 1", "उदाहरण 2"]},
      {"heading": "अन्य धारा हिंदी में", "content": "अधिक सामग्री हिंदी में", "list": ["बिंदु 1", "बिंदु 2"]}
    ]
  },
  "theory_hi": {
    "title": "अध्याय का शीर्षक हिंदी में",
    "sections": [
      {"heading": "धारा शीर्षक हिंदी में", "content": "सरल हिंदी में व्याख्या", "examples": ["उदाहरण 1", "उदाहरण 2"]},
      {"heading": "अन्य धारा हिंदी में", "content": "अधिक सामग्री हिंदी में", "list": ["बिंदु 1", "बिंदु 2"]}
    ]
  },
  "learn": [
    {"type": "mcq", "q": "प्रश्न हिंदी में?", "o": ["विकल्प 1","विकल्प 2","विकल्प 3","विकल्प 4"], "a": "सही विकल्प"},
    {"type": "fill", "q": "रिक्त स्थान भरें: ___ उत्तर है", "display": "___ उत्तर है", "answer": "शब्द"}
  ],
  "exercise": [
    {"type": "mcq", "q": "अभ्यास प्रश्न हिंदी में?", "o": ["विकल्प 1","विकल्प 2","विकल्प 3","विकल्प 4"], "a": "सही विकल्प"},
    {"type": "fill", "q": "अभ्यास: उत्तर ___ है", "display": "उत्तर ___ है", "answer": "उत्तर"}
  ]
}`:`{
  "id": "auto_${Date.now()}",
  "label": "${customName||(bookHindi?'अध्याय':'Chapter')}",
  "name": "${customName||extractedText.split('\\n')[0]||'Chapter'}",
  "color": "${sub.color}",
  "anim": "ch1",
  "theory": {
    "title": "Chapter Title in English",
    "sections": [
      {"heading": "Section heading in English", "content": "Explanation in simple English words", "examples": ["example 1", "example 2"]},
      {"heading": "Another section in English", "content": "More content in English", "list": ["point 1", "point 2"]}
    ]
  },
  "theory_hi": {
    "title": "अध्याय शीर्षक हिंदी में",
    "sections": [
      {"heading": "धारा शीर्षक हिंदी में", "content": "सरल हिंदी में व्याख्या", "examples": ["उदाहरण 1", "उदाहरण 2"]},
      {"heading": "अन्य धारा हिंदी में", "content": "अधिक सामग्री हिंदी में", "list": ["बिंदु 1", "बिंदु 2"]}
    ]
  },
  "learn": [
    {"type": "mcq", "q": "Question text in English?", "o": ["Option1","Option2","Option3","Option4"], "a": "Correct option"},
    {"type": "fill", "q": "Fill in: ___ is the answer", "display": "___ is the answer", "answer": "word"}
  ],
  "exercise": [
    {"type": "mcq", "q": "Exercise question in English?", "o": ["A","B","C","D"], "a": "A"},
    {"type": "fill", "q": "Exercise fill: The answer is ___", "display": "The answer is ___", "answer": "answer"}
  ]
}`;

  const rulesText=bookHindi?`RULES:
- IMPORTANT: The textbook is in HINDI. ALL text in this JSON MUST be in pure Hindi (Devanagari script). Do NOT write English anywhere.
- theory: Generate 5-8 theory sections in pure Hindi (Devanagari) explaining key concepts simply. Use proper Hindi terms.
- theory_hi: Same Hindi content (Devanagari) as theory.
- Generate 10-15 learn questions (mix of MCQ and fill-in-blank) in pure Hindi (Devanagari)
- Generate 10-15 exercise questions (mix of MCQ and fill-in-blank) in pure Hindi (Devanagari)
- Questions should be age-appropriate for Class ${classLevel}
- Make theory sections educational with examples
- ALL text must be based on the extracted textbook content`:`RULES:
- theory: Generate 5-8 theory sections in ENGLISH explaining key concepts simply.
- theory_hi: Generate the SAME theory sections in pure Hindi (Devanagari script only). Use proper Hindi terms.
- Generate 10-15 learn questions (mix of MCQ and fill-in-blank) in English
- Generate 10-15 exercise questions (mix of MCQ and fill-in-blank) in English
- Questions should be age-appropriate for Class ${classLevel}
- Make theory sections educational with examples
- ALL text must be based on the extracted textbook content`;

  const genPrompt=`You are generating a study chapter for Class ${classLevel} ${getSubjectName(sub)}.

Here is the extracted textbook content:
---
${extractedText}
---

Generate a JSON chapter object. Return ONLY valid JSON (no markdown, no backticks), exactly like this structure:

${schemaDemo}

${rulesText}`;

  const systemPrompt=bookHindi
    ? 'You are an expert Class '+classLevel+' '+getSubjectName(sub)+' teacher. The textbook is in HINDI. Create ALL study material (theory, theory_hi, learn questions, exercise questions) in pure Hindi (Devanagari). Always respond with valid JSON only.'
    : 'You are an expert Class '+classLevel+' '+getSubjectName(sub)+' teacher. You create study materials from textbook content. theory in English, theory_hi in pure Hindi (Devanagari). Questions in English. Always respond with valid JSON only.';

  const genResult=await callGemini(genPrompt,systemPrompt,8000,true);
  if(myGen!==_genSeq)return;
  if(!genResult){
    document.getElementById('genStatus').textContent='All AI services are temporarily unavailable. Please try again.';
    document.getElementById('genBtn').disabled=false;return;
  }

  setGenStep(2);document.getElementById('genProgressFill').style.width='75%';
  document.getElementById('genStatus').textContent='Processing chapter data...';

  try{
    let jsonStr=genResult.trim();
    if(jsonStr.startsWith('```'))jsonStr=jsonStr.replace(/^```json?\n?/,'').replace(/\n?```$/,'');
    const a=jsonStr.indexOf('{'),b=jsonStr.lastIndexOf('}');
    if(a>-1&&b>a)jsonStr=jsonStr.slice(a,b+1);
    const chapterData=JSON.parse(jsonStr);

    // Ensure required fields
    if(!chapterData.id)chapterData.id='auto_'+Date.now();
    if(!chapterData.learn)chapterData.learn=[];
    if(!chapterData.exercise)chapterData.exercise=[];
    if(!chapterData.theory)chapterData.theory={title:chapterData.name,sections:[]};
    if(!chapterData.theory_hi)chapterData.theory_hi={title:chapterData.theory.title,sections:chapterData.theory.sections.map(s=>({...s}))};
    chapterData.lang=bookHindi?'hi':'en';

    // Save
    const chapters=getSubjectChapters(curSubjectId)||[];
    chapters.push(chapterData);
    saveSubjectChapters(curSubjectId,chapters);

    setGenStep(3);document.getElementById('genProgressFill').style.width='100%';
    document.getElementById('genStatus').textContent='✅ Chapter ready!';

    setTimeout(()=>{
      closeUploadModal();
      buildSubjectDash();
      // Auto open the new chapter
      startChapter(chapters.length-1);
    },1000);

  }catch(err){
    console.error('JSON parse error:',err,'Raw:',genResult);
    document.getElementById('genStatus').textContent='❌ Error processing. AI response was invalid. Try again.';
    document.getElementById('genBtn').disabled=false;
  }
}

// ══════════════════════════════════════
// TABS
// ══════════════════════════════════════
function buildTabs(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  const wrap=document.getElementById('chTabs');wrap.innerHTML='';
  const d=getSubjectData(curSubjectId)||{scores:{}};
  chapters.forEach((ch,i)=>{
    const btn=document.createElement('button');
    btn.className='ch-tab'+(i===curChIdx?' active':'');
    btn.textContent=ch.label;btn.style.borderColor=ch.color;
    btn.style.color=i===curChIdx?'white':ch.color;btn.style.background=i===curChIdx?ch.color:'white';
    btn.onclick=()=>selectChapter(i);btn.id='tab_'+i;
    if(d.scores&&d.scores[ch.id]){const dot=document.createElement('span');dot.className='ch-done';dot.textContent='✓';btn.appendChild(dot);}
    wrap.appendChild(btn);
  });
}

// ══════════════════════════════════════
// CHAPTER / SECTION NAVIGATION
// ══════════════════════════════════════
function syncChapterLang(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];
  if(chapterIsHindi(ch)){
    const pref=localStorage.getItem('lh_theoryLang')||'en';
    setQBoxLang('hi');
    localStorage.setItem('lh_theoryLang',pref);
  }else{
    setQBoxLang(localStorage.getItem('lh_theoryLang')||'en');
  }
}
function setTheoryLang(l){
  setQBoxLang(l);
  showTheory();
}
function startChapter(idx){
  curChIdx=idx;
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
  buildTabs();
  loadLottie(document.getElementById('aiAnim'),L.ai);
  syncChapterLang();
  curSection='theory';updateSectionBtns();showTheory();
  const chapters=getSubjectChapters(curSubjectId)||[];
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  document.getElementById('gameSubjectName').textContent=sub.emoji+' '+getSubjectName(sub);
  speakEN(chapters[idx].name);
}
function selectChapter(idx){
  curChIdx=idx;
  const chapters=getSubjectChapters(curSubjectId)||[];
  chapters.forEach((_,i)=>{const t=document.getElementById('tab_'+i);if(!t)return;const c=chapters[i].color;if(i===idx){t.classList.add('active');t.style.background=c;t.style.color='white';}else{t.classList.remove('active');t.style.background='white';t.style.color=c;}});
  syncChapterLang();
  curSection='theory';updateSectionBtns();showTheory();
  speakEN(chapters[idx].name);
}
function deleteChapter(idx){
  if(!confirm('Delete this chapter?'))return;
  const chapters=getSubjectChapters(curSubjectId)||[];
  if(idx<0||idx>=chapters.length)return;
  const ch=chapters[idx];
  chapters.splice(idx,1);
  saveSubjectChapters(curSubjectId,chapters);
  const d=getSubjectData(curSubjectId)||{scores:{},wrong:[],totalC:0,totalA:0};
  if(ch&&d.scores)delete d.scores[ch.id];
  saveSubjectData(curSubjectId,d);
  buildSubjectDash();
}
function switchSection(sec){
  curSection=sec;updateSectionBtns();
  if(sec==='theory')showTheory();
  else if(sec==='game'){showGameModes();}
  else{showQuestions();restartGame();}
}
function updateSectionBtns(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];
  const isHi=chapterIsHindi(ch);
  ['Theory','Learn','Exercise','Game'].forEach(s=>{
    const btn=document.getElementById('btn'+s);if(!btn)return;
    btn.innerHTML=(SEC_ICONS[s]||'')+' '+(isHi?(SEC_LABELS_HI[s]||s):s);
    const active=curSection===s.toLowerCase();
    btn.classList.toggle('active',active);
    if(ch){btn.style.background=active?ch.color:'transparent';btn.style.color=active?'white':'#7B7A9A';}
  });
}
function showTheory(){
  document.getElementById('theoryView').style.display='block';
  document.getElementById('gameCard').classList.add('hidden');
  document.getElementById('gameHome').classList.add('hidden');
  document.getElementById('gamePlay').classList.add('hidden');
  document.getElementById('gameResult').classList.add('hidden');
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return;
  const isHi=chapterIsHindi(ch);

  if(theoryLang==='en'&&!isHi&&(!ch.theory_en||ch.theory_en._failed||(ch.theory_en&&ch.theory_en.title==='English Translation Failed'))){
    const src=ch.theory||{title:ch.name,sections:[]};
    const srcJson=JSON.stringify(src);
    if(!/[\u0900-\u097F]/.test(srcJson)){
      ch.theory_en={title:src.title,sections:(src.sections||[]).map(s=>({...s}))};
      saveSubjectChapters(curSubjectId,chapters);
      showTheory();
      return;
    }
    document.getElementById('theoryContent').innerHTML=`<div class="lang-toggle"><button class="lang-btn active" onclick="theoryLang='en';showTheory()">English</button><button class="lang-btn" onclick="theoryLang='hi';showTheory()">हिंदी</button></div><div style="text-align:center;padding:30px"><div class="loading-dots"><span></span><span></span><span></span></div><div style="font-family:'Nunito',sans-serif;color:#7B7A9A;margin-top:8px">📖 Translating to complete English...</div></div>`;
    const prompt='Translate this Hinglish theory to complete proper English. Keep the same JSON structure with title and sections. Return ONLY JSON:\n\n'+srcJson;
    callGemini(prompt,'Return ONLY valid JSON. Translate title and all section headings/content to complete proper English.',8000,true).then(r=>{
      if(r){
        try{
          let j=r.trim();if(j.startsWith('```'))j=j.replace(/^```json?\n?/,'').replace(/\n?```$/,'');
          const a=j.indexOf('{'),b=j.lastIndexOf('}');
          if(a>-1&&b>a)j=j.slice(a,b+1);
          ch.theory_en=JSON.parse(j);
          saveSubjectChapters(curSubjectId,chapters);
          showTheory();
          return;
        }catch(e){
          console.error('Theory EN parse error:',e);
        }
      }
      ch.theory_en={title:'English Translation Failed',sections:[],_failed:true};
      saveSubjectChapters(curSubjectId,chapters);
      showTheory();
    });
    return;
  }

  const t=theoryLang==='en'?((ch.theory_en&&!ch.theory_en._failed&&ch.theory_en.title!=='English Translation Failed')?ch.theory_en:(ch.theory||{title:ch.name,sections:[]})):((ch.theory_hi&&(ch.theory_hi.sections||[]).length)?ch.theory_hi:(ch.theory||{title:ch.name,sections:[]}));
  const badge=document.getElementById('theoryBadge');badge.textContent=ch.name;badge.style.background=ch.color;
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  const emoji=sub?sub.emoji:'📖';
  const sections=t.sections||[];
  let fullText='';

  const xpEarned=Math.max(5,Math.floor(sections.length*5));
  const totalMins=Math.max(1,Math.ceil(sections.length*2));
  const bmKey='lh_bm_'+curSubjectId+'_'+curChIdx;
  const isBookmarked=localStorage.getItem(bmKey)==='1';

  let secHtml='';
  sections.forEach((sec,si)=>{
    let secText=(sec.heading+' '+(sec.content||'')+' '+(sec.examples||[]).join(' ')+' '+(sec.list||[]).join(' ')).trim();
    fullText+=secText+' ';
    secHtml+=`<div class="theory-page">
      <div class="theory-page-header">
        <span class="theory-page-num">${si+1}</span>
        <h3 class="theory-heading">${sec.heading}</h3>
        <button class="theory-pp-speak" onclick="${isHi?'speakHI':'speakEN'}(this.dataset.t)" data-t="${secText.replace(/"/g,'&quot;')}" title="${isHi?'सुनें':'Listen'}">🔊</button>
        ${isHi?'':`<button class="theory-pp-speak" onclick="speakHI(this.dataset.t)" data-t="${secText.replace(/"/g,'&quot;')}" title="Listen Hindi" style="border-color:var(--color-secondary);color:var(--color-secondary)">🔊</button>`}
      </div>
      <div class="theory-body">
        ${sec.content?`<p>${sec.content}</p>`:''}
        ${sec.examples?sec.examples.map(ex=>`<div class="theory-example">${ex}</div>`).join(''):''}
        ${sec.list?`<ul>${sec.list.map(l=>`<li>${l}</li>`).join('')}</ul>`:''}
      </div>
    </div>`;

    const idx=si+1;
    if(idx%2===0&&si<sections.length-1){
      const nextSec=sections[si+1];
      secHtml+=`<div class="theory-tip-card">
        <div class="tip-label"><span class="tip-icon">⭐</span> ${isHi?'मुख्य बिंदु':'Key Point'}</div>
        <div class="tip-text">${isHi?'अच्छी तरह समझ लो <strong>':`Focus on understanding <strong>`}${nextSec?nextSec.heading:sec.heading}</strong>. ${isHi?'यह अवधारणा आगे के लिए जरूरी है।':'This concept builds on what you just learned.'}</div>
      </div>`;
    }
    if(idx%3===0){
      const fact=sec.content||sec.heading;
      secHtml+=`<div class="theory-fact-card">
        <div class="fact-label"><span class="fact-icon">💡</span> ${isHi?'क्या आप जानते हैं?':'Did You Know?'}</div>
        <div class="fact-text">${fact.length>120?fact.substring(0,120)+'...':fact}</div>
      </div>`;
    }
    if(idx===Math.max(3,Math.floor(sections.length/2))&&sections.length>2){
      const kcBody=sec.content||(sec.list?sec.list.join(' '):'')||sec.heading||'';
      const kcSum=kcBody.length>180?kcBody.substring(0,180)+'…':kcBody;
      const kcA=(theoryLang==='en')
        ?`💡 ${kcSum}`
        :`💡 ${kcSum}`;
      secHtml+=`<div class="theory-know-check">
        <div class="theory-know-check-header" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.kch-toggle').classList.toggle('open')">
          <span class="kch-icon">✏️</span>
          <span class="kch-title">${theoryLang==='en'?'Check Your Understanding':'समझ जाँचें'}</span>
          <span class="kch-toggle">▼</span>
        </div>
        <div class="theory-know-check-body">
          <div class="theory-kc-question">${theoryLang==='en'?`Can you explain "${sec.heading}" in your own words?`:`क्या आप "${sec.heading}" अपने शब्दों में समझा सकते हैं?`}</div>
          <div class="theory-kc-answer" id="kcAnswer${si}">${kcA}</div>
          <button class="theory-kc-reveal" onclick="var a=document.getElementById('kcAnswer${si}');a.classList.toggle('show');this.textContent=this.textContent==='${theoryLang==='en'?'Show Answer':'जवाब देखें'}'?'${theoryLang==='en'?'Hide Answer':'जवाब छिपाएँ'}':'${theoryLang==='en'?'Show Answer':'जवाब देखें'}'">${theoryLang==='en'?'Show Answer':'जवाब देखें'}</button>
        </div>
      </div>`;
    }
  });

  secHtml+=`<div class="theory-end-card">
    <div class="theory-end-icon">🎉</div>
    <h3 class="theory-end-title">${theoryLang==='en'?'Great Reading!':'बहुत अच्छे!'}</h3>
    <p class="theory-end-sub">${theoryLang==='en'?'You completed the theory for '+ch.name:'तुमने '+ch.name+' का सिद्धांत पूरा कर लिया'}</p>
    <div class="theory-end-stats">
      <div class="theory-end-stat">
        <span class="theory-end-stat-icon">📖</span>
        <span class="theory-end-stat-val">${sections.length}</span>
        <span class="theory-end-stat-label">${theoryLang==='en'?'SECTIONS':'भाग'}</span>
      </div>
      <div class="theory-end-stat">
        <span class="theory-end-stat-icon">⭐</span>
        <span class="theory-end-stat-val">+${xpEarned}</span>
        <span class="theory-end-stat-label">XP</span>
      </div>
    </div>
    <button class="theory-start-btn" style="background:linear-gradient(135deg,${ch.color},${ch.color}dd)" onclick="switchSection('learn')">📝 ${theoryLang==='en'?'Start Quiz':'क्विज़ शुरू करें'} ➜</button>
  </div>`;

  const html=`${isHi?`<div class="lang-toggle" style="justify-content:center;pointer-events:none"><span class="lang-btn active" style="cursor:default">🌐 हिंदी</span></div>`:`<div class="lang-toggle">
    <button class="lang-btn ${theoryLang==='en'?'active':''}" onclick="setTheoryLang('en')">English</button>
    <button class="lang-btn ${theoryLang==='hi'?'active':''}" onclick="setTheoryLang('hi')">हिंदी</button>
  </div>`}
  <div class="theory-lesson-header">
    <span class="theory-lesson-emoji">${emoji}</span>
    <h2 class="theory-lesson-title">${t.title}</h2>
    <div class="theory-lesson-meta">
      <span class="theory-meta-item"><span class="meta-icon">📖</span> <span class="meta-label">${sections.length}</span> ${theoryLang==='en'?'sections':'भाग'}</span>
      <span class="theory-meta-item"><span class="meta-icon">⏱️</span> <span class="meta-label">${totalMins}</span> ${theoryLang==='en'?'min':'मिनट'}</span>
      <span class="theory-meta-item"><span class="meta-icon">⭐</span> <span class="meta-label">+${xpEarned}</span> XP</span>
    </div>
    ${sections[0]?`<div class="theory-lesson-objective">${theoryLang==='en'?'📌 In this lesson, you will learn about':'📌 इस पाठ में आप सीखेंगे'} <strong>${sections[0].heading}</strong>${sections.length>1?' '+((theoryLang==='en')?'and more':'और भी बहुत कुछ'):''}.</div>`:''}
  </div>
  <div class="theory-controls">
    <div class="theory-controls-group">
      <button class="theory-ctrl-btn" onclick="decTheoryFont()" title="${theoryLang==='en'?'Smaller text':'छोटा टेक्स्ट'}">A−</button>
      <span class="theory-ctrl-label" id="theoryFontLabel">16</span>
      <button class="theory-ctrl-btn" onclick="incTheoryFont()" title="${theoryLang==='en'?'Larger text':'बड़ा टेक्स्ट'}">A+</button>
    </div>
    <div class="theory-controls-group">
      <button class="theory-ctrl-btn ${isBookmarked?'active':''}" id="theoryBookmarkBtn" onclick="toggleTheoryBookmark()" title="${theoryLang==='en'?'Bookmark':'बुकमार्क'}">${isBookmarked?'★':'☆'}</button>
    </div>
    <div class="theory-controls-group">
      <button class="theory-listen-btn" onclick="${isHi?'speakTheoryAllHindi()':'speakTheoryAll()'}">🔊 ${theoryLang==='en'?'Listen':'सुनें'}</button>
    </div>
  </div>
  <div class="theory-progress-text">
    <span id="theoryProgressLabel">${theoryLang==='en'?'Reading...':'पढ़ रहे हैं...'}</span>
    <span id="theoryProgressPct">0%</span>
  </div>
  <div class="theory-progress-wrap">
    <div class="theory-progress-fill" id="theoryProgressFill"></div>
  </div>
  ${secHtml}`;

  document.getElementById('theoryContent').innerHTML=html;
  window._theoryFullText=fullText.trim();
  window._theoryHindiText='';
  window.removeEventListener('scroll',theoryScrollHandler);
  window.addEventListener('scroll',theoryScrollHandler,{passive:true});
  theoryScrollHandler();
  applyTheoryFont();
}
function theoryScrollHandler(){
  const view=document.getElementById('theoryView');
  if(!view||view.style.display==='none')return;
  const scrollTop=window.scrollY;
  const scrollHeight=document.documentElement.scrollHeight-window.innerHeight;
  if(scrollHeight<=0)return;
  const pct=Math.min(100,Math.round((scrollTop/scrollHeight)*100));
  const fill=document.getElementById('theoryProgressFill');
  const label=document.getElementById('theoryProgressPct');
  const textLabel=document.getElementById('theoryProgressLabel');
  if(fill)fill.style.width=pct+'%';
  if(label)label.textContent=pct+'%';
  if(textLabel)textLabel.textContent=pct<20?((theoryLang==='en')?'Just started':'शुरू किया'):pct<50?((theoryLang==='en')?'Reading...':'पढ़ रहे हैं...'):pct<80?((theoryLang==='en')?'Almost there!':'लगभग हो गया!'):((theoryLang==='en')?'Finishing up!':'खत्म होने वाला है!');
}
function incTheoryFont(){
  let fs=parseInt(localStorage.getItem('lh_theoryFontSize'))||16;
  if(fs>=24)return;
  fs+=2;
  localStorage.setItem('lh_theoryFontSize',fs);
  applyTheoryFont();
  const sv=document.getElementById('settFontVal');
  if(sv)sv.textContent=fs;
}
function decTheoryFont(){
  let fs=parseInt(localStorage.getItem('lh_theoryFontSize'))||16;
  if(fs<=12)return;
  fs-=2;
  localStorage.setItem('lh_theoryFontSize',fs);
  applyTheoryFont();
  const sv=document.getElementById('settFontVal');
  if(sv)sv.textContent=fs;
}
function applyTheoryFont(){
  const fs=parseInt(localStorage.getItem('lh_theoryFontSize'))||16;
  document.querySelectorAll('.theory-body p,.theory-body li').forEach(el=>el.style.fontSize=fs+'px');
  document.querySelectorAll('.theory-heading').forEach(el=>el.style.fontSize=(fs+4)+'px');
  const label=document.getElementById('theoryFontLabel');
  if(label)label.textContent=fs;
}
function toggleTheoryBookmark(){
  const key='lh_bm_'+curSubjectId+'_'+curChIdx;
  const current=localStorage.getItem(key)==='1';
  if(current){localStorage.removeItem(key);
  }else{localStorage.setItem(key,'1');}
  const btn=document.getElementById('theoryBookmarkBtn');
  if(btn){btn.classList.toggle('active');btn.textContent=current?'☆':'★';}
}
function speakTheoryAll(){
  const t=window._theoryFullText;if(!t)return;
  speakSmart(t,'en');
}
function speakTheoryAllHindi(){
  let t=window._theoryHindiText;
  if(t){speakSmart(t,'hi');return;}
  const full=window._theoryFullText;if(!full)return;
  callGemini('Translate to simple Hindi for a young student. Keep it natural and short. Only give the Hindi text: '+full,'',1000).then(r=>{
    if(r){window._theoryHindiText=r;speakSmart(r,'hi');}
  });
}
function showQuestions(){
  document.getElementById('theoryView').style.display='none';
  document.getElementById('gameCard').classList.remove('hidden');
  document.getElementById('gameHome').classList.add('hidden');
  document.getElementById('gamePlay').classList.add('hidden');
  document.getElementById('gameResult').classList.add('hidden');
}

// ══════════════════════════════════════
// INTERACTIVE GAME
// ══════════════════════════════════════
let gameScore=0,gameLevel=1,gameStreak=0,gameTimer=null,gameMode='';
let gameCorrect=0,gameWrong=0,gameStartTime=0,gameMistakes=[],gamePaused=false,gameTotalQs=0;
let gameMistakeQs=[],gameRetryPool=null;
function recordMistake(qObj){
  if(!qObj)return;
  gameMistakeQs.push(qObj);
  gameMistakes.push(qObj.q||qObj.text||qObj.question||'');
}

const GAME_REGISTRY={
  'match':{id:'match',icon:'🔗',title:'Word Match',desc:'Match questions to their answers',difficulty:'easy',xp:50,minQuestions:2,check:function(pool){return pool.length>=2},init:function(){startMatchGame()},render:function(){startMatchGame()},cleanup:function(){matchSelected=null;matchPairs=[];matchDone=0}},
  'scramble':{id:'scramble',icon:'🔤',title:'Word Scramble',desc:'Unscramble the answer letters',difficulty:'easy',xp:40,minQuestions:1,check:function(pool){return pool.length>=1},init:function(){startScrambleGame()},render:function(){startScrambleGame()},cleanup:function(){scrambleAnswer='';scrambleSlots=[];scrambleCount=0}},
  'speed':{id:'speed',icon:'⚡',title:'Speed Round',desc:'Answer fast for bonus points!',difficulty:'medium',xp:70,minQuestions:3,check:function(pool){return pool.length>=3},init:function(){startSpeedGame()},render:function(){loadSpeedQ()},cleanup:function(){speedIdx=0;speedPool=[];if(speedInterval)clearInterval(speedInterval);speedInterval=null}},
  'memory':{id:'memory',icon:'🧠',title:'Memory Match',desc:'Find matching question-answer pairs',difficulty:'hard',xp:90,minQuestions:2,check:function(pool){return pool.length>=2},init:function(){startMemoryGame()},render:function(){startMemoryGame()},cleanup:function(){memoryCards=[];memoryFlipped=[];memoryMatched=0}},
  'fill':{id:'fill',icon:'📝',title:'Fill Blanks',desc:'Fill in the missing words',difficulty:'easy',xp:40,minQuestions:2,check:function(pool){return pool.some(q=>q.type==='fill')},init:function(){startFillGame()},render:function(){startFillGame()},cleanup:function(){}},
  'mcq':{id:'mcq',icon:'🎯',title:'MCQ Challenge',desc:'Multiple choice questions',difficulty:'medium',xp:60,minQuestions:3,check:function(pool){return pool.some(q=>q.o&&q.o.length>0)},init:function(){startMCQGame()},render:function(){loadMCQQ()},cleanup:function(){mcqIdx=0;mcqPool=[]}},
  'tf':{id:'tf',icon:'✅',title:'True or False',desc:'Answer True or False',difficulty:'easy',xp:35,minQuestions:2,check:function(pool){return pool.length>=2},init:function(){startTFGame()},render:function(){startTFGame()},cleanup:function(){}}
};

function getAvailableGames(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return[];
  const pool=[...(ch.learn||[]),...(ch.exercise||[])];
  return Object.values(GAME_REGISTRY).filter(g=>g.check(pool));
}

function showGameModes(){
  document.getElementById('theoryView').style.display='none';
  document.getElementById('gameCard').classList.add('hidden');
  document.getElementById('gameHome').classList.remove('hidden');
  document.getElementById('gamePlay').classList.add('hidden');
  document.getElementById('gameResult').classList.add('hidden');
  gameScore=0;gameLevel=1;gameStreak=0;gameMode='';
  gameCorrect=0;gameWrong=0;gameMistakes=[];gameMistakeQs=[];gameRetryPool=null;gamePaused=false;
  const hiBtn=document.getElementById('ghHindiBtn');
  if(hiBtn)hiBtn.style.display=(curSubjectId==='hindi')?'':'none';
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return;
  const isHi=chapterIsHindi(ch);
  const pool=[...(ch.learn||[]),...(ch.exercise||[])];
  const avail=getAvailableGames();
  document.getElementById('ghHeroTitle').textContent=ch.name||'Games';
  document.getElementById('ghHeroImg').textContent=ch.emoji||'🎮';
  document.getElementById('ghGamesCount').textContent=avail.length+(isHi?' गेम':' games');
  const totalXp=avail.reduce((s,g)=>s+g.xp,0);
  document.getElementById('ghXpTotal').textContent=totalXp+' XP';
  const grid=document.getElementById('ghGrid');
  grid.innerHTML='';
  const progress=getGameProgress();
  if(avail.length===0){
    document.getElementById('ghEmpty').classList.remove('hidden');
    grid.innerHTML='';
    return;
  }
  document.getElementById('ghEmpty').classList.add('hidden');
  avail.forEach(g=>{
    const card=document.createElement('div');
    card.className='gh-card';
    const done=progress.completed&&progress.completed.includes(g.id);
    const hiLab=GAME_HI_LABELS[g.id]||[g.title,g.desc];
    const title=isHi?hiLab[0]:g.title;
    const desc=isHi?hiLab[1]:g.desc;
    const diff=isHi?(DIFF_HI[g.difficulty]||g.difficulty):g.difficulty;
    card.innerHTML='<div class="gh-card-icon">'+g.icon+'</div><div class="gh-card-title">'+title+'</div><div class="gh-card-desc">'+desc+'</div><div class="gh-card-footer"><span class="gh-card-xp">⭐ '+g.xp+' XP</span><span class="gh-card-diff '+g.difficulty+'">'+diff+'</span></div>'+(done?'<div class="gh-card-badge done">✅ Done</div>':'');
    card.onclick=function(){startGame(g.id)};
    grid.appendChild(card);
  });
}
function getGamePool(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return[];
  const base=gameRetryPool||[...(ch.learn||[]),...(ch.exercise||[])];
  return shuffle(base);
}
function startGame(mode){
  const g=GAME_REGISTRY[mode];if(!g)return;
  gameMode=mode;gameScore=0;gameLevel=1;gameStreak=0;
  gameCorrect=0;gameWrong=0;gameMistakes=[];gamePaused=false;gameStartTime=Date.now();
  const pool=getGamePool();
  gameTotalQs=pool.length;
  document.getElementById('gameHome').classList.add('hidden');
  document.getElementById('gameResult').classList.add('hidden');
  document.getElementById('gamePlay').classList.remove('hidden');
  const ch0=getSubjectChapters(curSubjectId)||[];
  const hi0=chapterIsHindi(ch0[curChIdx]);
  const hiLab0=GAME_HI_LABELS[mode]||[g.title,g.desc];
  document.getElementById('gpTitle').textContent=g.icon+' '+(hi0?hiLab0[0]:g.title);
  document.getElementById('gpFeedback').classList.add('hidden');
  document.getElementById('gpPauseOverlay').classList.add('hidden');
  updateGamePlayHud();
  g.init();
}
function updateGamePlayHud(){
  document.getElementById('gpScore').textContent=gameScore;
  document.getElementById('gpTimer').textContent=gameTimer!==null?gameTimer+'s':'--';
  const total=gameTotalQs||1;
  const done=gameCorrect+gameWrong;
  document.getElementById('gpQCounter').textContent=done+'/'+total;
  const pct=Math.min(100,Math.round((done/total)*100));
  document.getElementById('gpProgressFill').style.width=pct+'%';
}
function gameFeedback(ok,text){
  const fb=document.getElementById('gpFeedback');
  fb.classList.remove('hidden','correct','wrong');
  fb.classList.add(ok?'correct':'wrong');
  fb.innerHTML=text+(ok?' <span style="font-size:.8em">+'+Math.floor(10+gameLevel*5)+'</span>':'');
  if(ok){gameScore+=10+gameLevel*5;gameStreak++;gameCorrect++;if(gameStreak%5===0)gameLevel++;launchConfetti();}
  else{gameStreak=0;gameWrong++;}
  updateGamePlayHud();
}
function gameNext(){
  document.getElementById('gpFeedback').classList.remove('correct','wrong');
  setTimeout(()=>{
    document.getElementById('gpFeedback').classList.add('hidden');
    const g=GAME_REGISTRY[gameMode];
    if(g)g.render();
    updateGamePlayHud();
  },600);
}
function endGame(){
  if(gamePaused)return;
  const g=GAME_REGISTRY[gameMode];
  if(g)g.cleanup();
  gameRetryPool=null;
  document.getElementById('gamePlay').classList.add('hidden');
  document.getElementById('gameResult').classList.remove('hidden');
  if(gameCorrect>0)launchConfetti();
  showGameResult();
  saveGameProgress();
}
function showGameResult(){
  const total=gameCorrect+gameWrong||1;
  const pct=Math.round((gameCorrect/total)*100);
  const pctTxt=pct>=80?'Great Job!':pct>=50?'Nice Try!':'Keep Practicing!';
  const rankTxt=pct>=90?'🏆 Genius':pct>=80?'🥇 Excellent':pct>=60?'🥈 Good':pct>=40?'🥉 Fair':'📚 Keep Learning';
  document.getElementById('grAnim').textContent=pct>=80?'🎉':'📖';
  document.getElementById('grTitle').textContent=pctTxt;
  document.getElementById('grXp').textContent=gameScore;
  document.getElementById('grCorrect').textContent=gameCorrect;
  document.getElementById('grWrong').textContent=gameWrong;
  document.getElementById('grAccuracy').textContent=pct+'%';
  document.getElementById('grStars').textContent=pct>=80?'⭐⭐⭐':pct>=50?'⭐⭐':'⭐';
  document.getElementById('grStreak').textContent=gameStreak;
  document.getElementById('grTime').textContent=Math.round((Date.now()-gameStartTime)/1000)+'s';
  const coinEl=document.getElementById('grCoinCount');
  if(coinEl)coinEl.textContent='🪙 +'+gameScore;
  const detail=document.getElementById('grDetail');
  detail.innerHTML='';
  const g=GAME_REGISTRY[gameMode];
  if(g){
    const r=document.createElement('div');r.className='gr-detail-row';
    r.innerHTML='<span>Game</span><span style="font-weight:800">'+g.title+'</span>';
    detail.appendChild(r);
  }
  const r2=document.createElement('div');r2.className='gr-detail-row';
  r2.innerHTML='<span>Duration</span><span>'+Math.round((Date.now()-gameStartTime)/1000)+'s</span>';
  detail.appendChild(r2);
  const r3=document.createElement('div');r3.className='gr-detail-row';
  r3.innerHTML='<span>Level Reached</span><span>'+gameLevel+'</span>';
  detail.appendChild(r3);
  detail.innerHTML='<div class="gr-detail-row">✅ Correct: <span>'+gameCorrect+'</span></div><div class="gr-detail-row">❌ Mistakes: <span>'+gameWrong+'</span></div><div class="gr-detail-row">🔥 Best Streak: <span>'+gameStreak+'</span></div>'+detail.innerHTML;
  const weakArea=document.getElementById('grWeak');
  const weakList=document.getElementById('grWeakList');
  const retryWrong=document.getElementById('grRetryWrong');
  const weakCount=document.getElementById('grWeakCount');
  if(gameMistakes.length>0){
    weakArea.classList.remove('hidden');
    if(weakCount)weakCount.textContent=gameMistakes.length+' mistake(s)';
    weakList.innerHTML=gameMistakes.map(q=>'<div class="gr-weak-item">'+q+'</div>').join('');
    retryWrong.style.display='';
  }else{
    weakArea.classList.add('hidden');
    retryWrong.style.display='none';
  }
}
function retryGame(){startGame(gameMode);}
function retryWrongGame(){
  if(gameMistakeQs.length<2){showToast({message:'Need at least 2 mistakes to review'});return;}
  const mistakes=gameMistakeQs.slice();
  gameRetryPool=mistakes;
  gameScore=0;gameLevel=1;gameStreak=0;
  gameCorrect=0;gameWrong=0;gameMistakes=[];gameMistakeQs=[];gamePaused=false;gameStartTime=Date.now();
  gameTotalQs=mistakes.length;
  const g=GAME_REGISTRY[gameMode];if(!g)return;
  document.getElementById('gameHome').classList.add('hidden');
  document.getElementById('gameResult').classList.add('hidden');
  document.getElementById('gamePlay').classList.remove('hidden');
  const chM=getSubjectChapters(curSubjectId)||[];
  const hiM=chapterIsHindi(chM[curChIdx]);
  const hiLabM=GAME_HI_LABELS[gameMode]||[g.title,g.desc];
  document.getElementById('gpTitle').textContent=g.icon+' '+(hiM?hiLabM[0]:g.title)+(hiM?' (गलत)':' (Mistakes)');
  document.getElementById('gpFeedback').classList.add('hidden');
  document.getElementById('gpPauseOverlay').classList.add('hidden');
  updateGamePlayHud();
  g.init();
}
function exitGame(){showGameModes();}
function togglePause(){
  gamePaused=!gamePaused;
  document.getElementById('gpPauseOverlay').classList.toggle('hidden',!gamePaused);
}
function resumeGame(){gamePaused=false;document.getElementById('gpPauseOverlay').classList.add('hidden');}
function saveGameProgress(){
  if(!curSubjectId)return;
  const key='lh_game_progress_'+curSubjectId+'_'+curChIdx;
  const data=safeParse(localStorage.getItem('lh_game_data'),{});
  const chKey=curSubjectId+'_'+curChIdx;
  if(!data[chKey])data[chKey]={};
  const entry=data[chKey];
  if(!entry[gameMode]||gameScore>(entry[gameMode].score||0)){
    entry[gameMode]={score:gameScore,level:gameLevel,correct:gameCorrect,wrong:gameWrong,ts:Date.now()};
  }
  const g=GAME_REGISTRY[gameMode];
  if(g){
    if(!entry.completed)entry.completed=[];
    if(!entry.completed.includes(gameMode)&&gameCorrect>0)entry.completed.push(gameMode);
  }
  localStorage.setItem('lh_game_data',JSON.stringify(data));
}
function getGameProgress(){
  if(!curSubjectId)return{completed:[]};
  const data=safeParse(localStorage.getItem('lh_game_data'),{});
  return data[curSubjectId+'_'+curChIdx]||{};
}
async function aiGenerateGame(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return showToast({message:'No chapter content found.',type:'error'});
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);
  const prompt='Generate 5 new quiz questions for subject "'+getSubjectName(sub)+'" chapter "'+(ch.name||'')+'". Return ONLY a valid JSON array where each element has keys: "q" (question), "a" (answer), "o" (array of 2 wrong options), "type" (either "mcq" or "fill"). No markdown, no code fences.';
  const resp=await callGemini(prompt,'',4000,true);
  if(!resp)return showToast({message:'AI not responding — check API key in Admin panel.',type:'error'});
  try{
    const qs=parseJsonArray(resp);
    if(!Array.isArray(qs)||qs.length===0)throw new Error('Empty');
    if(!ch.learn)ch.learn=[];
    qs.forEach(q=>{ch.learn.push({q:q.q||'',a:q.a||q.answer||'',o:q.o||[],answer:q.answer||q.a||'',type:q.type||'mcq'});});
    repairChapterQuestions(ch);
    saveSubjectChapters(curSubjectId,chapters);
    showToast({message:'Generated '+qs.length+' new questions!'});
    showGameModes();
  }catch(e){showToast({message:'Failed to parse AI response.',type:'error'});}
}
async function aiHindiKaro(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return showToast({message:'No chapter content found.',type:'error'});
  if(chapterIsHindi(ch))return showToast({message:'Ye chapter pehle se Hindi me hai.',type:'success'});
  const pool=[...(ch.learn||[]),...(ch.exercise||[])];
  if(pool.length===0)return showToast({message:'Pehle kuch questions generate karo.',type:'error'});
  const sample=pool.slice(0,8).map(q=>({type:q.type||'mcq',q:q.q||'',a:q.a||q.answer||'',o:q.o||[],display:q.display||''}));
  const prompt='Translate these study questions into pure Hindi (Devanagari script only). Keep the SAME JSON array structure and SAME number of items in the SAME order. Translate every text field (q, a, o, display) into simple natural Hindi for a young student. Only proper nouns and numbers may stay in English. No English words otherwise. Return ONLY valid JSON array.\n\n'+JSON.stringify(sample);
  const resp=await callGemini(prompt,'You are a Hindi teacher. Translate study questions into simple pure Hindi (Devanagari). Return only valid JSON.',6000,true);
  if(!resp)return showToast({message:'AI not responding — check API key in Admin panel.',type:'error'});
  try{
    const qs=parseJsonArray(resp);
    if(!Array.isArray(qs)||qs.length===0)throw new Error('Empty');
    const rebuild=function(arr){
      return arr.map(function(q,i){
        const t=qs[i]||q;
        return {type:q.type||'mcq',q:t.q||q.q||'',a:t.a||q.a||q.answer||'',answer:t.answer||t.a||q.answer||'',o:(t.o&&t.o.length)?t.o:(q.o||[]),display:t.display||q.display||''};
      });
    };
    ch.learn=rebuild(ch.learn||[]);
    ch.exercise=rebuild(ch.exercise||[]);
    ch.lang='hi';
    repairChapterQuestions(ch);
    saveSubjectChapters(curSubjectId,chapters);
    showToast({message:'✅ Chapter Hindi me convert ho gaya!',type:'success'});
    showGameModes();
  }catch(e){showToast({message:'Failed to parse AI response.',type:'error'});}
}
async function aiEasierGame(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return;
  const pool=[...(ch.learn||[]),...(ch.exercise||[])];
  if(pool.length===0)return showToast({message:'No existing questions to simplify.',type:'error'});
  const sample=pool.slice(0,3).map(q=>'Q: '+(q.q||'')+' A: '+(q.a||q.answer||'')).join('\n');
  const prompt='Simplify these questions for a younger learner. Make them easier with simpler words and more hints. Return ONLY a valid JSON array of {"q":"...","a":"...","o":["wrong1","wrong2"],"type":"mcq"}.\n'+sample;
  const resp=await callGemini(prompt,'',4000,true);
  if(!resp)return showToast({message:'AI not responding — check API key in Admin panel.',type:'error'});
  try{
    const qs=parseJsonArray(resp);
    if(!Array.isArray(qs)||qs.length===0)throw new Error('Empty');
    if(!ch.learn)ch.learn=[];
    qs.forEach(q=>{ch.learn.push({q:q.q||'',a:q.a||q.answer||'',o:q.o||[],answer:q.answer||q.a||'',type:q.type||'mcq'});});
    repairChapterQuestions(ch);
    saveSubjectChapters(curSubjectId,chapters);
    showToast({message:'Generated '+qs.length+' easier questions!'});
    showGameModes();
  }catch(e){showToast({message:'Failed to parse AI response.',type:'error'});}
}
async function aiHarderGame(){
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return;
  const pool=[...(ch.learn||[]),...(ch.exercise||[])];
  if(pool.length===0)return showToast({message:'No existing questions to make harder.',type:'error'});
  const sample=pool.slice(0,3).map(q=>'Q: '+(q.q||'')+' A: '+(q.a||q.answer||'')).join('\n');
  const prompt='Make these questions MORE CHALLENGING. Add complex concepts, require deeper thinking. Return ONLY a valid JSON array of {"q":"...","a":"...","o":["wrong1","wrong2"],"type":"mcq"}.\n'+sample;
  const resp=await callGemini(prompt,'',4000,true);
  if(!resp)return showToast({message:'AI not responding — check API key in Admin panel.',type:'error'});
  try{
    const qs=parseJsonArray(resp);
    if(!Array.isArray(qs)||qs.length===0)throw new Error('Empty');
    if(!ch.learn)ch.learn=[];
    qs.forEach(q=>{ch.learn.push({q:q.q||'',a:q.a||q.answer||'',o:q.o||[],answer:q.answer||q.a||'',type:q.type||'mcq'});});
    repairChapterQuestions(ch);
    saveSubjectChapters(curSubjectId,chapters);
    showToast({message:'Generated '+qs.length+' harder questions!'});
    showGameModes();
  }catch(e){showToast({message:'Failed to parse AI response.',type:'error'});}
}

// WORD MATCH
let matchSelected=null,matchPairs=[],matchDone=0;
function startMatchGame(){
  const pool=getGamePool().slice(0,4+gameLevel);
  matchPairs=pool.map(q=>({id:Math.random(),q:(q.q||'').substring(0,50),a:(q.a||q.answer||'').substring(0,30)}));
  matchSelected=null;matchDone=0;
  const shuffledQs=shuffle([...matchPairs]);
  const shuffledAs=shuffle([...matchPairs]);
  const area=document.getElementById('gpPlayArea');
  let html=`<div class="game-mode-card" style="margin-bottom:0;padding:16px"><div style="font-family:'Baloo 2',cursive;font-size:.95rem;font-weight:700;color:#2D2A4A;text-align:center;margin-bottom:12px">🔗 Match the question to its answer!</div><div class="match-grid"><div class="match-col" id="matchLeft">`;
  shuffledQs.forEach(p=>{html+=`<div class="match-item" data-type="q" data-id="${p.id}" onclick="matchClick(this)">${p.q}</div>`;});
  html+=`</div><div class="match-col" id="matchRight">`;
  shuffledAs.forEach(p=>{html+=`<div class="match-item" data-type="a" data-id="${p.id}" onclick="matchClick(this)">${p.a}</div>`;});
  html+=`</div></div></div>`;
  area.innerHTML=html;
}
function matchClick(el){
  if(el.classList.contains('matched'))return;
  if(!matchSelected){matchSelected=el;el.classList.add('selected');return;}
  if(matchSelected===el){matchSelected.classList.remove('selected');matchSelected=null;return;}
  if(matchSelected.dataset.type===el.dataset.type){matchSelected.classList.remove('selected');matchSelected=el;el.classList.add('selected');return;}
  const correct=matchSelected.dataset.id===el.dataset.id;
  if(correct){
    matchSelected.classList.remove('selected');
    matchSelected.classList.add('matched');
    el.classList.add('matched');
    matchDone++;
    gameFeedback(true,'✅ Matched!');
    if(matchDone>=matchPairs.length){setTimeout(endGame,1200);}
    else gameNext();
  }else{
    matchSelected.classList.add('wrong-flash');
    el.classList.add('wrong-flash');
    const prev=matchSelected;
    const mPair=matchPairs.find(p=>p.id==matchSelected.dataset.id);
    setTimeout(()=>{prev.classList.remove('wrong-flash','selected');el.classList.remove('wrong-flash');},500);
    gameFeedback(false,'❌ Try again!');
    recordMistake(mPair);
    gameNext();
  }
  matchSelected=null;
}

// WORD SCRAMBLE
let scrambleAnswer='',scrambleSlots=[],scrambleQ=null,scrambleCount=0;
function startScrambleGame(){
  const pool=getGamePool();
  const q=pool[gameLevel%pool.length]||pool[0];
  scrambleQ=q;
  const answer=(q.a||q.answer||'').toLowerCase();
  scrambleAnswer=answer;
  const letters=shuffle(answer.split(''));
  scrambleSlots=[];
  const area=document.getElementById('gpPlayArea');
  let html=`<div class="game-mode-card" style="margin-bottom:0;padding:16px">
    <div style="font-family:'Nunito',sans-serif;font-size:.85rem;color:#7B7A9A;text-align:center;margin-bottom:6px">${(q.q||'').substring(0,80)}</div>
    <div class="scramble-word">${shuffle(answer.split('')).map(l=>l===' '?'&nbsp;&nbsp;':l).join(' ')}</div>
    <div class="scramble-answer" id="scrambleAnswerSlots">`;
  for(let i=0;i<answer.length;i++){html+=`<div class="scramble-slot" data-idx="${i}"></div>`;}
  html+=`</div><div class="scramble-letters" id="scrambleLetters">`;
  letters.forEach((l,i)=>{html+=`<div class="scramble-letter" data-letter="${l}" data-idx="${i}" onclick="scramblePick(this)">${l===' '?'&nbsp;':l}</div>`;});
  html+=`</div><button class="submit-btn" style="margin:10px auto 0;display:block;background:linear-gradient(135deg,#48CAE4,#C77DFF)" onclick="checkScramble()">Check ✓</button></div>`;
  area.innerHTML=html;
}
function scramblePick(el){
  if(el.classList.contains('used'))return;
  el.classList.add('used');
  const slots=document.getElementById('scrambleAnswerSlots');
  const empty=slots.querySelector('.scramble-slot:not(.filled)');
  if(!empty)return;
  empty.textContent=el.dataset.letter===' '?' ':el.dataset.letter;
  empty.classList.add('filled');
  empty.dataset.letter=el.dataset.letter;
  scrambleSlots.push(el);
}
function checkScramble(){
  const slots=document.getElementById('scrambleAnswerSlots').querySelectorAll('.scramble-slot');
  let userAnswer='';
  slots.forEach(s=>{userAnswer+=s.dataset.letter||'';});
  if(userAnswer.trim()===scrambleAnswer.trim()){gameFeedback(true,'🎉 Correct!');}
  else{gameFeedback(false,'❌ Answer: '+scrambleAnswer);recordMistake(scrambleQ);}
  scrambleCount++;
  if(scrambleCount>=5+gameLevel)setTimeout(endGame,800);
  else gameNext();
}

// SPEED ROUND
let speedIdx=0,speedPool=[],speedTimeLeft=0,speedInterval=null;
function startSpeedGame(){
  speedPool=getGamePool();
  speedIdx=0;
  document.getElementById('gpTimer').textContent='15s';
  loadSpeedQ();
}
function loadSpeedQ(){
  if(speedIdx>=speedPool.length){endGame();return;}
  const q=speedPool[speedIdx];
  speedTimeLeft=15-Math.min(gameLevel*2,8);
  const area=document.getElementById('gpPlayArea');
  const opts=buildQuestionOptions(q,speedPool,4);
  let html=`<div class="speed-card">
    <div style="font-family:'Baloo 2',cursive;font-size:.8rem;color:#7B7A9A;margin-bottom:8px">⚡ Speed Round — Level ${gameLevel}</div>
    <div class="speed-timer-bar"><div class="speed-timer-fill" id="speedTimerFill" style="width:100%"></div></div>
    <div class="speed-question">${q.q||''}</div>
    <div class="speed-options">`;
  shuffle(opts).forEach(o=>{html+=`<div class="speed-opt" onclick="speedAnswer(this,'${(o||'').replace(/'/g,"\\'")}','${(q.a||q.answer||'').replace(/'/g,"\\'")}')">${o}</div>`;});
  html+=`</div></div>`;
  area.innerHTML=html;
  clearInterval(speedInterval);
  speedInterval=setInterval(()=>{
    speedTimeLeft--;
    const fill=document.getElementById('speedTimerFill');
    if(fill)fill.style.width=(speedTimeLeft/15*100)+'%';
    if(speedTimeLeft<=0){clearInterval(speedInterval);gameFeedback(false,"⏱️ Time's up!");recordMistake(speedPool[speedIdx]);speedIdx++;gameNext();}
  },1000);
}
function speedAnswer(el,chosen,correct){
  clearInterval(speedInterval);
  document.querySelectorAll('.speed-opt').forEach(b=>{b.style.pointerEvents='none';});
  if(chosen===correct){el.classList.add('correct');gameFeedback(true,'⚡ Speed bonus! +'+(15+speedTimeLeft*2)+' pts');}
  else{el.classList.add('wrong');document.querySelectorAll('.speed-opt').forEach(b=>{if(b.textContent.trim()===correct.trim())b.classList.add('correct');});gameFeedback(false,'❌ Correct: '+correct);recordMistake(speedPool[speedIdx]);}
  speedIdx++;gameNext();
}

// MEMORY MATCH
let memoryCards=[],memoryFlipped=[],memoryMatched=0,memoryPool=[];
function startMemoryGame(){
  const pool=getGamePool().slice(0,3+Math.min(gameLevel,4));
  memoryPool=pool;
  const pairs=pool.map(q=>({q:(q.q||'').substring(0,25),a:(q.a||q.answer||'').substring(0,25)}));
  memoryCards=[];memoryFlipped=[];memoryMatched=0;
  pairs.forEach((p,i)=>{
    memoryCards.push({id:i,text:p.q,pairId:i});
    memoryCards.push({id:i+100,text:p.a,pairId:i});
  });
  memoryCards=shuffle(memoryCards);
  const area=document.getElementById('gpPlayArea');
  const cols=memoryCards.length<=6?3:memoryCards.length<=12?3:4;
  let html=`<div class="game-mode-card" style="margin-bottom:0;padding:16px"><div style="font-family:'Baloo 2',cursive;font-size:.95rem;font-weight:700;color:#2D2A4A;text-align:center;margin-bottom:12px">🧠 Find matching pairs!</div><div class="memory-grid" style="grid-template-columns:repeat(${cols},1fr)" id="memoryGrid">`;
  memoryCards.forEach((c,i)=>{html+=`<div class="memory-card" data-idx="${i}" onclick="memoryFlip(this)"><span class="card-front">❓</span><span class="card-back hidden-text">${c.text}</span></div>`;});
  html+=`</div></div>`;
  area.innerHTML=html;
}
function memoryFlip(el){
  if(el.classList.contains('flipped')||el.classList.contains('matched'))return;
  if(memoryFlipped.length>=2)return;
  el.classList.add('flipped');
  el.querySelector('.card-front').textContent='';
  el.querySelector('.card-back').classList.remove('hidden-text');
  memoryFlipped.push(el);
  if(memoryFlipped.length===2){
    const a=memoryCards[memoryFlipped[0].dataset.idx];
    const b=memoryCards[memoryFlipped[1].dataset.idx];
    if(a.pairId===b.pairId){
      memoryFlipped[0].classList.add('matched');
      memoryFlipped[1].classList.add('matched');
      memoryMatched++;
      gameFeedback(true,'✅ Matched!');
      if(memoryMatched>=new Set(memoryCards.map(c=>c.pairId)).size){setTimeout(endGame,1200);}
      else gameNext();
      memoryFlipped=[];
    }else{
      setTimeout(()=>{
        memoryFlipped.forEach(el=>{el.classList.remove('flipped');el.querySelector('.card-front').textContent='❓';el.querySelector('.card-back').classList.add('hidden-text');});
        memoryFlipped=[];
      },600);
      gameFeedback(false,'❌ Not a match!');
      recordMistake(memoryPool[a.pairId]);
    }
  }
}

// ══════════════════════════════════════
// GENERIC GAME HELPERS
// ══════════════════════════════════════
function startFillGame(){
  const pool=getGamePool().filter(q=>q.type==='fill');
  if(pool.length===0){showToast({message:'No fill-in-the-blank questions available.',type:'error'});exitGame();return;}
  const area=document.getElementById('gpPlayArea');
  area.innerHTML='<div class="game-mode-card" style="margin-bottom:0;padding:16px"><div style="font-family:\'Baloo 2\',cursive;font-size:.9rem;font-weight:700;color:#2D2A4A;text-align:center;margin-bottom:12px">📝 Fill in the blanks!</div><div id="fillArea" style="display:flex;flex-direction:column;gap:12px"></div></div>';
  let fillDone=0;
  pool.forEach((q,i)=>{
    const inp=document.getElementById('fillArea');
    const row=document.createElement('div');row.style.cssText='display:flex;gap:8px;align-items:center;flex-wrap:wrap';
    const lbl=document.createElement('span');lbl.style.cssText='font-family:Nunito,sans-serif;font-size:.9rem;color:#2D2A4A;flex:1';lbl.textContent=q.q.replace(/_{2,}/g,'___');
    const ip=document.createElement('input');ip.type='text';ip.placeholder='Answer...';ip.style.cssText='flex:0 0 120px;padding:8px 12px;border:2px solid #ddd;border-radius:12px;font-family:Nunito,sans-serif;font-size:.85rem;outline:none';
    ip.dataset.answer=(q.a||q.answer||'').toLowerCase().trim();
    const btn=document.createElement('button');btn.textContent='✓';btn.style.cssText='width:40px;height:40px;border-radius:50%;border:none;background:#27AE60;color:#fff;font-size:1.2rem;cursor:pointer';
    btn.onclick=function(){
      const ans=ip.value.toLowerCase().trim();
      const correct=ans===ip.dataset.answer;
      ip.style.borderColor=correct?'#27AE60':'#E74C3C';
      gameFeedback(correct,correct?'✅ Correct!':'❌ Answer: '+ip.dataset.answer);
      if(!correct)recordMistake(q);
      btn.disabled=true;ip.disabled=true;
      fillDone++;
      if(fillDone>=pool.length)setTimeout(()=>endGame(),900);
    };
    row.appendChild(lbl);row.appendChild(ip);row.appendChild(btn);
    inp.appendChild(row);
  });
}
function startMCQGame(){
  mcqPool=getGamePool().filter(q=>q.o&&q.o.length>0);
  mcqIdx=0;
  if(mcqPool.length===0){showToast({message:'No MCQ questions available.',type:'error'});exitGame();return;}
  loadMCQQ();
}
let mcqIdx=0,mcqPool=[];
function loadMCQQ(){
  if(mcqIdx>=mcqPool.length){endGame();return;}
  const q=mcqPool[mcqIdx];
  const area=document.getElementById('gpPlayArea');
  const options=buildQuestionOptions(q,mcqPool,4);
  let html='<div class="game-mode-card" style="margin-bottom:0;padding:16px"><div style="font-family:\'Baloo 2\',cursive;font-size:.95rem;font-weight:700;color:#2D2A4A;text-align:center;margin-bottom:12px">🎯 MCQ Challenge</div><div style="font-family:Nunito,sans-serif;font-size:.95rem;color:#2D2A4A;margin-bottom:12px;text-align:center">'+(q.q||q.question||'')+'</div><div style="display:flex;flex-direction:column;gap:8px">';
  options.forEach(o=>{
    const correct=o===q.a||o===q.answer;
    html+='<button class="mcq-opt" style="padding:12px 16px;border:2px solid #ddd;border-radius:14px;background:#fff;font-family:Nunito,sans-serif;font-size:.9rem;color:#2D2A4A;cursor:pointer;text-align:left;transition:all .2s" onclick="checkMCQGame(this,'+correct+')">'+o+'</button>';
  });
  html+='</div></div>';
  area.innerHTML=html;
}
function checkMCQGame(el,correct){
  document.querySelectorAll('.mcq-opt').forEach(b=>b.disabled=true);
  if(correct){el.style.borderColor='#27AE60';el.style.background='#E8F8F0';gameFeedback(true,'✅ Correct!');}
  else{el.style.borderColor='#E74C3C';el.style.background='#FDEDEC';gameFeedback(false,'❌ Wrong!');recordMistake(mcqPool[mcqIdx]);}
  mcqIdx++;
  setTimeout(()=>{if(mcqIdx<mcqPool.length)loadMCQQ();else endGame();},800);
}
function startTFGame(){
  const pool=getGamePool().slice(0,5+gameLevel);
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];
  const isHi=chapterIsHindi(ch);
  const qTxt=isHi?'प्रश्न: ':'Q: ';
  const aTxt=isHi?'उत्तर: ':'Answer: ';
  const correctTxt=isHi?'सही':'Correct';
  const wrongTxt=isHi?'गलत':'Wrong';
  const askTxt=isHi?'क्या यह उत्तर सही है?':'Is this answer correct?';
  const area=document.getElementById('gpPlayArea');
  area.innerHTML='<div class="game-mode-card" style="margin-bottom:0;padding:16px"><div style="font-family:\'Baloo 2\',cursive;font-size:.9rem;font-weight:700;color:#2D2A4A;text-align:center;margin-bottom:6px">✅ '+(isHi?'सही या गलत':'True or False')+'</div><div style="font-family:Nunito,sans-serif;font-size:.78rem;color:#7B7A9A;text-align:center;margin-bottom:12px">'+askTxt+'</div><div id="tfArea" style="display:flex;flex-direction:column;gap:10px"></div></div>';
  const tfArea=document.getElementById('tfArea');
  const items=[];
  pool.forEach(q=>{
    const base=(q.q||'').trim();
    const correct=q.a||q.answer||'';
    if(!base||!correct)return;
    items.push({q:q,text:qTxt+base+' '+aTxt+correct,truth:'true',reveal:correct});
    const wrong=buildQuestionOptions(q,pool,4).find(o=>o!==correct)||null;
    if(wrong)items.push({q:q,text:qTxt+base+' '+aTxt+wrong,truth:'false',reveal:correct});
  });
  const rows=shuffle(items).slice(0,Math.min(items.length,pool.length*2));
  gameTotalQs=rows.length;
  let done=0;
  rows.forEach(it=>{
    const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border-radius:12px;border:2px solid #eee';
    const lbl=document.createElement('span');lbl.style.cssText='flex:1;font-family:Nunito,sans-serif;font-size:.85rem;color:#2D2A4A';lbl.textContent=it.text;
    row.dataset.answer=it.truth;
    const tBtn=document.createElement('button');tBtn.textContent='✓ '+correctTxt;tBtn.style.cssText='padding:6px 14px;border-radius:10px;border:2px solid #27AE60;background:#fff;color:#27AE60;font-weight:700;font-family:Nunito,sans-serif;font-size:.8rem;cursor:pointer;white-space:nowrap';
    const fBtn=document.createElement('button');fBtn.textContent='✗ '+wrongTxt;fBtn.style.cssText='padding:6px 14px;border-radius:10px;border:2px solid #E74C3C;background:#fff;color:#E74C3C;font-weight:700;font-family:Nunito,sans-serif;font-size:.8rem;cursor:pointer;white-space:nowrap';
    const ansEl=document.createElement('span');ansEl.style.cssText='font-size:.75rem;color:#7B7A9A;display:none;flex-basis:100%;margin-top:2px';
    ansEl.textContent=it.truth==='true'?'✓ '+correctTxt+' — '+it.reveal:'✗ '+wrongTxt+' — '+aTxt+it.reveal;
    function selectTF(el,val){
      tBtn.disabled=true;fBtn.disabled=true;done++;
      const ok=(val===row.dataset.answer);
      el.style.background=ok?'#27AE60':'#E74C3C';
      el.style.color='#fff';
      row.style.borderColor=ok?'#27AE60':'#E74C3C';
      ansEl.style.display='inline';
      gameFeedback(ok,ok?'✅ '+correctTxt+'!':'❌ '+aTxt+it.reveal);
      if(!ok)recordMistake(it.q);
      if(done>=rows.length)setTimeout(endGame,900);
    }
    tBtn.onclick=function(){selectTF(this,'true')};
    fBtn.onclick=function(){selectTF(this,'false')};
    row.appendChild(lbl);row.appendChild(tBtn);row.appendChild(fBtn);row.appendChild(ansEl);
    tfArea.appendChild(row);
  });
}

// ══════════════════════════════════════
// GAME LOGIC
// ══════════════════════════════════════
function shuffle(a){return[...a].sort(()=>Math.random()-.5)}

// ── QUESTION OPTIONS BUILDER ────────────────────────────────
// Har MCQ/speed/tf question ke liye hamesha options banata hai:
// - correct answer (q.a || q.answer) included
// - 2-3 wrong distractors (dusre questions ke answers se + generic)
// - unique, shuffled
function buildQuestionOptions(q,pool,count){
  count=count||4;
  const correct=String(q.a||q.answer||'').trim();
  const opts=[];const seen=new Set();
  function tryAdd(s){
    s=String(s||'').trim();
    if(!s||seen.has(s)||s===correct)return false;
    seen.add(s);opts.push(s);return true;
  }
  // 1. q.o se distractors (agar already hai to use karo)
  (q.o||[]).forEach(o=>tryAdd(o));
  // 2. pool ke answers se distractors
  const cands=(pool||[]).map(x=>String(x.a||x.answer||'').trim()).filter(s=>s&&!seen.has(s));
  const shuffledCands=shuffle(cands);
  for(const c of shuffledCands){if(opts.length>=count-1)break;tryAdd(c);}
  // 3. generic fallback (last resort)
  const generic=['None of these','All of these','Both','कुछ नहीं','ये सब'];
  for(const g of generic){if(opts.length>=count-1)break;tryAdd(g);}
  // correct ko hamesha include karo
  if(correct&&opts.indexOf(correct)<0)opts.push(correct);
  return shuffle(opts);
}
function repairQuestionOptions(q,pool){
  if(!q)return q;
  if(q.type==='fill')return q;
  const opts=buildQuestionOptions(q,pool,4);
  if(opts.length>=2){
    q.o=opts;
    if(!q.a&&q.answer)q.a=q.answer;
    if(!q.answer&&q.a)q.answer=q.a;
    q.type='mcq';
  }
  return q;
}
function repairChapterQuestions(ch){
  if(!ch)return ch;
  const pool=[...(ch.learn||[]),...(ch.exercise||[])];
  (ch.learn||[]).forEach(q=>repairQuestionOptions(q,pool));
  (ch.exercise||[]).forEach(q=>repairQuestionOptions(q,pool));
  return ch;
}
function restartGame(){
  showQuestions();
  const chapters=getSubjectChapters(curSubjectId)||[];
  const ch=chapters[curChIdx];if(!ch)return;
  const pool=curSection==='learn'?(ch.learn||[]):(ch.exercise||[]);
  shuffledQs=shuffle(pool);curQ=0;score=0;answered=false;wrongAnswers=[];
  streak=0;bestStreak=0;
  document.getElementById('score').textContent=0;
  document.getElementById('qtotal').textContent=shuffledQs.length;
  document.getElementById('endScreen').style.display='none';
  document.getElementById('mainQ').style.display='';
  document.getElementById('aiPanel').classList.add('hidden');
  document.getElementById('progFill').style.width='0%';
  document.getElementById('progFill').style.background=ch.color;
  const badge=document.getElementById('chBadge');badge.textContent=ch.name+' — '+(curSection==='learn'?'📝 Learn':'✏️ Practice');badge.style.background=ch.color;
  document.getElementById('nextBtn').style.background=ch.color;
  if(qAnimObj){try{qAnimObj.destroy()}catch(e){}}
  qAnimObj=loadLottie(document.getElementById('questionAnim'),chAnims[curChIdx%chAnims.length]);
  stopTimer();
  document.getElementById('gHintBox').classList.add('hidden');
  document.getElementById('gStatsBar').style.display='flex';
  document.getElementById('motivation').textContent='';
  document.getElementById('motivation').classList.add('hidden');
  document.getElementById('hintBtn').disabled=false;
  buildPalette();loadQ();
}
function loadQ(){
  if(curQ>=shuffledQs.length){showEnd();return;}
  answered=false;currentQ=shuffledQs[curQ];
  const q=currentQ;
  const isHi=chapterIsHindi(getSubjectChapters(curSubjectId)[curChIdx]);
  document.getElementById('qnum').textContent=curQ+1;
  document.getElementById('qNumLabel').textContent=(isHi?'प्रश्न ':'Question ')+(curQ+1)+' / '+shuffledQs.length;
  document.getElementById('qText').textContent=q.q;
  document.getElementById('feedback').textContent='';document.getElementById('feedback').className='feedback';
  document.getElementById('nextBtn').classList.remove('show');
  document.getElementById('explainBtn').classList.remove('show');
  document.getElementById('confusedBtn').classList.remove('show');
  document.getElementById('aiPanel').classList.add('hidden');
  if(isHi){
    document.getElementById('speakQBtn').style.display='none';
    document.getElementById('hindiSpeakBtn').style.display='inline-block';
    document.getElementById('hindiTransBtn').style.display='none';
  }else{
    document.getElementById('speakQBtn').style.display='inline-block';
    document.getElementById('hindiSpeakBtn').style.display='inline-block';
    document.getElementById('hindiTransBtn').style.display='inline-block';
  }
  document.getElementById('hindiTranslation').classList.add('hidden');
  document.getElementById('hindiTransBtn').textContent='📖 Read in Hindi';
  document.getElementById('gHintBox').classList.add('hidden');
  document.getElementById('motivation').textContent='';
  document.getElementById('motivation').classList.add('hidden');
  hintsRemaining=hintLimit;
  removedOptions=[];
  document.getElementById('hintBtn').disabled=false;
  document.getElementById('hintBtn').innerHTML=isHi?'💡 संकेत <span id="hintCount">'+hintsRemaining+'</span>':'💡 Hint <span id="hintCount">'+hintsRemaining+'</span>';
  document.getElementById('hintCount').textContent=hintsRemaining;
  document.getElementById('nextBtn').textContent=isHi?'आगे ➜':'Next ➜';
  document.getElementById('explainBtn').textContent=isHi?'💡 समझाओ':'💡 Explain';
  document.getElementById('confusedBtn').textContent=isHi?'😕 समझ नहीं आया':"😕 Didn't Understand";
  document.getElementById('hindiSpeakBtn').textContent=isHi?'🔊 सुनें':'🔊 Listen in Hindi';
  const area=document.getElementById('answerArea');area.innerHTML='';
  if(q.type==='fill'){
    const inp=document.createElement('input');inp.type='text';inp.className='fill-input';inp.placeholder=isHi?'अपना उत्तर लिखें...':'Type your answer...';inp.id='fillInput';
    inp.onkeydown=e=>{if(e.key==='Enter')checkFill()};
    area.appendChild(inp);area.appendChild(document.createElement('br'));
    const sub=document.createElement('button');sub.className='submit-btn';sub.textContent=isHi?'जाँचें ✓':'Check ✓';
    const ch=getSubjectChapters(curSubjectId)[curChIdx];if(ch)sub.style.background=ch.color;sub.onclick=checkFill;
    area.appendChild(sub);
  }else{
    const grid=document.createElement('div');grid.className='options-grid';
    buildQuestionOptions(q,shuffledQs,4).forEach(opt=>{
      const btn=document.createElement('button');btn.className='opt-btn pop-in';btn.textContent=opt;
      btn.onclick=()=>checkMCQ(opt,btn,q.a||q.answer);grid.appendChild(btn);
    });
    area.appendChild(grid);
  }
  document.getElementById('progFill').style.width=(curQ/shuffledQs.length*100)+'%';
  updatePalette();
  startTimer();
  document.getElementById('gStreak').textContent='🔥 '+streak;
  updateStreakClass();
  setTimeout(()=>{if(isHi)speakHI(q.q);else speakEN(q.q);},400);
}
function checkMCQ(chosen,btn,correct){
  if(answered)return;answered=true;
  document.querySelectorAll('.opt-btn').forEach(b=>{b.disabled=true;if(b.textContent===correct)b.classList.add('correct');});
  if(chosen===correct){score++;document.getElementById('score').textContent=score;showFeedback(true,correct);}
  else{btn.classList.add('wrong');showFeedback(false,correct);wrongAnswers.push({q:currentQ.q,correct,a:chosen});}
}
function checkFill(){
  if(answered)return;const inp=document.getElementById('fillInput');if(!inp)return;
  const val=inp.value.trim().toLowerCase();const ans=currentQ.answer||currentQ.a||'';
  const correct=ans.toLowerCase();
  inp.disabled=true;const sub=inp.parentElement.querySelector('.submit-btn');if(sub)sub.disabled=true;answered=true;
  if(val===correct){inp.classList.add('correct');score++;document.getElementById('score').textContent=score;showFeedback(true,ans);}
  else{inp.classList.add('wrong');showFeedback(false,ans);wrongAnswers.push({q:currentQ.q,correct:ans,a:val});}
}
function showFeedback(ok,ans){
  const fb=document.getElementById('feedback');
  const isHi=chapterIsHindi(getSubjectChapters(curSubjectId)[curChIdx]);
  const ok_m=isHi?['⭐ सही!','🌟 शानदार!','🎉 बहुत बढ़िया!','✅ बिल्कुल सही!']:['⭐ Correct!','🌟 Fantastic!','🎉 Great job!','✅ Absolutely right!'];
  const no_m=isHi?['💪 उत्तर: ','🙂 सही उत्तर: ','📖 उत्तर: ']:['💪 Answer: ','🙂 Correct answer: ','📖 Answer: '];
  stopTimer();
  if(ok){
    streak++;if(streak>bestStreak)bestStreak=streak;
    const m=ok_m[Math.floor(Math.random()*ok_m.length)];fb.textContent=m;fb.className='feedback ok';speakHI(m);launchConfetti();
    showXPAnim(true);
  }else{
    streak=0;
    const m=no_m[Math.floor(Math.random()*no_m.length)]+ans;fb.textContent=m;fb.className='feedback no';
    if(isHi)speakHI('अच्छी कोशिश! सही उत्तर है '+ans);
    else speakHI('Good try! The correct answer is '+ans);
    showXPAnim(false);
    showMotivation();
  }
  document.getElementById('gStreak').textContent='🔥 '+streak;
  updateStreakClass();
  updatePalette();
  document.getElementById('nextBtn').classList.add('show');
  document.getElementById('explainBtn').classList.add('show');
  document.getElementById('confusedBtn').classList.add('show');
  document.getElementById('speakQBtn').style.display='none';
  document.getElementById('hindiSpeakBtn').style.display='none';
  document.getElementById('hindiTransBtn').style.display='none';
  document.getElementById('hindiTranslation').classList.add('hidden');
}
function nextQ(){stopTimer();curQ++;loadQ();}

// ══════════════════════════════════════
// TRANSLATE
// ══════════════════════════════════════
async function translateToHindi(){
  if(!currentQ)return;const div=document.getElementById('hindiTranslation');const btn=document.getElementById('hindiTransBtn');
  if(!div.classList.contains('hidden')&&div.textContent){btn.textContent='📖 Read in Hindi';div.classList.add('hidden');return;}
  btn.textContent='⏳ Translating...';
  const reply=await callGemini('Translate to Hindi (Devanagari). Only translation:\n\n'+currentQ.q,'',500);
  if(reply){div.textContent='📖 '+reply;div.classList.remove('hidden');btn.textContent='✖️ Close';speakHI(reply);}
  else{    div.textContent='❌ Translation failed.';div.classList.remove('hidden');btn.textContent='📖 Read in Hindi';}
}

// ══════════════════════════════════════
// AI EXPLAIN
// ══════════════════════════════════════
let aiLang=null; // null = theoryLang follow karo
let _aiExplainType=null;
function getAiLang(){return aiLang||theoryLang||'en';}
function setAiLang(l){
  aiLang=l;
  document.getElementById('aiLangEn').className='ai-lang-btn'+(l==='en'?' active':'');
  document.getElementById('aiLangHi').className='ai-lang-btn'+(l==='hi'?' active':'');
  if(_aiExplainType==='explain')triggerExplain();
  else if(_aiExplainType==='confused')triggerConfused();
}
function syncAiLangToggle(){
  const l=getAiLang();
  const en=document.getElementById('aiLangEn'),hi=document.getElementById('aiLangHi');
  if(en)en.className='ai-lang-btn'+(l==='en'?' active':'');
  if(hi)hi.className='ai-lang-btn'+(l==='hi'?' active':'');
}
async function triggerExplain(){
  if(!currentQ)return;
  _aiExplainType='explain';
  syncAiLangToggle();
  const lang=getAiLang();
  const panel=document.getElementById('aiPanel'),loading=document.getElementById('aiLoading'),textDiv=document.getElementById('aiHindiText'),speakRow=document.getElementById('aiSpeakRow');
  panel.classList.remove('hidden');loading.style.display='flex';textDiv.classList.add('hidden');speakRow.classList.add('hidden');
  if(lang==='hi')speakHI('रुको, मैं समझाती हूँ!');else speakEN('Wait, let me explain!');
  const chapters=getSubjectChapters(curSubjectId)||[];const ch=chapters[curChIdx];
  const ans=currentQ.a||currentQ.answer||'';
  const prompt=(lang==='hi')
    ?`तुम Class ${localStorage.getItem('lh_classLevel')||3} की प्यारी Teacher हो।
Chapter: ${ch?ch.name:''}
सवाल: "${currentQ.q}"
सही जवाब: "${ans}"
बच्चे को सिर्फ देवनागरी हिंदी में समझाओ। अंग्रेज़ी शब्दों की जगह हिंदी शब्द लिखो। 5-6 वाक्य। एक emoji। सीधे concept समझाओ।`
    :`You are a lovely teacher for a Class ${localStorage.getItem('lh_classLevel')||3} student.
Chapter: ${ch?ch.name:''}
Question: "${currentQ.q}"
Correct answer: "${ans}"
Explain the concept directly to the child in simple English. 5-6 sentences. One emoji. No complicated words.`;
  const sys=(lang==='hi')?'तुम अनुभवी Teacher हो। सिर्फ देवनागरी हिंदी में पढ़ाती हो।':'You are an experienced Teacher. Teach in simple English for a young student.';
  const reply=await callGemini(prompt,sys,1024);
  const text=reply||((lang==='hi')?'सही जवाब है: '+ans+'। इसे याद रखो! 📖✨':'The correct answer is: '+ans+'. Remember it! 📖✨');
  loading.style.display='none';textDiv.textContent=text;textDiv.classList.remove('hidden');speakRow.classList.remove('hidden');
  document.getElementById('aiSpeakBtn').onclick=()=>{if(lang==='hi')speakHI(text);else speakEN(text);};
  if(lang==='hi')speakHI(text);else speakEN(text);
}
async function triggerConfused(){
  if(!currentQ)return;
  _aiExplainType='confused';
  syncAiLangToggle();
  const lang=getAiLang();
  const panel=document.getElementById('aiPanel'),loading=document.getElementById('aiLoading'),textDiv=document.getElementById('aiHindiText'),speakRow=document.getElementById('aiSpeakRow');
  panel.classList.remove('hidden');loading.style.display='flex';textDiv.classList.add('hidden');speakRow.classList.add('hidden');
  if(lang==='hi')speakHI('कोई बात नहीं! और आसानी से समझाती हूँ!');else speakEN('No problem! Let me explain more easily!');
  const chapters=getSubjectChapters(curSubjectId)||[];const ch=chapters[curChIdx];
  const ans=currentQ.a||currentQ.answer||'';
  const prompt=(lang==='hi')
    ?`बच्चे को यह सवाल समझ नहीं आया: "${currentQ.q}" सही जवाब: "${ans}"
सिर्फ देवनागरी हिंदी में, बहुत आसान शब्दों में, एक और मजेदार example देकर समझाओ। अंग्रेज़ी शब्दों की जगह हिंदी शब्द लिखो। छोटे वाक्य। emoji।`
    :`The child did not understand this question: "${currentQ.q}" Correct answer: "${ans}"
Explain in very simple English words with a fun example. Short sentences. Add an emoji.`;
  const sys=(lang==='hi')?'धैर्यवान Teacher। बच्चा confuse है। सिर्फ देवनागरी हिंदी में बोलो।':'You are a patient Teacher. The child is confused. Speak in simple English.';
  const reply=await callGemini(prompt,sys,1024);
  const text=reply||((lang==='hi')?'कोई बात नहीं! याद रखो: '+ans+'। 💪📖':'No problem! Remember: '+ans+' 💪📖');
  loading.style.display='none';textDiv.textContent=text;textDiv.classList.remove('hidden');speakRow.classList.remove('hidden');
  document.getElementById('aiSpeakBtn').onclick=()=>{if(lang==='hi')speakHI(text);else speakEN(text);};
  if(lang==='hi')speakHI(text);else speakEN(text);
}

// ══════════════════════════════════════
// TIMER
// ══════════════════════════════════════
function stopTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null;}
  const pill=document.getElementById('timerPill');
  if(pill)pill.classList.add('hidden');
}
function startTimer(){
  stopTimer();
  const pill=document.getElementById('timerPill');
  const display=document.getElementById('timerDisplay');
  if(!pill||!display)return;
  timerSeconds=30;
  display.textContent=timerSeconds;
  pill.classList.remove('hidden');
  timerInterval=setInterval(()=>{
    timerSeconds--;
    display.textContent=timerSeconds;
    if(timerSeconds<=0){
      stopTimer();
      if(!answered&&currentQ){
        answered=true;
        const ans=currentQ.a||currentQ.answer||'';
        document.querySelectorAll('.opt-btn,.submit-btn').forEach(b=>b.disabled=true);
        const inp=document.getElementById('fillInput');
        if(inp)inp.disabled=true;
        showFeedback(false,ans);
        wrongAnswers.push({q:currentQ.q,correct:ans,a:'(timeout)'});
      }
    }
  },1000);
}

// ══════════════════════════════════════
// HINT SYSTEM
// ══════════════════════════════════════
function showHint(){
  if(!currentQ||hintsRemaining<=0||answered)return;
  hintsRemaining--;
  document.getElementById('hintCount').textContent=hintsRemaining;
  if(hintsRemaining<=0)document.getElementById('hintBtn').disabled=true;
  const hintBox=document.getElementById('gHintBox');
  const hintText=document.getElementById('gHintText');
  if(currentQ.type==='fill'){
    const ans=currentQ.answer||currentQ.a||'';
    const reveal=Math.min(3-hintsRemaining,ans.length);
    const hint=ans.substring(0,reveal)+'_ '.repeat(Math.max(1,ans.length-reveal));
    hintText.textContent='💡 Hint: '+hint;
    hintBox.classList.remove('hidden');
    speakHI('Hint: The answer starts with '+ans.substring(0,reveal));
  }else{
    const btns=document.querySelectorAll('#answerArea .opt-btn');
    const correct=currentQ.a;
    const wrongBtns=Array.from(btns).filter(b=>b.textContent!==correct&&!b.classList.contains('hint-removed'));
    if(wrongBtns.length>0){
      const pick=wrongBtns[Math.floor(Math.random()*wrongBtns.length)];
      pick.classList.add('hint-removed');
      pick.style.display='none';
      removedOptions.push(pick.textContent);
      hintText.textContent='💡 Hint: One wrong option removed! ('+hintsRemaining+' left)';
    }else{
      hintText.textContent='💡 Hint: The correct answer is highlighted!';
    }
    hintBox.classList.remove('hidden');
    speakHI('Hint used!');
  }
}

// ══════════════════════════════════════
// PALETTE
// ══════════════════════════════════════
function buildPalette(){
  const container=document.getElementById('gPalette');
  if(!container)return;
  container.innerHTML='';
  for(let i=0;i<shuffledQs.length;i++){
    const dot=document.createElement('span');
    dot.className='g-palette-dot';
    dot.dataset.idx=i;
    container.appendChild(dot);
  }
}
function updatePalette(){
  const dots=document.querySelectorAll('#gPalette .g-palette-dot');
  dots.forEach((dot,i)=>{
    if(i===curQ&&!answered)dot.className='g-palette-dot current';
    else if(i<curQ||answered){
      const wasCorrect=wrongAnswers.some(w=>w.q===shuffledQs[i]?.q);
      dot.className='g-palette-dot '+(wasCorrect?'wrong':'correct');
    }else dot.className='g-palette-dot';
  });
}

// ══════════════════════════════════════
// XP FLOAT
// ══════════════════════════════════════
function showXPAnim(correct){
  const card=document.getElementById('gameCard');
  if(!card)return;
  const el=document.createElement('div');
  el.className='xp-float'+(correct?'':' wrong-xp');
  el.textContent=correct?'+1 ⭐':'✖️';
  el.style.left='50%';
  el.style.top='40%';
  el.style.transform='translateX(-50%)';
  card.appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

// ══════════════════════════════════════
// MOTIVATION
// ══════════════════════════════════════
const MOTIV_MSGS=[
  'Keep going! 💪','Almost there! 🌟','You can do it! 💫',
  'Don\'t give up! 🎯','Try again! 🔥','Learning is growing! 🌱',
  'Every mistake helps! 📚','Stay strong! ⚡'
];
function showMotivation(){
  const el=document.getElementById('motivation');
  if(!el)return;
  el.textContent=MOTIV_MSGS[Math.floor(Math.random()*MOTIV_MSGS.length)];
  el.classList.remove('hidden');
}

// ══════════════════════════════════════
// STREAK
// ══════════════════════════════════════
function updateStreakClass(){
  const el=document.getElementById('gStreak');
  if(!el)return;
  el.className='g-streak';
  if(streak>=5)el.classList.add('super');
  else if(streak>=3)el.classList.add('hot');
}

// ══════════════════════════════════════
// END
// ══════════════════════════════════════
function showEnd(){
  stopTimer();document.getElementById('mainQ').style.display='none';document.getElementById('aiPanel').classList.add('hidden');
  document.getElementById('gStatsBar').style.display='none';
  document.getElementById('gHintBox').classList.add('hidden');
  document.getElementById('endScreen').style.display='block';document.getElementById('progFill').style.width='100%';
  if(endAnimObj)try{endAnimObj.destroy()}catch(e){}
  endAnimObj=loadLottie(document.getElementById('endAnim'),L.trophy,false);
  const pct=score/shuffledQs.length*100;const chapters=getSubjectChapters(curSubjectId)||[];const ch=chapters[curChIdx];
  const isHi=chapterIsHindi(ch);
  let ti,ms;
  if(pct===100){ti=isHi?'पूरे अंक! 🏆':'Perfect Score! 🏆';ms=isHi?'सब सही! ⭐':'All correct! ⭐';launchConfetti();}
  else if(pct>=70){ti=isHi?'बहुत बढ़िया! 🎉':'Great Job! 🎉';ms=isHi?score+'/'+shuffledQs.length+'! शानदार!':score+'/'+shuffledQs.length+'! Fantastic!';}
  else if(pct>=50){ti=isHi?'अच्छी कोशिश! 💪':'Good Try! 💪';ms=isHi?score+'/'+shuffledQs.length+'. एक बार फिर देखो!':score+'/'+shuffledQs.length+'. Review once more!';}
  else{ti=isHi?'कोशिश करते रहो! 😊':'Keep Trying! 😊';ms=isHi?score+'/'+shuffledQs.length+'. फिर से कोशिश करो!':score+'/'+shuffledQs.length+'. Try again!';}
  document.getElementById('endTitle').textContent=ti;document.getElementById('endTitle').style.color=ch?ch.color:'#2D2A4A';
  document.getElementById('endMsg').textContent=ms;
  let sh='<div class="summary-stats" style="margin:14px 0"><div class="summary-stat" style="background:#D5F5E3"><div class="num">'+score+'</div><div class="lbl">'+(isHi?'सही':'Correct')+'</div></div><div class="summary-stat" style="background:#FADBD8"><div class="num">'+(shuffledQs.length-score)+'</div><div class="lbl">'+(isHi?'गलत':'Wrong')+'</div></div><div class="summary-stat" style="background:#FFF3E0"><div class="num">🔥 '+bestStreak+'</div><div class="lbl">'+(isHi?'सबसे बड़ा स्ट्रीक':'Best Streak')+'</div></div></div>';
  if(wrongAnswers.length>0){sh+='<div class="wrong-list"><strong style="font-family:\'Baloo 2\',cursive;color:#E74C3C">📝 '+(isHi?'दोहराएँ:':'Review:')+'</strong>';wrongAnswers.forEach(w=>{sh+=`<div class="wrong-item">${(w.q||'').split('\n')[0]} → <strong>${w.correct}</strong></div>`;});sh+='</div>';}
  document.getElementById('endSummary').innerHTML=sh;
  recordScore(ch?ch.id:'unknown',score,shuffledQs.length,wrongAnswers);
  speakHI(ti+'. '+ms);
}

// ══════════════════════════════════════
// Q BOX
// ══════════════════════════════════════
function toggleQBox(){qboxOpen=!qboxOpen;document.getElementById('qboxBody').style.display=qboxOpen?'block':'none';document.getElementById('qboxIcon').classList.toggle('open',qboxOpen);}
function setQBoxLang(lang){
  theoryLang=lang;
  localStorage.setItem('lh_theoryLang',lang);
  document.getElementById('qboxLangEn').className='qbox-lang-btn'+(lang==='en'?' active':'');
  document.getElementById('qboxLangHi').className='qbox-lang-btn'+(lang==='hi'?' active':'');
  document.getElementById('qboxInput').placeholder=lang==='hi'?'अपना प्रश्न लिखें...':'Type your question...';
  const chat=document.getElementById('qboxChat');
  if(chat.children.length===1){
    chat.innerHTML=lang==='hi'?'<div class="bubble ai"><span>नमस्ते! 🌸 मैं आपकी टीचर हूँ। कोई भी सवाल पूछिए!</span><div class="bubble-speak" onclick="speakHI(this.parentElement.querySelector(\'span\').textContent)">🔊 Listen</div></div>':'<div class="bubble ai"><span>Hello! 🌸 I\'m your Teacher. Ask me any subject question!</span><div class="bubble-speak" onclick="speakHI(this.parentElement.querySelector(\'span\').textContent)">🔊 Listen</div></div>';
  }
}
async function sendQuestion(){
  const inp=document.getElementById('qboxInput');const q=inp.value.trim();if(!q)return;inp.value='';
  addBubble(q,'user');chatHistory.push({role:'user',content:q});trimChat(chatHistory,50);const loadId=addLoadingBubble();
  const sub=SUBJECTS.find(s=>s.id===curSubjectId);const name=localStorage.getItem('lh_name')||'श्रावणी';
  const chapters=getSubjectChapters(curSubjectId)||[];const ch=chapters[curChIdx];
  const subName=sub?getSubjectName(sub):'';const chName=ch?' — '+ch.name:'';
  var sys;
  if(theoryLang==='hi'){
    sys='तुम प्यारी Teacher हो। '+name+' '+subName+chName+' पढ़ रहा/रही है। सिर्फ हिंदी (देवनागरी लिपि) में जवाब दो। अंग्रेज़ी शब्दों की जगह हिंदी शब्द इस्तेमाल करो। 2-3 वाक्य। emoji।';
  }else{
    sys='You are a friendly Teacher. '+name+' is studying '+subName+chName+'. Answer in English. Use simple words for a young student. 2-3 sentences. Add an emoji.';
  }
  const prompt=chatHistory.map(m=>(m.role==='user'?name+': ':'Teacher: ')+m.content).join('\n')+'\nTeacher:';
  const reply=await callGemini(prompt,sys,1024);
  removeLoadingBubble(loadId);
  const answer=reply||(theoryLang==='hi'?"Sorry, samajh nahi aaya. Dobara pucho! 😊":"Sorry, I didn't understand. Ask again! 😊");
  addBubble(answer,'ai',true);chatHistory.push({role:'assistant',content:answer});trimChat(chatHistory,50);
  if(theoryLang==='hi')speakHI(answer);else speakEN(answer);
}
function addBubble(text,role,ws=false){const chat=document.getElementById('qboxChat');const d=document.createElement('div');d.className='bubble '+role;const s=document.createElement('span');s.textContent=text;d.appendChild(s);if(ws){const sp=document.createElement('div');sp.className='bubble-speak';sp.textContent='🔊 Listen';sp.onclick=()=>{if(theoryLang==='hi')speakHI(text);else speakEN(text);};d.appendChild(sp);}chat.appendChild(d);chat.scrollTop=chat.scrollHeight;return d;}
let lbId=0;function addLoadingBubble(){const id=++lbId;const chat=document.getElementById('qboxChat');const d=document.createElement('div');d.className='bubble loading';d.id='lb_'+id;d.innerHTML='<span class="loading-dots"><span></span><span></span><span></span></span>';chat.appendChild(d);chat.scrollTop=chat.scrollHeight;return id;}
function removeLoadingBubble(id){const el=document.getElementById('lb_'+id);if(el)el.remove();}

// ══════════════════════════════════════
// SETTINGS — Learning Preferences Center
// ══════════════════════════════════════
function closeSettings(){
  document.getElementById('settingsModal').classList.add('hidden');
  document.removeEventListener('keydown',settingsEscapeHandler);
}
let settingsEscapeHandler;
function showSettingsModal(){
  const modal=document.getElementById('settingsModal');
  modal.classList.remove('hidden');
  loadSettingsData();
  settingsEscapeHandler=function(e){if(e.key==='Escape')closeSettings();};
  document.addEventListener('keydown',settingsEscapeHandler);
  setTimeout(function(){const c=modal.querySelector('.modal-close');if(c)c.focus();},100);
}
function shareApp(){
  if(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.ApkShare){
    showToast({message:'Share sheet khol rahe hain...'});
    window.Capacitor.Plugins.ApkShare.share().then(function(){
      showToast({message:'Share successfull!'});
    }).catch(function(e){
      showToast({message:'Share failed: '+(e&&e.message?e.message:e)});
    });
  }else{
    showToast({message:'Share sirf Android app mein available hai'});
  }
}
function loadSettingsData(){
  const p=getProgress();
  const n=localStorage.getItem('lh_name')||'Student';
  const cl=localStorage.getItem('lh_classLevel')||'1';
  document.getElementById('settAccountName').textContent=n;
  document.getElementById('settAccountClass').textContent='Class '+cl;
  document.getElementById('settStatStreak').textContent=p.streak;
  document.getElementById('settStatXp').textContent=p.totalC;
  let totalCh=0;
  SUBJECTS.forEach(s=>{
    const d=getSubjectData(s.id);
    if(d&&d.scores)totalCh+=Object.keys(d.scores).length;
  });
  document.getElementById('settStatChapters').textContent=totalCh;
  applyAvatarToSettings();
  loadPrefs();
  loadVoices();
  calcStorage();
}
function applyAvatarToSettings(){
  const wrap=document.getElementById('settAvatar');
  const saved=localStorage.getItem('lh_avatar');
  if(saved){wrap.innerHTML='<img src="'+saved+'" alt="Avatar">';}
  else{wrap.textContent='🌸';}
}
function loadPrefs(){
  const lang=localStorage.getItem('lh_theoryLang')||'en';
  document.querySelectorAll('#settLangEn,#settLangHi').forEach(b=>b.classList.toggle('active',(b.id==='settLangEn'&&lang==='en')||(b.id==='settLangHi'&&lang==='hi')));
  const fs=parseInt(localStorage.getItem('lh_theoryFontSize'))||16;
  document.getElementById('settFontVal').textContent=fs;
  const prefs=['autoContinue','rememberLesson','aiLang','respLength','explMode','autoQuiz','autoExercises','autoMindmap','voiceSpeed','voicePitch','voiceVolume','largeFont','highContrast','reduceMotion','largeTargets','notifDaily','notifRevision','notifGoal','notifAchieve'];
  prefs.forEach(k=>{
    const v=localStorage.getItem('lh_pref_'+k);
    if(v===null)return;
    const el=document.getElementById('sett'+k.charAt(0).toUpperCase()+k.slice(1));
    if(!el)return;
    if(el.type==='checkbox')el.checked=v==='true';
    else if(el.tagName==='SELECT')el.value=v;
    else if(el.tagName==='INPUT'&&el.type==='range'){el.value=v;el.oninput();}
  });
  const aiLang=localStorage.getItem('lh_pref_aiLang')||lang;
  document.querySelectorAll('#settAiLangEn,#settAiLangHi').forEach(b=>b.classList.toggle('active',(b.id==='settAiLangEn'&&aiLang==='en')||(b.id==='settAiLangHi'&&aiLang==='hi')));
  const rl=localStorage.getItem('lh_pref_respLength')||'medium';
  document.querySelectorAll('#settRespShort,#settRespMedium,#settRespLong').forEach(b=>b.classList.toggle('active',(b.id==='settRespShort'&&rl==='short')||(b.id==='settRespMedium'&&rl==='medium')||(b.id==='settRespLong'&&rl==='long')));
  const em=localStorage.getItem('lh_pref_explMode')||'simple';
  document.querySelectorAll('#settExplSimple,#settExplDetailed').forEach(b=>b.classList.toggle('active',(b.id==='settExplSimple'&&em==='simple')||(b.id==='settExplDetailed'&&em==='detailed')));
  const vs=localStorage.getItem('lh_pref_voiceSpeed')||'1.0';
  document.getElementById('settVoiceSpeed').value=vs;
  document.getElementById('settVoiceSpeedVal').textContent=parseFloat(vs).toFixed(1)+'x';
  const vp=localStorage.getItem('lh_pref_voicePitch')||'1.0';
  document.getElementById('settVoicePitch').value=vp;
  document.getElementById('settVoicePitchVal').textContent=parseFloat(vp).toFixed(1);
  const vv=localStorage.getItem('lh_pref_voiceVolume')||'1.0';
  document.getElementById('settVoiceVolume').value=vv;
  document.getElementById('settVoiceVolumeVal').textContent=Math.round(parseFloat(vv)*100)+'%';
}
function loadVoices(){
  const sel=document.getElementById('settVoiceSelect');
  if(!sel)return;
  sel.innerHTML='';
  const addVoice=function(v){
    const o=document.createElement('option');
    o.value=v.voiceURI;
    o.textContent=v.name+' ('+v.lang+')';
    sel.appendChild(o);
  };
  if(window.speechSynthesis){
    const voices=window.speechSynthesis.getVoices();
    voices.forEach(addVoice);
    if(voices.length===0){
      window.speechSynthesis.onvoiceschanged=function(){
        const v=window.speechSynthesis.getVoices();
        sel.innerHTML='';
        v.forEach(addVoice);
      };
    }
  }
  const saved=localStorage.getItem('lh_pref_voice');
  if(saved)sel.value=saved;
}
function calcStorage(){
  let total=0,count=0,books=0;
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i);
    const v=localStorage.getItem(k);
    total+=v?v.length*2:0;
    count++;
    if(k.startsWith('lh_sub_'))books++;
  }
  document.getElementById('settStorageCount').textContent=count;
  const units=['B','KB','MB','GB'];
  let size=total,ui=0;
  while(size>=1024&&ui<units.length-1){size/=1024;ui++;}
  document.getElementById('settStorageUsed').textContent=size.toFixed(1)+' '+units[ui];
  document.getElementById('settOfflineBooks').textContent=books;
}
function settToggle(el){
  const body=el.nextElementSibling;
  const chev=el.querySelector('.sett-card-chev');
  if(!body||!body.classList.contains('sett-card-body'))return;
  const isOpen=body.classList.contains('open');
  body.classList.toggle('open');
  if(chev)chev.classList.toggle('open');
}
function setPrefLang(lang){
  localStorage.setItem('lh_theoryLang',lang);
  theoryLang=lang;
  document.querySelectorAll('#settLangEn,#settLangHi').forEach(b=>b.classList.toggle('active',(b.id==='settLangEn'&&lang==='en')||(b.id==='settLangHi'&&lang==='hi')));
  showToast({message:'Language set to '+(lang==='en'?'English':'हिंदी')});
}
function setPref(key,val){
  const k='lh_pref_'+key;
  if(typeof val==='boolean')localStorage.setItem(k,val?'true':'false');
  else localStorage.setItem(k,String(val));
  const el=document.getElementById('sett'+key.charAt(0).toUpperCase()+key.slice(1));
  if(el&&el.type==='range'){
    const lbl=document.getElementById('sett'+key.charAt(0).toUpperCase()+key.slice(1)+'Val');
    if(lbl){
      const v=parseFloat(val);
      if(key==='voiceSpeed')lbl.textContent=v.toFixed(1)+'x';
      else if(key==='voicePitch')lbl.textContent=v.toFixed(1);
      else if(key==='voiceVolume')lbl.textContent=Math.round(v*100)+'%';
    }
  }
  if(key==='largeFont'&&val==='true'){for(let i=0;i<5;i++)incTheoryFont();showToast({message:'Large font enabled'});}
  if(key==='largeFont'&&val==='false'){const cur=parseInt(localStorage.getItem('lh_theoryFontSize'))||16;while(cur>16)decTheoryFont();showToast({message:'Default font restored'});}
}
function setPrefVoice(val){
  localStorage.setItem('lh_pref_voice',val);
}
function editAccountName(){
  const cur=localStorage.getItem('lh_name')||'Student';
  const name=prompt('Enter your name:',cur);
  if(name&&name.trim()){
    localStorage.setItem('lh_name',name.trim());
    document.getElementById('settAccountName').textContent=name.trim();
    const g=document.getElementById('subGreeting');
    if(g)g.textContent=name.trim()+'!';
    showToast({message:'Name updated!'});
  }
}
function testVoice(){
  const speed=parseFloat(document.getElementById('settVoiceSpeed').value)||1.0;
  const pitch=parseFloat(document.getElementById('settVoicePitch').value)||1.0;
  const volume=parseFloat(document.getElementById('settVoiceVolume').value)||1.0;
  const voiceURI=document.getElementById('settVoiceSelect').value;
  const text='Hello! I am your AI learning assistant. Let us learn something amazing today!';
  if(window.speechSynthesis){
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.rate=speed;u.pitch=pitch;u.volume=volume;
    if(voiceURI){
      const v=window.speechSynthesis.getVoices().find(v=>v.voiceURI===voiceURI);
      if(v)u.voice=v;
    }
    showStopBtn();u.onend=()=>hideStopBtn();u.onerror=()=>hideStopBtn();
    window.speechSynthesis.speak(u);
  }
}
function clearAppCache(){
  const keysToDelete=[];
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i);
    if(!k.startsWith('sl_')&&!k.startsWith('lh_')&&k!=='gemini_key')continue;
    if(k.startsWith('sl_users')||k.startsWith('sl_current_user')||k==='gemini_key'||k==='admin_gemini_key')continue;
    keysToDelete.push(k);
  }
  if(keysToDelete.length===0){showToast({message:'No cache to clear'});return;}
  if(!confirm('Clear '+keysToDelete.length+' cached items?'))return;
  keysToDelete.forEach(k=>localStorage.removeItem(k));
  showToast({message:'Cache cleared! Refreshing...'});
  setTimeout(()=>location.reload(),1000);
}
function showAdminPanel(){
  document.getElementById('adminModal').classList.remove('hidden');
  const container=document.getElementById('usageStatsContainer');
  if(container)container.innerHTML=showUsageStats();
  const sUrl=document.getElementById('serverUrlInput');
  if(sUrl)sUrl.value=SL_SERVER;
  prefillAdminKeys();
}

// ══════════════════════════════════════
// CONFETTI
// ══════════════════════════════════════
function launchConfetti(){
  const c=document.getElementById('confettiCanvas');const ctx=c.getContext('2d');
  c.width=window.innerWidth;c.height=window.innerHeight;
  const colors=['#FF6B9D','#FFD93D','#6BCB77','#48CAE4','#C77DFF','#FF9F43'];
  const ps=Array.from({length:70},()=>({x:Math.random()*c.width,y:Math.random()*c.height-c.height,r:Math.random()*7+4,color:colors[Math.floor(Math.random()*colors.length)],tilt:Math.random()*10-10,ta:0,ts:Math.random()*.1+.05,s:Math.random()*2+1}));
  let f=0;function draw(){ctx.clearRect(0,0,c.width,c.height);ps.forEach(p=>{ctx.beginPath();ctx.lineWidth=p.r/2;ctx.strokeStyle=p.color;ctx.moveTo(p.x+p.tilt+p.r/4,p.y);ctx.lineTo(p.x+p.tilt,p.y+p.tilt+p.r/4);ctx.stroke();p.ta+=p.ts;p.y+=p.s*1.8;p.tilt=Math.sin(p.ta)*15;if(p.y>c.height){p.x=Math.random()*c.width;p.y=-20;}});f++;if(f<100)requestAnimationFrame(draw);else ctx.clearRect(0,0,c.width,c.height);}draw();
}

// Triple-tap on subject header title to open settings
(function(){
  var _tapCount=0,_tapTimer=null;
  var titleEl=document.querySelector('#subjectScreen .sub-header-title');
  if(titleEl){
    titleEl.style.cursor='pointer';
    titleEl.addEventListener('click',function(){
      _tapCount++;
      clearTimeout(_tapTimer);
      _tapTimer=setTimeout(function(){_tapCount=0;},1500);
      if(_tapCount>=3){_tapCount=0;document.getElementById('adminModal').classList.remove('hidden');document.getElementById('usageStatsContainer').innerHTML=showUsageStats();var sUrl=document.getElementById('serverUrlInput');if(sUrl)sUrl.value=SL_SERVER;}
    });
  }
})();

// ══════════════════════════════════════
// HOME SCREEN DYNAMIC SECTIONS
// ══════════════════════════════════════

function buildHomeScreen(){
  buildSubjectGrid(4);
  updateGlobalStats();
  updateContinueLearning();
  updateDailyGoal();
  updateAchievements();
  var seeBtn=document.querySelector('.see-all-btn');
  if(seeBtn)seeBtn.style.display='';
  var navs=document.querySelectorAll('.nav-item');
  navs.forEach(function(b,i){b.classList.toggle('active',i===0);});
  var aiOverlay=document.getElementById('aiOverlay');
  if(aiOverlay)aiOverlay.classList.add('hidden');
}

function showAllSubjects(){
  buildSubjectGrid();
  var seeBtn=document.querySelector('.see-all-btn');
  if(seeBtn)seeBtn.style.display='none';
  var subSec=document.querySelector('.subjects-section');
  if(subSec)subSec.scrollIntoView({behavior:'smooth'});
}

// ── CONTINUE LEARNING ──
function getLastPlayedChapter(){
  var best=null,bestDate='';
  SUBJECTS.forEach(function(sub){
    var data=getSubjectData(sub.id);
    if(!data||!data.scores)return;
    var chapters=data.chapters||[];
    Object.keys(data.scores).forEach(function(chId){
      var sc=data.scores[chId];
      if(sc.date>bestDate){
        bestDate=sc.date;
        var ch=chapters.find(function(c){return c.id===chId;});
        if(ch)best={subject:sub,chapter:ch,score:sc};
        else if(chapters.length>0){
          var idx=parseInt(chId.replace('auto_',''))||-1;
          var found=chapters.find(function(c){return c.id===chId||c.id===chId;});
          if(found)best={subject:sub,chapter:found,score:sc};
        }
      }
    });
  });
  return best;
}

function updateContinueLearning(){
  var card=document.getElementById('continueCard');
  var subEl=document.getElementById('continueSubject');
  var chEl=document.getElementById('continueChapter');
  var timeEl=document.getElementById('continueTime');
  var pctEl=document.getElementById('continuePctText');
  var ringEl=document.getElementById('continueRingFill');
  var btn=document.getElementById('continueBtn');
  var last=getLastPlayedChapter();
  if(last){
    var pct=last.score&&last.score.total?Math.round(last.score.score/last.score.total*100):0;
    subEl.textContent=(last.subject.emoji||'')+' '+getSubjectName(last.subject);
    chEl.textContent=last.chapter.label||last.chapter.name||'Chapter';
    timeEl.textContent='~'+(last.chapter.learn?Math.max(3,Math.round((last.chapter.learn.length)*0.8)):5)+' min left';
    pctEl.textContent=pct+'%';
    var circ=314.16;
    ringEl.style.strokeDashoffset=circ-(circ*pct/100);
    btn.textContent='Continue ➜';
    card.classList.remove('empty');
  }else{
    subEl.textContent='✨ Start Learning!';
    chEl.textContent='Pick a subject to begin';
    timeEl.textContent='~5 min';
    pctEl.textContent='0%';
    ringEl.style.strokeDashoffset=314.16;
    btn.textContent='Get Started ➜';
    card.classList.add('empty');
  }
}

function continueLastChapter(){
  var last=getLastPlayedChapter();
  if(last){
    var subId=last.subject.id;
    var chIdx=-1;
    var chapters=getSubjectChapters(subId);
    chapters.forEach(function(c,i){
      if(c.id===last.chapter.id)chIdx=i;
    });
    if(chIdx>=0){
      curSubjectId=subId;
      document.getElementById('dashSubjIcon').textContent=last.subject.emoji;
      document.getElementById('dashSubjectTitle').textContent=getSubjectName(last.subject);
      currentDashFilter='all';dashSearchQuery='';
      document.getElementById('dashSearchInput').value='';
      buildSubjectDash();
      document.getElementById('subjectScreen').classList.add('hidden');
      document.getElementById('dashboard').classList.remove('hidden');
      document.getElementById('gameScreen').classList.add('hidden');
      setTimeout(function(){startChapter(chIdx);},300);
    }else{
      openSubject(subId);
    }
  }else{
    var subSec=document.querySelector('.subjects-section');
    if(subSec)subSec.scrollIntoView({behavior:'smooth'});
  }
}

// ── DAILY GOAL ──
function getDailyGoalProgress(){
  var today=new Date().toDateString();
  var count=0;
  SUBJECTS.forEach(function(sub){
    var data=getSubjectData(sub.id);
    if(!data||!data.scores)return;
    Object.values(data.scores).forEach(function(s){
      if(s.date===today)count++;
    });
  });
  return{completed:Math.min(count,3),total:3,pct:Math.min(Math.round(count/3*100),100)};
}

function updateDailyGoal(){
  var goal=getDailyGoalProgress();
  var textEl=document.getElementById('goalText');
  var fillEl=document.getElementById('goalFill');
  var msgEl=document.getElementById('goalMsg');
  var rewardEl=document.getElementById('goalReward');
  textEl.textContent=goal.completed+' / '+goal.total+' Chapters';
  fillEl.style.width=goal.pct+'%';
  var msgs=['Let\'s start learning! 🚀','Great start! Keep going! 💪','Almost there! You rock! 🌟','Perfect! You crushed it! 🎉'];
  msgEl.textContent=msgs[Math.min(goal.completed,msgs.length-1)];
  if(rewardEl){
    if(goal.completed>=goal.total){
      rewardEl.classList.remove('hidden');
      rewardEl.textContent='🎁 Reward: ⭐ 50 Bonus XP!';
    }else{
      rewardEl.classList.add('hidden');
    }
  }
}

// ── ACHIEVEMENTS ──
function getAchievements(){
  var p=getProgress();
  var totalC=parseInt(localStorage.getItem('lh_totalC')||'0');
  var subCount=SUBJECTS.filter(function(s){var d=getSubjectData(s.id);return d&&d.totalC>0;}).length;
  var masteryCount=SUBJECTS.filter(function(s){var d=getSubjectData(s.id);if(!d||!d.scores)return false;var vals=Object.values(d.scores);return vals.length>0&&vals.every(function(v){return v.total>0&&v.score/v.total>=0.8;});}).length;
  return[
    {id:'first',icon:'🌟',label:'First Steps',unlocked:totalC>0,desc:'Answer 1st question'},
    {id:'streak3',icon:'🔥',label:'3-Day Streak',unlocked:p.streak>=3,desc:'3 days in a row'},
    {id:'streak7',icon:'🔥',label:'7-Day Streak',unlocked:p.streak>=7,desc:'7 days in a row'},
    {id:'star50',icon:'⭐',label:'Star Learner',unlocked:totalC>=50,desc:'50 correct answers'},
    {id:'superstar',icon:'🏆',label:'Super Star',unlocked:totalC>=200,desc:'200 correct answers'},
    {id:'scholar',icon:'📚',label:'Scholar',unlocked:totalC>=500,desc:'500 correct answers'},
    {id:'explorer',icon:'🧭',label:'Explorer',unlocked:subCount>=3,desc:'Study 3+ subjects'},
    {id:'master',icon:'👑',label:'Subject Master',unlocked:masteryCount>=1,desc:'Master any subject'},
    {id:'perfection',icon:'💎',label:'Perfectionist',unlocked:totalC>=1000,desc:'Get 1000 correct'},
    {id:'collector',icon:'🎯',label:'Collector',unlocked:subCount>=5,desc:'Study all subjects'},
  ];
}

function updateAchievements(){
  var scroll=document.getElementById('achievementsScroll');
  if(!scroll)return;
  var badges=getAchievements();
  scroll.innerHTML='';
  badges.forEach(function(b){
    var div=document.createElement('div');
    div.className='achievement-badge'+(b.unlocked?' unlocked':' locked');
    div.innerHTML='<span class="achievement-icon">'+b.icon+'</span><div class="achievement-label">'+b.label+'</div><div class="achievement-desc">'+(b.unlocked?'✅ '+b.desc:'🔒 '+b.desc)+'</div>';
    scroll.appendChild(div);
  });
}

// ── AI OVERLAY ──
var _homeChatHistory=[];

function toggleAIOverlay(){
  var overlay=document.getElementById('aiOverlay');
  if(!overlay)return;
  var isHidden=overlay.classList.contains('hidden');
  overlay.classList.toggle('hidden');
  if(!isHidden)return;
  var inp=document.getElementById('aiOverlayInput');
  if(inp)setTimeout(function(){inp.focus();},300);
}

function sendHomeQuestion(){
  var inp=document.getElementById('aiOverlayInput');
  var q=inp?inp.value.trim():'';
  if(!q)return;
  inp.value='';
  var chat=document.getElementById('aiOverlayChat');
  var userBubble=document.createElement('div');
  userBubble.className='bubble user';
  var userSpan=document.createElement('span');userSpan.textContent=q;
  userBubble.appendChild(userSpan);
  chat.appendChild(userBubble);
  chat.scrollTop=chat.scrollHeight;
  _homeChatHistory.push({role:'user',content:q});trimChat(_homeChatHistory,50);
  var loadBubble=document.createElement('div');
  loadBubble.className='bubble loading';
  loadBubble.innerHTML='<span class="loading-dots"><span></span><span></span><span></span></span>';
  loadBubble.id='_homeLoad';
  chat.appendChild(loadBubble);
  var sys='You are a friendly Teacher. Answer simply for a young student (age 5-12). 2-3 sentences. Add an emoji.';
  var prompt=_homeChatHistory.map(function(m){return(m.role==='user'?'Student: ':'Teacher: ')+m.content;}).join('\n')+'\nTeacher:';
  callGemini(prompt,sys,1024).then(function(reply){
    var loadEl=document.getElementById('_homeLoad');
    if(loadEl)loadEl.remove();
    var answer=reply||'Sorry, I didn\'t understand. Ask again! 😊';
    var bubble=document.createElement('div');
    bubble.className='bubble ai';
    var textSpan=document.createElement('span');textSpan.textContent=answer;
    bubble.appendChild(textSpan);
    var speakBtn=document.createElement('div');speakBtn.className='bubble-speak';speakBtn.textContent='🔊 Listen';
    speakBtn.onclick=function(){speakHI(answer);};
    bubble.appendChild(speakBtn);
    chat.appendChild(bubble);
    chat.scrollTop=chat.scrollHeight;
    _homeChatHistory.push({role:'assistant',content:answer});trimChat(_homeChatHistory,50);
    speakHI(answer);
  });
}

// ── BOTTOM NAV ──
function debounce(fn,ms){var t;return function(){clearTimeout(t);t=setTimeout(fn,ms);};}
function trimChat(arr,max){while(arr.length>max)arr.shift();}
function navigateHome(view){
  stopTimer();
  var navs=document.querySelectorAll('.bottom-nav .nav-item');
  navs.forEach(function(b,i){
    b.classList.toggle('active',(view==='home'&&i===0)||(view==='subjects'&&i===1)||(view==='games'&&i===3));
  });
  if(view==='home'){
    buildHomeScreen();
    window.scrollTo({top:0,behavior:'smooth'});
  }else if(view==='subjects'){
    showAllSubjects();
  }else if(view==='games'){
    var subSec=document.querySelector('.achievements-section');
    if(subSec)subSec.scrollIntoView({behavior:'smooth'});
  }
}

// ══════════════════════════════════════
// BACK BUTTON — go to previous screen instead of exiting
// ══════════════════════════════════════
function handleBackButton(){
  var el;
  el=document.getElementById('adminModal');
  if(el&&!el.classList.contains('hidden')){el.classList.add('hidden');return true;}
  el=document.getElementById('settingsModal');
  if(el&&!el.classList.contains('hidden')){closeSettings();return true;}
  el=document.getElementById('aiOverlay');
  if(el&&!el.classList.contains('hidden')){toggleAIOverlay();return true;}
  if(qboxOpen){toggleQBox();return true;}
  el=document.getElementById('gamePlay');
  if(el&&!el.classList.contains('hidden')){showGameModes();return true;}
  el=document.getElementById('gameResult');
  if(el&&!el.classList.contains('hidden')){showGameModes();return true;}
  el=document.getElementById('gameScreen');
  if(el&&!el.classList.contains('hidden')){goToSubjectDash();return true;}
  el=document.getElementById('dashboard');
  if(el&&!el.classList.contains('hidden')){goToSubjects();return true;}
  return false;
}

(function setupBackButton(){
  try{
    if(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.App){
      window.Capacitor.Plugins.App.addListener('backButton',function(){
        if(!handleBackButton()&&window.Capacitor.Plugins.App.exitApp)window.Capacitor.Plugins.App.exitApp();
      });
    }
  }catch(e){}
})();

