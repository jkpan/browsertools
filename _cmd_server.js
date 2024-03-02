const http = require('http');
const fs = require('fs');//const qs = require('querystring');
const querystring = require('querystring');
const urltool = require('url');
const os = require('os');
//const express = require('express');
//const cluster = require('cluster');

/*
const playCode = 
`<script type="text/javascript" charset="UTF-8">

  color_selection = 1; 
  colorSwitch(); 
  setMsg_play(); 
  removeTEvent(); 
  addFontSizeTouchEvent();
  
  //downsizeFS();

  fontfactor += 5;
  init();
  
  _repaint();

</script>`;

const ctrlCode = 
`<script type="text/javascript" charset="UTF-8">

  color_selection = 0; 
  colorSwitch(); 
  setMsg_ctrl();
  
  fontfactor += 5;
  init();
  
  _repaint();

</script>`;
*/

console.log('cpu ' + os.cpus().length + ' cores');

function print(msg) {
  process.stdout.write(msg);
}

function println(msg) {
  //console.log(msg);
  process.stdout.write(msg);
}


const CAMERAS = 4;
const msgs = ['.', 
              '.', '.', '.', '.'];

var volume = 1;
var chapter = 0;
var verse = 0;
var doblank = 0;

var song = 0;
var phase = 0;
var line = 0;
var song_doblank = 0;

//intercom下指令
function command(req, res) {
    let body = '';
    
    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
    });
      
    // 请求数据接收完成后的处理
    req.on('end', () => {
        // 解析请求数据
        const requestData = JSON.parse(body);

        println('(cmd:' + body + ')');
        
        if (requestData.camera == 0) { 
          for (let i=0;i<msgs.length;i++) msgs[i] = '.';
        } else {
          if (requestData.msg) {
            msgs[requestData.camera] = requestData.msg;
          } else {
            msgs[requestData.camera] = '.';
          }          
        }
      
        res.setHeader('Content-Type', 'application/json');
        
        // 发送响应数据
        res.end(JSON.stringify({"state": "success"}));//res.end(JSON.stringify(queryResult));

    });
}

//intercom查目前所有指令
function query(req, res) {

    let body = '';
    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
    });
      
    // 请求数据接收完成后的处理
    req.on('end', () => {
        // 解析请求数据 const requestData = JSON.parse(body);

        println('(query)');

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({"state" : msgs}));

      });
}

//intercom得到相機數量
function initui(req, res) {
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {

      println('(initui)');

      res.setHeader('Content-Type', 'application/json');
      
      // 发送响应数据
      let obj = {
        "camera" : CAMERAS,
        //"cmd" : COMMANDS
      };
      res.end(JSON.stringify(obj));
    });
}

//好像沒用到
function cmdAll(req, res) { //for M5Stick
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {
      res.setHeader('Content-Type', 'text/html');
      
      let cc = '';
      for (let i=1;i<msgs.length;i++) {
        cc += ' ' + msgs[i];
      }
      cc = cc.trim();
      res.end(cc);
    });
}

//intercom M5Stick取得指令
function cmd(req, res, _cma) { 
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {
      
      print('.');

      res.setHeader('Content-Type', 'text/html');
      res.end(msgs[_cma]);
    });
}

//同步歌詞
function synclyrics(req, res) {
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {
      // 解析请求数据
      const requestData = JSON.parse(body);

      song = requestData.song;
      phase = requestData.phase;
      line = requestData.line;
      song_doblank = requestData.blank;

      println('(song:' + song +', '+ phase + ', ' + line + ',' + song_doblank + ')');
    
      res.setHeader('Content-Type', 'application/json');
      
      // 发送响应数据
      res.end(JSON.stringify({"state": "success"}));//res.end(JSON.stringify(queryResult));

  });
}

//取得歌詞狀態
function restorelyrics(req, res) {
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {
      // 解析请求数据
    const requestData = JSON.parse(body);
      
    // 设置响应头
    res.setHeader('Content-Type', 'application/json');
    
    print('#');
    // 发送响应数据
    res.end(JSON.stringify({
        song: song,
        phase: phase,
        line: line,
        blank: song_doblank
    }));

  });
}

//取得經文狀態
function restorescripture(req, res) {
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {
      // 解析请求数据
    const requestData = JSON.parse(body);
      
    // 设置响应头
    res.setHeader('Content-Type', 'application/json');
    
    print('-');
    // 发送响应数据
    res.end(JSON.stringify({
        vlm: volume,
        chp: chapter,
        ver: verse,
        blank: doblank
    }));

  });
}

//同步經文
function synscripture(req, res) {
  let body = '';
    
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {
      // 解析请求数据
      const requestData = JSON.parse(body);
      
      volume = requestData.vlm;
      chapter = requestData.chp;
      verse = requestData.ver;
      doblank = requestData.blank;

      println('(Bible:' + volume +', '+ chapter + ', ' + verse + ',' + doblank + ')');
    
      res.setHeader('Content-Type', 'application/json');
      
      // 发送响应数据
      res.end(JSON.stringify({"state": "success"}));//res.end(JSON.stringify(queryResult));

  });
}

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
      println('(file: ' + filePath + ')');
    }
  });
}

const server = http.createServer((req, res) => {
  // 解析URL路徑

  let url = req.url;

  //let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  //println('ip = ' + ip);
  //res.send(`Your IP address is: ${ip}`);

  switch (url) {

    case '/restorescripture': restorescripture(req, res); return;
    case '/synscripture':     synscripture(req, res);     return;

    case '/query':            query(req, res);            return;
    case '/command':          command(req, res);          return;

    case '/restorelyrics':    restorelyrics(req, res);    return;
    case '/synclyrics':       synclyrics(req, res);       return;

    case '/initui':           initui(req, res);           return;
    /*
    case '/Bible_ctrl': {
      url = '/subtitle_b.html';
      responseFile(`.${url}`, res, ctrlCode);
    } return;
    case '/Bible_play': {
      url = '/subtitle_b.html';
      responseFile(`.${url}`, res, playCode);
    } return;
    case '/Bible_play_niv': {
      url = '/subtitle_niv.html';
      responseFile(`.${url}`, res, playCode);
    } return;
    */
    default:
        if (req.url.startsWith('/cmd')) {
          if (req.url === '/cmd') {
            cmdAll(req, res); 
            return; 
          }
          var queryData = urltool.parse(req.url, true).query;
          if (queryData.cc) {
            cmd(req, res, parseInt(queryData.cc));
            return;
          }
          return;
        }
        break;
  }

  if (url === '/Bible_play') {
    const redirect = '/subtitle_b.html?action=play';
    res.writeHead(302, {Location: redirect});
    res.end();
    return;
  }

  if (url === '/Bible_play_niv') {
    const redirect = '/subtitle_niv.html?action=play';
    res.writeHead(302, {Location: redirect});
    res.end();
    return;
  }

  if (url === '/Bible_ctrl') {
    const redirect = '/subtitle_b.html?action=ctrl';
    res.writeHead(302, {Location: redirect});
    res.end();
    return;
  }

  if (url === '/' || url === '/index.html') {
    //url = '/index_nodejs.html';

    const redirect = '/index.html?server=nodejs';
    // 执行重定向

    res.writeHead(302, {Location: redirect});
    res.end();

    return;
  }

  if (url.startsWith('/index.html')) {
    url = '/index.html';
  }

  if (url.startsWith('/dash.html')) {
    url = '/dash.html';
  }

  if (url.startsWith('/subtitle_b.html')) {
    url = '/subtitle_b.html';
  }

  if (url.startsWith('/subtitle_niv.html')) {
    url = '/subtitle_niv.html';
  }

  if (url.startsWith('/led.html')) {
    url = '/led.html';
  }

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

let port = 80;
const args = process.argv;//.slice(1);
if (args.length > 2) port = parseInt(args[2]);

server.listen(port, () => {
  console.log('Server is running...'); //console.log(`Server is running on port ${port}`);
  console.log('http://' + addresses[0] + ((port == 80)?'':':'+port));
});
