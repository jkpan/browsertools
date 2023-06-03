const http = require('http');
const fs = require('fs');
//const qs = require('querystring');
const urltool = require('url');

const COMMANDS = ['.',
  '[O]', '[X]', '<<O>>', '>>O<<',
  '<=',  '=>', '^',   'v',
  'Piano', 'Drum', 'Guitar', 'Stage', 
  'Cross', '3F', 'Focus' 
];

const CAMERAS = 4;
const currentCmds = [0, 
                     0, 0, 0, 0];

var volumn = 1;
var chapter = 0;
var verse = 0;
var doblank = 0;

function getDes(cmd) {
  return COMMANDS[cmd];
}
  
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

        console.log(body);
        
        if (requestData.camera == 0 && requestData.cmd == 0) {
          for (let i=0;i<currentCmds.length;i++) currentCmds[i] = 0;
        } else {
          currentCmds[requestData.camera] = requestData.cmd;
        }

        //_cmd = requestData.cmd;
        //_camera = requestData.camera;
      
        res.setHeader('Content-Type', 'application/json');
        
        // 发送响应数据
        res.end(JSON.stringify({"state": "success"}));//res.end(JSON.stringify(queryResult));

        //console.log('camera: ' + _camera + ', cmd: ' + _cmd );
    });
}

function query(req, res) {
    let body = '';
    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
        //console.log(':' + body);
    });
      
    // 请求数据接收完成后的处理
    req.on('end', () => {
        // 解析请求数据
        const requestData = JSON.parse(body);
        //console.log(':' + body);
        // 设置响应头
        res.setHeader('Content-Type', 'application/json');
        
        // 发送响应数据
        res.end(JSON.stringify({"state" : currentCmds}));

      });
}

function initui(req, res) {
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
      
      // 发送响应数据
      let obj = {
        "camera" : CAMERAS,
        "cmd" : COMMANDS
      };
      res.end(JSON.stringify(obj));
    });
}

function cmdAll(req, res) { //for M5Stick
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {
      res.setHeader('Content-Type', 'text/html');
      // 发送响应数据
      // res.end('' + _camera + ' ' + _cmd + ' ' + getDes(_cmd));
      let cc = '';
      for (let i=1;i<currentCmds.length;i++) {
        cc += getDes(currentCmds[i]);
        cc += ' ';
      }
      cc = cc.trim();
      res.end(cc);
    });
}

function cmd(req, res, _cmd) { //for M5Stick
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
      body += data;
  });
    
  // 请求数据接收完成后的处理
  req.on('end', () => {
      res.setHeader('Content-Type', 'text/html');
      // 发送响应数据
      // res.end('' + _camera + ' ' + _cmd + ' ' + getDes(_cmd));
      res.end(getDes(currentCmds[_cmd]));
    });
}

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
    
    console.log('restorescripture:' + volumn +', '+ chapter + ', ' + verse);
    // 发送响应数据
    //res.end(JSON.stringify({"camera" : _camera, "cmd" : _cmd}));
    res.end(JSON.stringify({
        vlm: volumn,
        chp: chapter,
        ver: verse,
        blank: doblank
    }));

  });
}

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
      
      volumn = requestData.vlm;
      chapter = requestData.chp;
      verse = requestData.ver;
      doblank = requestData.blank;

      console.log('synscripture:' + volumn +', '+ chapter + ', ' + verse + ',' + doblank);
    
      res.setHeader('Content-Type', 'application/json');
      
      // 发送响应数据
      res.end(JSON.stringify({"state": "success"}));//res.end(JSON.stringify(queryResult));

  });
}

const server = http.createServer((req, res) => {
  // 解析URL路徑

  switch (req.url) {
    case '/command':
      command(req, res);
      return;
    case '/query':
      query(req, res);
      return;
    case '/initui':
      initui(req, res);
      return;
    case '/synscripture':
      synscripture(req, res);
      return;
    case '/restorescripture':
      restorescripture(req, res);
      return;
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
        }
        break;
  }

  let url = req.url;

  if (url === '/') {
    url = '/index.html';//url = '_cmd_client.html';
  }

  // 將URL路徑轉換為檔案路徑
  const filePath = `.${url}`;

  // 使用fs模組讀取檔案
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // 若檔案不存在，回傳404 Not Found狀態碼
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      // 回傳200 OK狀態碼及HTML內容
      res.writeHead(200, { 'Content-Type': 'text/html' });//; charset = UTF-8
      res.write(content);
      //console.log(content);
      res.end();
      console.log('filePath: ' + filePath);
    }
  });
});

// 啟動server並監聽指定的port
const port = 80;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

