const READ_SRC = './json/songbase.json';
const WRITE_SRC = './json/songbase.json';

const fs = require('fs');
var WebSocket = require('ws');

var song = [
  ['']
];
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

    if (process.send) {
      process.send({
        type: "syncSong",
        song: song,
        phase: phase,
        line: line,
        doblank: song_doblank
      });
    }


  });
}

function syncFromWorker(msg) {
  //syncData(msg.volume, msg.chapter, msg.verse, msg.doblank);
  //const requestData = JSON.parse(body);
  //println(body);
  song = msg.song;
  phase = msg.phase;
  line = msg.line;
  song_doblank = msg.doblank;
  broadcast();
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

function refactor(ALL_SONGS) {
  let vol = ALL_SONGS['nosong']['VOLUME'].content;
  for (let v = 0; v < vol.length; v++) {
    let k = vol[v][0];
    for (let i = 1; i < 1000; i++) {
      let idx = k + i;
      if (ALL_SONGS[idx]) {
        let tmp = ALL_SONGS[idx].content;
        delete ALL_SONGS[idx];
        ALL_SONGS[idx] = { "content": tmp };
      }
    }
  }

  //let keys = Object.keys(ALL_SONGS); keys.forEach(function (key, index) { console.log('"' + key + '"');});

}

function formatALL(fstream, ALL_SONGS) {
  fstream.write('{\n');
  let keys = Object.keys(ALL_SONGS);
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
  let txt = fs.readFileSync(path, 'utf8');//
  try {
    // 將讀取到的內容轉換為 JSON 物件
    let ALL_SONGS = JSON.parse(txt);
    handle(ALL_SONGS);
  } catch (parseError) {
    console.error('解析 JSON 檔案時發生錯誤:', parseError);
  }
}

function songjsonformat() {
  return;
  readAndAction(READ_SRC, (ALL_SONGS) => {
    refactor(ALL_SONGS);
    const writeStream = fs.createWriteStream(WRITE_SRC);
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
      case 'add':
        println('add start');
        readAndAction(READ_SRC, (ALL_SONGS) => {
          println('add in');
          if (ALL_SONGS[id]) {
            result = false;
            println('add exist return!');
            return;
          }
          ALL_SONGS[id] = opObj;
          println('add success');
          result = true;
          println('add save file');
          refactor(ALL_SONGS);
          const writeStream = fs.createWriteStream(WRITE_SRC);
          formatALL(writeStream, ALL_SONGS);
          writeStream.end(() => {
            console.log('檔案寫入完成!');
          });
          //res.setHeader('Content-Type', 'application/json');// 发送响应数据
          //res.end(JSON.stringify({ "state": "success" }));
        });
        println('add end');
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));

        break;
      case 'fix':
        readAndAction(READ_SRC, (ALL_SONGS) => {
          if (ALL_SONGS[id]) {
            ALL_SONGS[id].content = content;
          } else {
            ALL_SONGS[id] = opObj;
          }
          refactor(ALL_SONGS);
          const writeStream = fs.createWriteStream(WRITE_SRC);
          formatALL(writeStream, ALL_SONGS);
          writeStream.end(() => {
            console.log('檔案寫入完成!');
          });
        });
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        break;
      case 'del':
        readAndAction(READ_SRC, (ALL_SONGS) => {
          if (!ALL_SONGS[id]) return;
          delete ALL_SONGS[id];
          refactor(ALL_SONGS)
          const writeStream = fs.createWriteStream(WRITE_SRC);
          formatALL(writeStream, ALL_SONGS);
          writeStream.end(() => {
            console.log('檔案寫入完成!');
          });
        });
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        break;
    }

  });
}

function getInfo() {
  let info = [
    `<${song[0][0]}, ${phase}, ${line}, ${song_doblank}>`
  ];
  let i = 1;
  //<button onclick="controlParent('Bible')">📖</button>
  S_clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      info[i] = `<🎤 ${client._socket.remoteAddress}>`;
      i++;
    }
  });
  return info;
}

module.exports = {
  addClient,
  synclyrics,
  lyricsBaseAction,
  songjsonformat,
  syncFromWorker,
  getInfo
};
