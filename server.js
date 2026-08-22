var http=require('http');
var fs=require('fs');
var path=require('path');
var url=require('url');

var PORT=process.env.PORT||3847;
var DATA_DIR=path.join(__dirname,'admin-data');
if(!fs.existsSync(DATA_DIR))fs.mkdirSync(DATA_DIR,{recursive:true});

var USAGE_FILE=path.join(DATA_DIR,'usage.json');
var CONFIG_FILE=path.join(DATA_DIR,'config.json');
var CONTENT_FILE=path.join(DATA_DIR,'content.json');
var DEVICES_FILE=path.join(DATA_DIR,'devices.json');
var VISITORS_FILE=path.join(DATA_DIR,'visitors.json');
var SYNC_FILE=path.join(DATA_DIR,'sync.json');

function loadJSON(f,def){try{return JSON.parse(fs.readFileSync(f,'utf8'));}catch(e){return def;}}
function saveJSON(f,d){fs.writeFileSync(f,JSON.stringify(d,null,2));}

var allUsage=loadJSON(USAGE_FILE,[]);
var appConfig=loadJSON(CONFIG_FILE,{
  locked:false,lockMsg:'',broadcast:'',apiKey:'',
  openrouterKey:'',nvidiaKey:'',
  subjects:null
});
// Render dashboard Environment Variables se keys load karo (agar config file
// mein na hon). Isse restart par bhi keys bachti hain (Render ka filesystem ephemeral hai).
if(!appConfig.apiKey&&process.env.GEMINI_KEY)appConfig.apiKey=process.env.GEMINI_KEY;
if(!appConfig.openrouterKey&&process.env.OPENROUTER_KEY)appConfig.openrouterKey=process.env.OPENROUTER_KEY;
if(!appConfig.nvidiaKey&&process.env.NVIDIA_KEY)appConfig.nvidiaKey=process.env.NVIDIA_KEY;
var contentUpdates=loadJSON(CONTENT_FILE,[]);
var devices=loadJSON(DEVICES_FILE,{});
var visitors=loadJSON(VISITORS_FILE,{total:0,unique:{},history:[]});
var syncData=loadJSON(SYNC_FILE,{});

function saveUsage(){saveJSON(USAGE_FILE,allUsage);}
function saveConfig(){saveJSON(CONFIG_FILE,appConfig);}
function saveContent(){saveJSON(CONTENT_FILE,contentUpdates);}
function saveDevices(){saveJSON(DEVICES_FILE,devices);}
function saveVisitors(){saveJSON(VISITORS_FILE,visitors);}
function saveSync(){saveJSON(SYNC_FILE,syncData);}

function trackVisitor(req){
  var ip=req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown';
  var ua=req.headers['user-agent']||'';
  var now=new Date().toISOString();
  visitors.total++;
  if(!visitors.unique[ip])visitors.unique[ip]={first:now,count:0,ua:ua};
  visitors.unique[ip].last=now;
  visitors.unique[ip].count++;
  visitors.unique[ip].ua=ua;
  visitors.history.unshift({ip:ip,time:now,ua:ua.slice(0,120)});
  if(visitors.history.length>500)visitors.history=visitors.history.slice(0,500);
  saveVisitors();
}

var server=http.createServer(function(req,res){
  var parsed=url.parse(req.url,true);
  var pathname=parsed.pathname;

  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS'){res.writeHead(200);res.end();return;}

  // ─── PUBLIC API (phone calls these) ───

  // Phone reports usage
  if(req.method==='POST'&&pathname==='/api/usage'){
    return readBody(req,function(body){
      try{
        var report=JSON.parse(body);
        report.receivedAt=new Date().toISOString();
        report.ip=req.headers['x-forwarded-for']||req.socket.remoteAddress;
        allUsage.push(report);

        var deviceId=report.deviceId||report.device||'unknown';
        devices[deviceId]={
          lastSeen:new Date().toISOString(),
          userAgent:report.device,
          users:(report.users||[]).map(function(u){return u.name;})
        };

        saveUsage();saveDevices();
        console.log('[USAGE] '+report.ip+' | users: '+(report.users||[]).map(function(u){return u.name;}).join(', '));
        jsonResponse(res,200,{ok:true,count:allUsage.length});
      }catch(e){jsonResponse(res,400,{error:'Bad JSON'});}
    });
  }

  // Phone checks config (lock, broadcast, apiKey)
  if(req.method==='GET'&&pathname==='/api/config'){
    var deviceId=parsed.query.deviceId||'';
    var lastSync=parsed.query.lastSync||'0';
    var pendingContent=contentUpdates.filter(function(c){
      return new Date(c.createdAt).getTime()>parseInt(lastSync);
    });
    jsonResponse(res,200,{
      locked:appConfig.locked,
      lockMsg:appConfig.lockMsg,
      broadcast:appConfig.broadcast,
      apiKey:appConfig.apiKey||'',
      openrouterKey:appConfig.openrouterKey||'',
      nvidiaKey:appConfig.nvidiaKey||'',
      subjects:appConfig.subjects||null,
      contentUpdates:pendingContent
    });
    if(deviceId){
      devices[deviceId]=devices[deviceId]||{};
      devices[deviceId].lastConfigSync=new Date().toISOString();
      saveDevices();
    }
    return;
  }

  // Phone pulls full content
  if(req.method==='GET'&&pathname==='/api/content'){
    jsonResponse(res,200,{contentUpdates:contentUpdates});
    return;
  }

  // ─── WIFI SYNC (laptop ↔ phone data) ───
  if(req.method==='GET'&&pathname==='/api/data'){
    jsonResponse(res,200,syncData);
    return;
  }
  if(req.method==='POST'&&pathname==='/api/data'){
    return readBody(req,function(body){
      try{
        var incoming=JSON.parse(body);
        Object.keys(incoming).forEach(function(k){syncData[k]=incoming[k];});
        saveSync();
        jsonResponse(res,200,{ok:true,count:Object.keys(syncData).length});
      }catch(e){jsonResponse(res,400,{error:'Bad JSON'});}
    });
  }

  // ─── ADMIN API (dashboard calls these) ───

  // Get all usage data
  if(req.method==='GET'&&pathname==='/api/admin/usage'){
    jsonResponse(res,200,{usage:allUsage,devices:devices});
    return;
  }

  // Get/update config
  if(req.method==='GET'&&pathname==='/api/admin/config'){
    jsonResponse(res,200,appConfig);
    return;
  }
  if(req.method==='POST'&&pathname==='/api/admin/config'){
    return readBody(req,function(body){
      try{
        var newCfg=JSON.parse(body);
        if(newCfg.locked!==undefined)appConfig.locked=newCfg.locked;
        if(newCfg.lockMsg!==undefined)appConfig.lockMsg=newCfg.lockMsg;
        if(newCfg.broadcast!==undefined)appConfig.broadcast=newCfg.broadcast;
        if(newCfg.apiKey!==undefined)appConfig.apiKey=newCfg.apiKey;
        if(newCfg.openrouterKey!==undefined)appConfig.openrouterKey=newCfg.openrouterKey;
        if(newCfg.nvidiaKey!==undefined)appConfig.nvidiaKey=newCfg.nvidiaKey;
        if(newCfg.subjects!==undefined)appConfig.subjects=newCfg.subjects;
        saveConfig();
        console.log('[CONFIG] Updated:',Object.keys(newCfg).join(', '));
        jsonResponse(res,200,{ok:true,config:appConfig});
      }catch(e){jsonResponse(res,400,{error:'Bad JSON'});}
    });
  }

  // Push content update
  if(req.method==='POST'&&pathname==='/api/admin/content'){
    return readBody(req,function(body){
      try{
        var update=JSON.parse(body);
        update.id='upd_'+Date.now();
        update.createdAt=new Date().toISOString();
        contentUpdates.push(update);
        saveContent();
        console.log('[CONTENT] Pushed: '+update.type+' | '+update.label);
        jsonResponse(res,200,{ok:true,update:update});
      }catch(e){jsonResponse(res,400,{error:'Bad JSON'});}
    });
  }

  // Clear content updates
  if(req.method==='DELETE'&&pathname==='/api/admin/content'){
    contentUpdates=[];
    saveContent();
    jsonResponse(res,200,{ok:true});
    return;
  }

  // Reset usage
  if(req.method==='DELETE'&&pathname==='/api/admin/usage'){
    allUsage=[];
    saveUsage();
    jsonResponse(res,200,{ok:true});
    return;
  }

  // ─── STATUS (phone checks connection) ───
  if(req.method==='GET'&&pathname==='/api/status'){
    jsonResponse(res,200,{ok:true,url:'http://'+req.headers.host});
    return;
  }

  // ─── VISITOR TRACKING ───

  // Get visitor stats
  if(req.method==='GET'&&pathname==='/api/admin/visitors'){
    jsonResponse(res,200,{
      total:visitors.total,
      uniqueCount:Object.keys(visitors.unique).length,
      unique:visitors.unique,
      history:visitors.history.slice(0,200)
    });
    return;
  }

  // Reset visitors
  if(req.method==='DELETE'&&pathname==='/api/admin/visitors'){
    visitors={total:0,unique:{},history:[]};
    saveVisitors();
    jsonResponse(res,200,{ok:true});
    return;
  }

  // ─── GEMINI PROXY (phone asks server to call Gemini, API key stays server-side) ───
  if(req.method==='POST'&&pathname==='/api/gemini'){
    return readBody(req,function(body){
      try{
        const geminiReq=JSON.parse(body);
        const key=appConfig.apiKey;
        if(!key){jsonResponse(res,403,{error:'No API key configured on server. Add one in dashboard.'});return;}
        const url='https://generativelanguage.googleapis.com/v1beta/models/'+(geminiReq.model||'gemini-3-flash-preview')+':generateContent?key='+encodeURIComponent(key);
        const https=require('https');const u=new URL(url);
        const opts={
          hostname:u.hostname,path:u.pathname+u.search,method:'POST',
          headers:{'Content-Type':'application/json'}
        };
        if(geminiReq.body)opts.headers['Content-Length']=Buffer.byteLength(geminiReq.body,'utf8');
        const proxyReq=https.request(opts,function(proxyRes){
          let data='';
          proxyRes.on('data',function(c){data+=c;});
          proxyRes.on('end',function(){
            res.writeHead(proxyRes.statusCode,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});
            res.end(data);
          });
        });
        proxyReq.on('error',function(e){jsonResponse(res,500,{error:e.message});});
        if(geminiReq.body)proxyReq.write(geminiReq.body);
        proxyReq.end();
      }catch(e){jsonResponse(res,400,{error:'Bad request'});}
    });
  }

  // ─── NVIDIA PROXY (phone asks server to call NVIDIA, API key stays server-side) ───
  // NVIDIA API browser me CORS allow nahi karta, isliye server se proxy karte hain.
  if(req.method==='POST'&&pathname==='/api/nvidia'){
    return readBody(req,function(body){
      try{
        const nvReq=JSON.parse(body);
        const key=appConfig.nvidiaKey;
        if(!key){jsonResponse(res,403,{error:'No NVIDIA key configured on server. Add one in dashboard.'});return;}
        const url='https://integrate.api.nvidia.com/v1/chat/completions';
        const https=require('https');const u=new URL(url);
        const opts={
          hostname:u.hostname,path:u.pathname+u.search,method:'POST',
          headers:{'Content-Type':'application/json','Authorization':'Bearer '+key}
        };
        if(nvReq.body)opts.headers['Content-Length']=Buffer.byteLength(nvReq.body,'utf8');
        const proxyReq=https.request(opts,function(proxyRes){
          let data='';
          proxyRes.on('data',function(c){data+=c;});
          proxyRes.on('end',function(){
            res.writeHead(proxyRes.statusCode,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});
            res.end(data);
          });
        });
        proxyReq.on('socket',function(s){
          // upstream hang guard — client 90s pe chhod deta hai, hum 85s
          // pe kaat dete hain warna Render me hung requests jama hote hain
          s.setTimeout(85000,function(){proxyReq.destroy(new Error('upstream timeout'));});
        });
        proxyReq.on('error',function(e){
          if(!res.headersSent)jsonResponse(res,504,{error:e.message});
        });
        if(nvReq.body)proxyReq.write(nvReq.body);
        proxyReq.end();
      }catch(e){jsonResponse(res,400,{error:'Bad request'});}
    });
  }

  // ─── DASHBOARD (tracks visitors automatically) ───
  if(req.method==='GET'&&(pathname==='/'||pathname==='/dashboard')){
    trackVisitor(req);
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.end(getDashboardHTML());
    return;
  }

  // ─── SERVE APK DOWNLOADS (apk/) ───
  if(req.method==='GET'&&pathname.startsWith('/apk')){
    var apkName=pathname.replace('/apk','').replace(/^\//,'');
    serveApk(res,apkName);
    return;
  }

  // ─── SERVE APP STATIC FILES (www/) ───
  if(req.method==='GET'&&pathname.startsWith('/app')){
    var filePath=pathname==='/app'||pathname==='/app/'?'/index.html':pathname.replace('/app','');
    var fullPath=path.join(__dirname,'www',filePath);
    var ext=path.extname(fullPath);
    var mimeTypes={'':'.html','.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.woff2':'font/woff2','.apk':'application/vnd.android.package-archive'};
    try{
      var content=fs.readFileSync(fullPath);
      res.writeHead(200,{'Content-Type':mimeTypes[ext]||'text/plain','Access-Control-Allow-Origin':'*'});
      res.end(content);
    }catch(e){
      serveApk(res,path.basename(fullPath));
    }
    return;
  }

  jsonResponse(res,404,{error:'Not found'});
});

function serveApk(res,name){
  if(!name||path.extname(name)!=='.apk'){jsonResponse(res,404,{error:'Not found'});return;}
  var candidates=[name,name.replace(/Ai-Teacher-/,'Ai-Teacher-v')];
  for(var i=0;i<candidates.length;i++){
    var apkPath=path.join(__dirname,'apk',candidates[i]);
    try{
      var apkContent=fs.readFileSync(apkPath);
      res.writeHead(200,{'Content-Type':'application/vnd.android.package-archive','Access-Control-Allow-Origin':'*'});
      res.end(apkContent);
      return;
    }catch(e){}
  }
  jsonResponse(res,404,{error:'APK not found'});
}

function readBody(req,cb){
  var body='';
  req.on('data',function(c){body+=c;});
  req.on('end',function(){cb(body);});
}

function jsonResponse(res,code,data){
  res.writeHead(code,{'Content-Type':'application/json'});
  res.end(JSON.stringify(data));
}

function getDashboardHTML(){
  return fs.readFileSync(path.join(__dirname,'dashboard.html'),'utf8');
}

// ─── AUTO CLEANUP: remove data older than 90 days ───
setInterval(function(){
  var cutoff=Date.now()-90*24*60*60*1000;
  var before=allUsage.length;
  allUsage=allUsage.filter(function(r){
    return new Date(r.receivedAt).getTime()>cutoff;
  });
  if(allUsage.length!==before){saveUsage();console.log('[CLEANUP] Removed '+(before-allUsage.length)+' old records');}

  var vBefore=visitors.history.length;
  visitors.history=visitors.history.filter(function(v){
    return new Date(v.time).getTime()>cutoff;
  });
  if(visitors.history.length!==vBefore)saveVisitors();
},6*60*60*1000);

server.listen(PORT,'0.0.0.0',function(){
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   Ai Teacher - Admin Server v2.0         ║');
  console.log('  ╠══════════════════════════════════════════╣');
  console.log('  ║  Dashboard: http://localhost:'+PORT+'         ║');
  console.log('  ║  Public:    Use localtunnel/ngrok        ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
  console.log('  Waiting for phone connections...');
  console.log('');
});
