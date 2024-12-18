const READ_SRC = 'songbase.json';
const WRITE_SRC = 'songbase.json';

const fs = require('fs');
var WebSocket = require('ws');

var song = [['']];

const S_clients_MAP = new Map();
const song_MAP = new Map();

function syncData(usr, song, phase, line, db) {
  let obj = {
    song: song,
    phase: phase,
    line: line,
    song_doblank: db
  };
  song_MAP.set(usr, obj);
}

function getSongObjStr(user) {
  let obj = song_MAP.get(user);
  if (obj == null)
    return JSON.stringify({
      song: [[""]],
      phase: 0,
      line: 0,
      blank: 0
    });
  return JSON.stringify({
    user: user,
    song: obj.song,
    phase: obj.phase,
    line: obj.line,
    blank: obj.song_doblank
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
    syncData(requestData.user,
      requestData.song,
      requestData.phase,
      requestData.line,
      requestData.blank);

    try {
      println(`<master ${requestData.user}: ${requestData.song[0][0]}, ${requestData.phase}, ${requestData.line}, ${requestData.blank}>`);
    } catch (err) {
      println(`<master: err ${requestData.phase}, ${requestData.line}, ${requestData.song_doblank}>`);
    }

    res.setHeader('Content-Type', 'application/json');

    // 发送响应数据
    res.end(JSON.stringify({ "state": "success" }));//res.end(JSON.stringify(queryResult));
    broadcast(requestData.user);

    let obj = song_MAP.get(requestData.user);
    if (obj == null) return;

    if (process.send) {
      process.send({
        type: "syncSong",
        song: obj.song,
        phase: obj.phase,
        line: obj.line,
        doblank: obj.song_doblank,
        user: requestData.user
      });
    }

  });
}

function syncFromWorker(msg) {
  syncData(msg.user, msg.song, msg.phase, msg.line, msg.doblank);
  broadcast(msg.user);
}

function broadcast(user) {
  let clients = S_clients_MAP.get(user);
  if (clients == null) return;
  let data = getSongObjStr(user);
  print(` < conn: ${clients.size} > `);
  clients.forEach(function (client) {
    if (client.readyState === WebSocket.OPEN) {
      print('<broadcast ' + user + ' ' + client._socket.remoteAddress + '>');
      client.send(data);
    } else {
      clients.delete(client);
      print(`<${user} ${client._socket.remoteAddress} removed>`);
    }
  });
}

function addClient2Map(usr, ws) {
  let clients = S_clients_MAP.get(usr);
  if (clients) {
    clients.add(ws);
  } else {
    let _clients = new Set();
    S_clients_MAP.set(usr, _clients);
    _clients.add(ws);
  }
  ws.on('message', function incoming(message) { //print('[from client: ' + message + ']');
    println(`<client ${usr}: ${message}>`);
    ws.send(getSongObjStr(usr));//'Whatsup client! -- from server');
  });
}

function getArrayDimension(arr) {
  if (Array.isArray(arr)) {
    return 1 + Math.max(...arr.map(getArrayDimension), 0);
  } else {
    return 0;
  }
}

function getInfo() {
  //let info = [`[${volume}, ${chapter}, ${verse}, ${doblank}]`];
  let info = [];
  let i = 0;
  S_clients_MAP.forEach((value, key) => {
    value.forEach(function (client) {
      if (client.readyState === WebSocket.OPEN) {
        info[i] = `<🎤 ${key}: ${client._socket.remoteAddress}>`;
        i++;
      }
    });
  });
  return info;
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
    ptlet(` idx: ${index}/${keys.length}`);
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
    let user = requestData.user;

    if (user == null) {
      res.setHeader('Content-Type', 'application/json');// 发送响应数据
      res.end(JSON.stringify({ "state": "fail" }));
      return;
    };

    let opObj = {
      "content": content
    };

    println('action: ' + action);
    println(JSON.stringify(content));

    switch (action) {
      case 'add':
        println('add start');
        readAndAction('./usr/' + user + '/' + READ_SRC, (ALL_SONGS) => {
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
          const writeStream = fs.createWriteStream('./usr/' + user + '/' + WRITE_SRC);
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
        readAndAction('./usr/' + user + '/' + READ_SRC, (ALL_SONGS) => {
          if (ALL_SONGS[id]) {
            ALL_SONGS[id].content = content;
          } else {
            ALL_SONGS[id] = opObj;
          }
          refactor(ALL_SONGS);
          const writeStream = fs.createWriteStream('./usr/' + user + '/' + WRITE_SRC);
          formatALL(writeStream, ALL_SONGS);
          writeStream.end(() => {
            console.log('檔案寫入完成!');
          });
        });
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        break;
      case 'del':
        readAndAction('./usr/' + user + '/' + READ_SRC, (ALL_SONGS) => {
          if (!ALL_SONGS[id]) return;
          delete ALL_SONGS[id];
          refactor(ALL_SONGS)
          const writeStream = fs.createWriteStream('./usr/' + user + '/' + WRITE_SRC);
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

module.exports = {
  addClient2Map,
  synclyrics,
  lyricsBaseAction,
  songjsonformat,
  syncFromWorker,
  getInfo
};
