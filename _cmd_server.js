const http = require('http');
const fs = require('fs');
//const qs = require('querystring');
const urltool = require('url');
const os = require('os');
//const cluster = require('cluster');

console.log('cpu ' + os.cpus().length + ' cores');

const CAMERAS = 4;
const msgs = ['.', 
              '.', '.', '.', '.'];

var volumn = 1;
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

        console.log('###:' + body);
        
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
        //console.log(':' + body);
    });
      
    // 请求数据接收完成后的处理
    req.on('end', () => {
        // 解析请求数据 const requestData = JSON.parse(body);

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

      console.log('synclyrics:' + song +', '+ phase + ', ' + line + ',' + song_doblank);
    
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
    
    //console.log('restorescripture:' + volumn +', '+ chapter + ', ' + verse);
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
    
    //console.log('restorescripture:' + volumn +', '+ chapter + ', ' + verse);
    // 发送响应数据
    res.end(JSON.stringify({
        vlm: volumn,
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
      //console.log(content);
      res.write(append);
      res.end();
      console.log('filePath: ' + filePath);
    }
  });
}

const server = http.createServer((req, res) => {
  // 解析URL路徑

  let url = req.url;

  switch (url) {

    case '/restorescripture': restorescripture(req, res); return;
    case '/synscripture':     synscripture(req, res);     return;

    case '/query':            query(req, res);            return;
    case '/command':          command(req, res);          return;

    case '/restorelyrics':    restorelyrics(req, res);    return;
    case '/synclyrics':       synclyrics(req, res);       return;

    case '/initui':           initui(req, res);           return;

    case '/Bible_play': {
      url = '/subtitle_b.html';
      responseFile(`.${url}`, res, 
        `<script type="text/javascript" charset="UTF-8"> 
          color_selection = 2; 
          colorSwitch(); 
          setMsg_play(); 
          removeTEvent(); 
          addFontSizeTouchEvent(); 
        </script>`);
    } return;
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

  if (url === '/') {
    url = '/index.html';
  }

  const filePath = `.${url}`;
  responseFile(filePath, res, '');

});

// 啟動server並監聽指定的port
const port = 80;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
