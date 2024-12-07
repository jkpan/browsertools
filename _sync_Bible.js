const WebSocket = require('ws');
const urltool = require('url');

const B_clients = new Set();

var volume = 1;
var chapter = 0;
var verse = 0;
var doblank = 0;

//pid = process.pid;

function syncData(vol, chp, ver, db) {
    volume = vol;
    chapter = chp;
    verse = ver;
    doblank = db;
}
function getBibleObjStr() {
    return JSON.stringify({
        vlm: volume,
        chp: chapter,
        ver: verse,
        blank: doblank
    });
}

function synscripture_get(url) {

    var requestData = urltool.parse(url, true).query;

    syncData(parseInt(requestData.vlm), parseInt(requestData.chp),
        parseInt(requestData.ver), parseInt(requestData.blank));

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.end('get done!\n');
    println(`[[master: ${volume}, ${chapter}, ${verse}, ${doblank}]]`);//[Bible:' + volume +', '+ chapter + ', ' + verse + ',' + doblank + ']');
    broadcast();
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

        syncData(requestData.vlm, requestData.chp, requestData.ver, requestData.blank);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Content-Type', 'application/json');

        // 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));//res.end(JSON.stringify(queryResult));

        println(`[master: ${volume}, ${chapter}, ${verse}, ${doblank}]`);//[Bible:' + volume +', '+ chapter + ', ' + verse + ',' + doblank + ']');
        //broadcast_Bible();
        broadcast();

        if (process.send) {
            process.send({
                type: "syncBible",
                volume: volume,
                chapter: chapter,
                verse: verse,
                doblank: doblank
            });
        }

    });
}

function syncFromWorker(msg) {
    syncData(msg.volume, msg.chapter, msg.verse, msg.doblank);
    broadcast();
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

        ptlet('-');
        // 发送响应数据
        res.end(getBibleObjStr());

    });
}

function broadcast() {
    let data = getBibleObjStr();
    print(` [ conn: ${B_clients.size} ] `);
    B_clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            print('[broadcast ' + client._socket.remoteAddress + ']');
            client.send(data);
        } else {
            B_clients.delete(client);
            print('[' + client._socket.remoteAddress + ' removed]');
        }
    });
}

function addClient(ws) {
    B_clients.add(ws);
    ws.on('message', function incoming(message) { //print('[from client: ' + message + ']');
        println(`[client: ${message}]`);
        ws.send(getBibleObjStr());//'Whatsup client! -- from server');
    });
}

function getInfo() {
    let info = [
        `[${volume}, ${chapter}, ${verse}, ${doblank}]`
    ];
    let i = 1;
    //<button onclick="controlParent('Bible')">📖</button>
    B_clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            info[i] = `[📖 ${client._socket.remoteAddress}]`;
            i++;
        }
    });
    return info;
}

module.exports = {
    addClient,
    synscripture,
    synscripture_get,
    restorescripture,
    syncFromWorker,
    getInfo
};
