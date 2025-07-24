const READ_SRC = 'songbase.json';
const WRITE_SRC = 'songbase.json';

const fs = require('fs');
var WebSocket = require('ws');

const obj_clients_MAP = new Map();

class LyricsObj {

  user = '';
  content = {};
  clients = new Set();

  constructor(usr) {
    this.user = usr;
  }

  getSongObjStr() {
    return {
      type: "syncSong",
      user: this.user,
      song: this.content.song,
      phase: this.content.phase,
      line: this.content.line,
      blank: this.content.song_doblank
    };
  }

  broadcast() {
    let data = JSON.stringify(this.getSongObjStr());
    //print(` <conn: ${clients.size}> `);
    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        print('<broadcast ' + this.user + ' ' + ws._socket.remoteAddress + '>');
        ws.send(data);
      } else {
        print(`<remove ${this.user} ${ws._socket.remoteAddress}>`);
        this.clients.delete(ws);
      }
    });
  }

  syncData(song, phase, line, db) {
    this.content = {
      song: song,
      phase: phase,
      line: line,
      song_doblank: db
    };
  }

  checkremoveClient() {
    this.clients.forEach((ws) => {
      if (ws.readyState != WebSocket.OPEN) {
        print(`<remove ${this.user} ${ws._socket.remoteAddress}>`);
        this.clients.delete(ws);
      }
    });
  }

  addClient2Map(ws) {
    this.checkremoveClient();
    this.clients.add(ws);
    ws.on('message', (message) => { //print('[from client: ' + message + ']');
      println(`<client ${this.user}: ${message}>`);
      ws.send(JSON.stringify(this.getSongObjStr()));//'Whatsup client! -- from server');
    });
  }


}

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

    let obj = getObj(requestData.user);
    obj.syncData(requestData.song, requestData.phase,
      requestData.line, requestData.blank);

    try {
      println(`<master ${requestData.user}: ${requestData.song[0][0]}, ${requestData.phase}, ${requestData.line}, ${requestData.blank}>`);
    } catch (err) {
      println(`<master: err ${requestData.phase}, ${requestData.line}, ${requestData.song_doblank}>`);
    }

    res.setHeader('Content-Type', 'application/json');

    // 发送响应数据
    res.end(JSON.stringify({ "state": "success" }));//res.end(JSON.stringify(queryResult));
    obj.broadcast();

    if (process.send) {
      process.send(obj.getSongObjStr());
    }

  });
}


function syncFromWorker(msg) {
  let obj = getObj(msg.user);
  println(`<syncFromWorker ${msg.user}>`);
  obj.syncData(msg.song, msg.phase, msg.line, msg.blank);
  obj.broadcast();
}

function addClient2Map(user, ws) {
  let obj = getObj(user);
  obj.addClient2Map(ws);
}

function getObj(usr) {
  let obj = obj_clients_MAP.get(usr);
  if (obj) return obj;
  obj = new LyricsObj(usr);
  obj_clients_MAP.set(usr, obj);
  return obj;
}

function getInfo() {
  //let info = [`[${volume}, ${chapter}, ${verse}, ${doblank}]`];
  let info = [];
  let i = 0;
  obj_clients_MAP.forEach((value, key) => {
    value.clients.forEach(function (client) {
      if (client.readyState === WebSocket.OPEN) {
        info[i] = `<${key}: ${client._socket.remoteAddress}>`;
        i++;
      }
    });
  });
  return info;
}

//遞迴
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

function formatdefault(fstream, ALL_SONGS) {
  //fstream.write(JSON.stringify(ALL_SONGS, null, "\t"));
  fstream.write(JSON.stringify(ALL_SONGS, null, " "));
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
        readAndAction('./users/' + READ_SRC, (ALL_SONGS) => {
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
          const writeStream = fs.createWriteStream('./users/' + WRITE_SRC);
          formatdefault(writeStream, ALL_SONGS);
          //formatALL(writeStream, ALL_SONGS);
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
        readAndAction('./users/' + READ_SRC, (ALL_SONGS) => {
          if (ALL_SONGS[id]) {
            ALL_SONGS[id].content = content;
          } else {
            ALL_SONGS[id] = opObj;
          }
          refactor(ALL_SONGS);
          const writeStream = fs.createWriteStream('./users/' + WRITE_SRC);
          formatdefault(writeStream, ALL_SONGS);
          //formatALL(writeStream, ALL_SONGS);
          writeStream.end(() => {
            console.log('檔案寫入完成!');
          });
        });
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        break;
      case 'del':
        readAndAction('./users/' + READ_SRC, (ALL_SONGS) => {
          if (!ALL_SONGS[id]) return;
          delete ALL_SONGS[id];
          refactor(ALL_SONGS)
          const writeStream = fs.createWriteStream('./users/' + WRITE_SRC);
          formatdefault(writeStream, ALL_SONGS);
          //formatALL(writeStream, ALL_SONGS);
          writeStream.end(() => {
            console.log('檔案寫入完成!');
          });
        });
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        break;
      case 'addCata':
        println('addCata start');
        readAndAction('./users/' + READ_SRC, (ALL_SONGS) => {
          println('addCata in');
          /*
          for (let i=0;i<VOLUME_CONTENT_ARRAY.length;i++) {
            if (VOLUME_CONTENT_ARRAY[i][0] == content[0]) { //åprintln('addcata exist return!');
              res.setHeader('Content-Type', 'application/json')å; res.end(JSON.stringify({ "state": "fail" }));
              return;              
            }
          }
          */
          let len = ALL_SONGS['nosong']['VOLUME']['content'].length;
          ALL_SONGS['nosong']['VOLUME']['content'][len] = content;

          println('addCata success');
          result = true;
          println('addCata save file');
          refactor(ALL_SONGS);
          const writeStream = fs.createWriteStream('./users/' + WRITE_SRC);
          formatdefault(writeStream, ALL_SONGS);
          //formatALL(writeStream, ALL_SONGS);
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
    }

  });
}

module.exports = {
  addClient2Map,
  synclyrics,
  lyricsBaseAction,
  //songjsonformat,
  syncFromWorker,
  getInfo
};


/*
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
*/
/*
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
*/