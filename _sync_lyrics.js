const fs = require('fs');
var WebSocket = require('ws');

var song;
var phase = 0;
var line = 0;
var song_doblank = 0;

const S_clients = new Set();

function getSongObjStr() {
  if (!song)
    return JSON.stringify({
      song: [[""]],
      phase: 0,
      line: 0,
      blank: 0
    });
  return JSON.stringify({
    song: song,
    phase: phase,
    line: line,
    blank: song_doblank
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
    //println(body);

    song = requestData.song;
    phase = requestData.phase;
    line = requestData.line;
    song_doblank = requestData.blank;

    try {
      println(`<master: ${song[0][0]}, ${phase}, ${line}, ${song_doblank}>`);
    } catch (err) {
      println(`<master: err ${phase}, ${line}, ${song_doblank}>`);
    }

    res.setHeader('Content-Type', 'application/json');

    // 发送响应数据
    res.end(JSON.stringify({ "state": "success" }));//res.end(JSON.stringify(queryResult));
    broadcast();

  });
}

function broadcast() {
  let data = getSongObjStr();
  print(` < conn: ${S_clients.size} > `);
  S_clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      print('<broadcast ' + client._socket.remoteAddress + '>');
      client.send(data);
    } else {
      S_clients.delete(client);
      print('<' + client._socket.remoteAddress + ' removed>');
    }
  });
  //println('');
}

function addClient(ws) {
  S_clients.add(ws);
  ws.on('message', function incoming(message) {
    println(`<client: ${message}>`);
    ws.send(getSongObjStr());
  });
}

function getArrayDimension(arr) {
  if (Array.isArray(arr)) {
    return 1 + Math.max(...arr.map(getArrayDimension), 0);
  } else {
    return 0;
  }
}

function formatALL(fstream, ALL_SONGS) {
  fstream.write('{\n');
  var keys = Object.keys(ALL_SONGS);
  let indent = '    ';
  keys.forEach(function (key, index) {
    let song = ALL_SONGS[key];
    if (key === 'nosong') {
      let jsonstr = '"' + key + '": ' + JSON.stringify(song, null, "\t");
      fstream.write(jsonstr + ',\n\n');
      return;
    }
    fstream.write(indent + '"' + key + '": {\n');
    let content = song['content'];
    switch (getArrayDimension(content)) {
      case 1: {
        let str = '[';
        for (let k = 0; k < content.length; k++) {
          str += '"' + content[k] + '"';
          str += k < content.length - 1 ? ', ' : ']';
        }
        fstream.write(indent + indent + '"content":' + str + '\n');
      }
        break;
      case 2: {
        fstream.write(indent + indent + '"content": [\n');
        let str = indent + indent + indent;
        for (let i = 0; i < content.length; i++) {
          str += '[';
          for (let j = 0; j < content[i].length; j++) {

            if (typeof content[i][j] === 'string') {
              str += '"' + content[i][j] + '"';
            } else {
              str += content[i][j];
            }
            str += j < content[i].length - 1 ? ', ' : ']';

          }
          str += i == content.length - 1 ? '' : ',';
          fstream.write(str + '\n');
          str = indent + indent + indent;
        }
        fstream.write(indent + indent + ']\n');
      }
        break;
    }
    console.log("index: " + index + '/' + keys.length);
    if (index < keys.length - 1)
      fstream.write(indent + '},\n');
    else
      fstream.write(indent + '}\n');
  });
  fstream.write('}\n');
}

function readAndAction(path, handle) {
  fs.readFile(path, 'utf8', (err, data) => {

    println('readFileSync 0');

    if (err) {
      console.error('讀取 JSON 檔案時發生錯誤:', err);
      return;
    }

    println('readFileSync 1');

    try {
      // 將讀取到的內容轉換為 JSON 物件
      let ALL_SONGS = JSON.parse(data);      
      handle(ALL_SONGS);
      println('readFileSync 2');

    } catch (parseError) {
      console.error('解析 JSON 檔案時發生錯誤:', parseError);
    }
    println('readFileSync 3');
  });
}

function songjsonformat() {
  readAndAction('./json/songbase.json', (ALL_SONGS)=>{
    const writeStream = fs.createWriteStream('./json/output2.json');
    formatALL(writeStream, ALL_SONGS);
    writeStream.end(() => {
      console.log('檔案寫入完成!');
    });
  });
}

//songs base manipulation
function lyricsBaseAction(req, res) {
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
    body += data;
  });

  // 请求数据接收完成后的处理
  req.on('end', () => {
    // 解析请求数据
    const requestData = JSON.parse(body);
    //println(body);

    let action = requestData.action;
    let id = requestData.id;
    let content = requestData.song;

    let opObj = {
      "content": content
    };

    println('action: ' + action);
    println(JSON.stringify(content));

    switch (action) {
      case 'add': {
        let result = false;
        println('add start');
        readAndAction('./json/songbase.json', (ALL_SONGS) => {
          if (ALL_SONGS[id]) {
            result = false;
            println('add exist return!');
            //res.setHeader('Content-Type', 'application/json');// 发送响应数据
            //res.end(JSON.stringify({ "state": "fail" }));
            return;
          }
          ALL_SONGS[id] = opObj;
          println('add success');
          result = true;
          println('add save file');
          const writeStream = fs.createWriteStream('./json/output3.json');
          formatALL(writeStream, ALL_SONGS);
          writeStream.end(() => {
            console.log('檔案寫入完成!');
          });
          //res.setHeader('Content-Type', 'application/json');// 发送响应数据
          //res.end(JSON.stringify({ "state": "success" }));
        });
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        /*
        readAndAction('./json/songbase.json', ()=> {
          let volume = ALL_SONGS['nosong']['VOLUME'].content;
          let prefix = '';
          let volumn_idx;
          for (let i=0;i<volume.length;i++) {
            println('id:'+id +',  ' + volume[i][0] + ', ' + id.startsWith(volume[i][0]));
            if (id.startsWith(volume[i][0])) {
              prefix = volume[i][0];
              volumn_idx = parseInt(id.substring(prefix.length));
              break;
            }
          }          
          var keys = Object.keys(ALL_SONGS);
          let done = false;
          keys.forEach(function (key, index) {
            if (done) return;
            if (!key.startsWith(prefix)) return;
            let idx = parseInt(key.substring(prefix.length));
            println(`${prefix} :: ${idx}`);
            if (idx > volumn_idx && !done) {
              println('insert...');
              done = true;
            }
          });
        });
        */
        }
        break;
      case 'fix':
        readAndAction('./json/songbase.json', (ALL_SONGS)=>{
          
        });
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        break;
      case 'del':
        readAndAction('./json/songbase.json', (ALL_SONGS)=>{
          
        });
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        break;
    }

  });
}

module.exports = {
  addClient,
  synclyrics,
  lyricsBaseAction,
  songjsonformat
};
