const http = require('http');
const fs = require('fs'); //const querystring = require('querystring');
const urltool = require('url');
const os = require('os'); //onst socketIo = require('socket.io');
//const sqlite3 = require('sqlite3').verbose();
//const express = require('express');
//const app = express();

const sync_Bible  = require('./_sync_Bible');
const sync_lyrics = require('./_sync_lyrics');
const sync_tally = require('./_tally');

var WebSocket = null; //require('ws'); //var Cluster = null;

//var wss = null;
//var server;

var port = 80;
var pid = '';

global.print = function(msg) {
  process.stdout.write(`(${pid})` + msg);
}

/*
global.print_ln = function(msg) {
  process.stdout.write(`(${pid})` + msg + '\n');
}

global.printlnln = function(msg) {
  process.stdout.write('\n' + `(${pid})` + msg + '\n');
}
*/

global.println = function(msg) { //console.trace();
  process.stdout.write('\n' + `(${pid})` + msg);
}

/*
try {
  // 尝试加载模块
  require.resolve('cluster');
  println('cluster Module exists');
  Cluster = require('cluster');
} catch (err) {
  println('Cluster Module does not exist');
}
*/

try {
  // 尝试加载模块
  require.resolve('ws');
  println('Websocket Module exists');
  WebSocket = require('ws');
} catch (err) {
  println('Websocket Module does not exist');
}

println('cpu ' + os.cpus().length + ' cores');

//讀檔輸出
function responseFile(filePath, res, append) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // 若檔案不存在，回傳404 Not Found狀態碼
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      // 回傳200 OK狀態碼及HTML內容
      res.writeHead(200, { 'Content-Type': 'text/html' });//; charset = UTF-8
      res.write(content);
      res.write(append);
      res.end();
      print('(file:' + filePath + ')');
    }
  });
}

function startService() {

  pid = process.pid;
  //println('pid: ' + pid);

  const server = http.createServer((req, res) => {
    // 解析URL路徑

    let url = req.url;

    //let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //res.send(`Your IP address is: ${ip}`);

    switch (url) {

      case '/query': sync_tally.query(req, res); return;
      case '/command': sync_tally.command(req, res); return;
      case '/initui': sync_tally.initui(req, res); return;

      case '/synscripture': sync_Bible.synscripture(req, res); return;
      case '/restorescripture': sync_Bible.restorescripture(req, res); return;

      case '/synclyrics': sync_lyrics.synclyrics(req, res); return;
      case '/actionlyrics': sync_lyrics.lyricsBaseAction(req, res); return;
      //case '/restorelyrics': restorelyrics(req, res);    return;

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

    //
    if (url.startsWith('/synscripture_get')) {
      sync_Bible.synscripture_get(url);
      return;
    }

    //特定字眼給特定功能
    if (url === '/Bible_play') {
      const redirect = '/subtitle_b.html?action=play';
      res.writeHead(302, { Location: redirect });
      res.end();
      return;
    }

    if (url === '/Bible_play_niv') {
      const redirect = '/subtitle_niv.html?action=play';
      res.writeHead(302, { Location: redirect });
      res.end();
      return;
    }

    if (url === '/Bible_ctrl') {
      const redirect = '/subtitle_b.html?action=ctrl';
      res.writeHead(302, { Location: redirect });
      res.end();
      return;
    }

    //首頁塞參數 redirect
    if (url === '/' || url === '/index.html') {
      const redirect = '/index.html?server=nodejs';
      // 执行重定向
      res.writeHead(302, { Location: redirect });
      res.end();
      return;
    }

    if (url.startsWith('/index.html')) url = '/index.html'; // 處理首頁: url == /index.html?server=nodejs
    if (url.startsWith('/dash.html'))  url = '/dash.html';
    if (url.startsWith('/subtitle_b.html')) url = '/subtitle_b.html';
    if (url.startsWith('/subtitle_niv.html')) url = '/subtitle_niv.html';
    if (url.startsWith('/led.html')) url = '/led.html';
    
    const filePath = `.${url}`;
    responseFile(filePath, res, '');

  });

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

  const args = process.argv;//.slice(1); if (args.length > 2) port = parseInt(args[2]);
  if (args.length >= 3) {
    port = parseInt(args[2]);
    //if (args.length >= 4) wsport = parseInt(args[3]);
  }

  if (WebSocket) {
    const wss = new WebSocket.Server({ server });//{ port: wsport });
    //println('websocket port : ' + wsport);
    wss.on('connection', function connection(ws, req) {

      let ip = req.socket.remoteAddress;
      let url = req.url;
      //println(' #url: ' + ip + ', ' + url + '#');

      if (url === '/Bible') {
        println(`[client ${ip} connected]`);
        sync_Bible.addClient(ws);
      }

      if (url === '/Song') {
        println(`<client ${ip} connected>`);
        sync_lyrics.addClient(ws);
      }

    });
  }

  server.listen(port, () => {
    println('Server is running... http://' + addresses[0] + ((port == 80) ? '' : ':' + port));
    println('');
  });

}

startService();
//sync_lyrics.songjsonformat();

/*
if (Cluster.isMaster) {
  const numCPUs = require('os').cpus().length;
  console.log(`主进程 ${process.pid} 正在运行`);

  // 创建工作进程
  for (let i = 0; i < 2; i++) {
  //for (let i = 0; i < numCPUs; i++) {
    Cluster.fork();
  }

  Cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    //console.log(`工作进程 ${process.pid} 启动的服务器正在监听端口 8080`);
  });

} else {
  startService();
}
*/

//npm install ws
//sudo su -
//ssh -i "taipei_jkpan_macmini.pem" ubuntu@ec2-54-169-169-141.ap-southeast-1.compute.amazonaws.com
//pm2 start _cmd_server.js
//pm2 stop _cmd_server
//pm2 logs --lines 200
//pm2 delete all
//ec2-54-169-169-141.ap-southeast-1.compute.amazonaws.com
//cluster
//pm2 start _cmd_server.js -i 10
//standalong process
//pm2 start process.json