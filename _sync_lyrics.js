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

module.exports = {
    addClient,
    synclyrics
};
