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

function loadJSON(f,def){try{return JSON.parse(fs.readFileSync(f,'utf8'));}catch(e){return def;}}
function saveJSON(f,d){fs.writeFileSync(f,JSON.stringify(d,null,2));}

var allUsage=loadJSON(USAGE_FILE,[]);
var appConfig=loadJSON(CONFIG_FILE,{
  locked:false,lockMsg:'',broadcast:'',apiKey:'',
  subjects:null
});
var contentUpdates=loadJSON(CONTENT_FILE,[]);
var devices=loadJSON(DEVICES_FILE,{});

function saveUsage(){saveJSON(USAGE_FILE,allUsage);}
function saveConfig(){saveJSON(CONFIG_FILE,appConfig);}
function saveContent(){saveJSON(CONTENT_FILE,contentUpdates);}
function saveDevices(){saveJSON(DEVICES_FILE,devices);}

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

  // ─── DASHBOARD ───
  if(req.method==='GET'&&(pathname==='/'||pathname==='/dashboard')){
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.end(getDashboardHTML());
    return;
  }

  jsonResponse(res,404,{error:'Not found'});
});

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
},6*60*60*1000);

server.listen(PORT,'0.0.0.0',function(){
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   Shravani Learning - Admin Server       ║');
  console.log('  ╠══════════════════════════════════════════╣');
  console.log('  ║  Dashboard: http://localhost:'+PORT+'         ║');
  console.log('  ║  Public:    Use localtunnel/ngrok        ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
  console.log('  Waiting for phone connections...');
  console.log('');
});
