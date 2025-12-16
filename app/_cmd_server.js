const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs'); //const querystring = require('querystring');
const urltool = require('url');
const os = require('os');
const upload = require('./_obj_filehandle');
const uploadSheet = require('./_sheetmusic');

//const sqlite3 = require('sqlite3').verbose();
//const express = require('express');

const sync_Bible = require('./_obj_Bible'); //('./_sync_Bible')
const sync_lyrics = require('./_obj_lyrics'); //('./_sync_lyrics')
const sync_camera = require('./_obj_camera'); //('./_sync_camera')
const sync_tally = require('./_tally');
const users = require('./_users');

var WebSocket = null; //require('ws'); 
var Cluster = null;

var port = 80;
var docluster = false;
var httpsEnable = false;

const httpsOptions = {
  //key: fs.readFileSync('./ssl/localhost.key'),
  //cert: fs.readFileSync('./ssl/localhost.crt'),
};

global.print = function (msg) {
  process.stdout.write(`(${process.pid}) ${msg}`);
}

global.println = function (msg) { //console.trace();
  if (msg)
    process.stdout.write(`\n(${process.pid}) ${msg}`);
  else
    process.stdout.write('\n');
}

global.ptlet = function (msg) { //console.trace();
  process.stdout.write(msg);
}

global.clearScreen = function () {
  process.stdout.write('\x1B[2J\x1B[0;0H');
}

try {
  require.resolve('cluster');
  println('cluster Module exists');
  Cluster = require('cluster');
} catch (err) {
  println('Cluster Module does not exist');
}

try {
  require.resolve('ws');
  println('Websocket Module exists');
  WebSocket = require('ws');
} catch (err) {
  println('Websocket Module does not exist');
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function print_sys_info() {
  println();
  println('node version: ' + process.versions.node);
  println('  v8 version: ' + process.versions.v8);
  println(`process.cwd() ${process.cwd()}`);
  println(`dir  name ${__dirname}`);
  println(`file name ${__filename}`);

  println('cpu ' + os.cpus().length + ' cores');
  println('total mem: ' + numberWithCommas(os.totalmem()));
  println(' free mem: ' + numberWithCommas(os.freemem()));
  println('    ratio: ' + Math.floor(os.freemem() / os.totalmem() * 100) + '%');
  println();
}

print_sys_info();

function handleVideo(videoPath, req, res) {
  fs.stat(videoPath, (err, stats) => {
      if (err) {
        console.error(err);
        res.writeHead(404);
        res.end("File not found");
        return;
      }
      
      let range = req.headers.range;
      if (!range) {
        // 如果沒有 Range header，就回傳整個檔案
        println('沒有 Range header');
        res.writeHead(200, {
          'Content-Type': 'video/mp4',
          'Content-Length': stats.size,
        });
        fs.createReadStream(videoPath).pipe(res);
        println('回傳整個檔案');
        return;
      }
    

      // 解析 Range header
      const positions = range.replace(/bytes=/, "").split("-");
      const start = parseInt(positions[0], 10);
      const end = positions[1] ? parseInt(positions[1], 10) : stats.size - 1;

      const chunkSize = (end - start) + 1;

      //println('Range header: ' + positions + ', ' + start + ', ' + end);

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      fs.createReadStream(videoPath, { start, end }).pipe(res);
    });
}

//讀檔輸出
function responseFile(filePath, req, res) {

  filePath = decodeURIComponent(filePath);

  const ext = path.extname(filePath).toLowerCase();

  const contentType = {
      '.jpg' : 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png' : 'image/png',
      '.gif' : 'image/gif',
      '.html': 'text/html',
      '.css' : 'text/css',
      '.pdf' : 'application/pdf',
      '.mp4' : 'video/mp4',
      '.mov' : 'video/quicktime'
  }[ext] || 'application/octet-stream';

  if (contentType.startsWith('video')) {
      println(filePath + ':' + contentType);
      handleVideo(filePath, req, res);
      return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // 若檔案不存在，回傳404 Not Found狀態碼
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }
    // 回傳200 OK狀態碼及HTML內容
    //const fp = path.join(process.cwd(), 'public', filePath);
    
    res.writeHead(200, { 'Content-Type': contentType });// 'text/html' });//; charset = UTF-8
    res.write(content);
    res.end();
    print('(file:' + filePath + ')');// ... ' + content);

  });
}

function savejsonfile(req, res) {
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
    body += data;
  });

  // 请求数据接收完成后的处理
  req.on('end', () => {
    // 解析请求数据
    const requestData = JSON.parse(body); //obj
    //println(body);

    let fn = requestData.filename;
    let content = requestData.content; //str
    let jsonobj = JSON.parse(content); //obj
    println(jsonobj);

    const writeStream = fs.createWriteStream(fn);
    writeStream.write(JSON.stringify(jsonobj, null, "  ")); //, null, "\t");
    writeStream.end(() => {
      println('檔案寫入完成!');
    });

    res.setHeader('Content-Type', 'application/json');// 发送响应数据
    res.end(JSON.stringify({ "state": "success" }));

  });
}

function webservice(req, res) {

  let url = req.url;

  //let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //res.send(`Your IP address is: ${ip}`);

  if (req.method === 'POST' && req.url === '/loginchk') {
    println('------');
    println('post /loginchk');
    users.chk(req, res);
    return;
  }

  if (req.method === 'POST' && req.url === '/login') {
    println('------');
    println('post /login');
    users.auth(req, res);
    return;
  }

  switch (url) {

    //經文
    case '/synscripture': sync_Bible.synscripture(req, res); return;
    case '/restorescripture': sync_Bible.restorescripture(req, res); return;

    //歌詞
    case '/synclyrics': sync_lyrics.synclyrics(req, res); return;
    case '/actionlyrics': sync_lyrics.lyricsBaseAction(req, res); return;

    //設定存檔
    case '/savejson': savejsonfile(req, res); return;

    //tally相關
    case '/query': sync_tally.query(req, res); return;
    case '/command': sync_tally.command(req, res); return;
    case '/initui': sync_tally.initui(req, res); return;

    //上傳檔案相關
    case '/upload': upload.uploadFile(req, res); return;
    case '/filesaction': upload.handleFile(req, res); return;

    //上傳譜相關
    case '/uploadsheet': uploadSheet.uploadFile(req, res); return;
    case '/sheetaction': uploadSheet.handleFile(req, res); return;

    default:

      if (req.url.startsWith('/cmd')) {
        if (req.url === '/cmd') {
          sync_tally.cmdAll(req, res);
          return;
        }
        let queryData = urltool.parse(req.url, true).query;
        if (queryData.cc) {
          sync_tally.cmd(req, res, parseInt(queryData.cc));
          return;
        }
        return;
      }
      break;
  }

  if (url.startsWith('/synscripture_get')) {
    sync_Bible.synscripture_get(url, res);
    return;
  }

  if (url === '/') {
    const redirect = '/index.html';
    // 执行重定向
    res.writeHead(302, { Location: redirect });
    res.end();
    return;
  }

  /*
  if (url === '/' || url === '/index.html') {
    const redirect = '/index.html?server=nodejs';
    // 执行重定向
    res.writeHead(302, { Location: redirect });
    res.end();
    return;
  }
  */

  // 使用正規表達式提取檔名
  if (url.lastIndexOf(".html?") > 0) {
    const match = url.match(/\/([^\/?#]+\.html)(?:[?#]|$)/);
    const fileName = match ? match[1] : null;

    url = url.substr(0, url.lastIndexOf(fileName)) + fileName;

    println('path' + url); //url = '/' + fileName;
  }

  const filePath = `.${url}`;
  responseFile(filePath, req, res);

}

function startService() {

  const server = httpsEnable ?
    https.createServer(httpsOptions, webservice) :
    http.createServer(webservice);

  const networkInterfaces = os.networkInterfaces();
  const addresses = [];

  Object.keys(networkInterfaces).forEach(interfaceName => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach(interfaceInfo => {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) { // 'IPv6'
        addresses.push(interfaceInfo.address);
      }
    });
  });

  //start websocket server
  if (WebSocket) {
    const wss = new WebSocket.Server({ server });//{ port: wsport });
    //println('websocket port : ' + wsport);
    wss.on('connection', function connection(ws, req) {

      //let ip = req.socket.remoteAddress;
      let url = req.url;

      if (url.startsWith('/Bible')) {
        let user = url.substring('/Bible/'.length);
        if (user && user.length >= 1)
          sync_Bible.addClient2Map(user, ws);
      }

      if (url.startsWith('/Song')) {
        let user = url.substring('/Song/'.length);
        if (user && user.length >= 1)
          sync_lyrics.addClient2Map(user, ws);
      }

      if (url.startsWith('/Camera')) {
        let user = url.substring('/Camera/'.length);
        if (user && user.length >= 1)
          sync_camera.setCamera(user, ws);
      }

      if (url.startsWith('/Canvas')) {
        let user = url.substring('/Canvas/'.length);
        if (user && user.length >= 1)
          sync_camera.addClient2Map(user, ws);
      }

    });
  }

  server.listen(port, () => {
    if (httpsEnable) {
      println('Server is running... https://[Domain name]    ' + 'https://' + addresses[0]);
    } else {
      println('Server is running... http://' + addresses[0] + ((port == 80) ? '' : ':' + port));
    }
    println('');
  });

}

function printInfo() {
  let info_b = sync_Bible.getInfo();
  let info_l = sync_lyrics.getInfo();
  info_b.forEach(function (_info) {
    println(_info);
  });
  info_l.forEach(function (_info) {
    println(_info);
  });
}

function tuiPrepare() {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (key) => {
    if (key === '\u0003' || key.toLowerCase() === 'q') { // 按下 Ctrl+C 或 'q' 退出
      clearScreen();
      process.exit();
    }

    // 更新光標位置
    //console.log('// ' +key.toLowerCase());
    switch (key.toLowerCase()) {
      case 'c':
        clearScreen();
        printInfo();
        break;
      //case '\n':  println(); break;
      //default: println(); break;
    }

  });
}

function createFork() {
  const numCPUs = os.cpus().length;
  println(`main process running`);

  for (let i = 0; i < numCPUs; i++) {
    const worker = Cluster.fork();
    worker.on('message', (msg) => { //println('worker receive:' + JSON.stringify(msg));
      for (const id in Cluster.workers) {
        if (Cluster.workers[id].process.pid === worker.process.pid) continue;
        Cluster.workers[id].send(msg);
      }

    });
  }

  Cluster.on('exit', (worker, code, signal) => {
    println("exit!");
  });
}

function createService() {

  startService();

  if (process.send) println('process on message');

  process.on('message', (msg) => { //println('process receive:' + JSON.stringify(msg));           

    if (msg.type === 'syncCamera') {
      sync_camera.syncFromWorker(msg);
      return;
    }

    if (msg.type === 'syncBible') {
      sync_Bible.syncFromWorker(msg);
      return;
    }
    if (msg.type === 'syncSong') {
      sync_lyrics.syncFromWorker(msg);
      return;
    }
    if (msg.type === 'syncTally') {
      sync_tally.syncFromWorker(msg);
      return;
    }

  });
}

function prepareArgSetting() {
  //pid = process.pid;
  const args = process.argv;

  for (let i = 0; i < args.length; i++) {
    if (args[i] == '-port' || args[i] == '-p') {
      if (args.length >= i + 2 && !isNaN(parseInt(args[i + 1])))
        port = parseInt(args[i + 1]);
      continue;
    }
    if (args[i] == '-cluster') {
      docluster = true;
      continue;
    }
    if (args[i] == '-tui') {
      tuiPrepare();
      continue;
    }
    if (args[i] == '-auth') {
      users.setDoAuth(true);
      continue;
    }
    if (args[i] == '-https') {
      httpsEnable = true;
      port = 443;
      continue;
    }
  }

}

prepareArgSetting(); //createService();

/*
worker    worker    worker
  ^         ^     --  ^
  |         |         | msg
process   process   process

process.send
worker.send  (check pid)
process. on message
*/
if (docluster) {
  if (Cluster.isMaster) {
    createFork();
  } else {
    createService();
  }
} else {
  createService();
}
