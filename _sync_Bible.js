const WebSocket = require('ws');
const urltool = require('url');

const B_clients_MAP = new Map();
const verse_MAP = new Map();

function syncData(usr, vol, chp, ver, db) {
    verse_MAP.set(usr,
        {
            vlm: vol,
            chp: chp,
            ver: ver,
            blank: db
        });
}

function getBibleObjStr(user) {
    let obj = verse_MAP.get(user);
    if (obj != null) {
        return JSON.stringify({
            vlm: obj.vlm,
            chp: obj.chp,
            ver: obj.ver,
            blank: obj.blank,
            user: user
        });
    }
    return JSON.stringify({
        vlm: 1,
        chp: 1,
        ver: 1,
        blank: 1,
        user: user
    });
}

function synscripture_get(url, res) {
    
    var requestData = urltool.parse(url, true).query;

    syncData(requestData.user, parseInt(requestData.vlm), parseInt(requestData.chp),
        parseInt(requestData.ver), parseInt(requestData.blank));

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.end('get done!\n');

    let obj = verse_MAP.get(requestData.user);
    if (obj == null) return;
    println(`[master: ${requestData.user} ${obj.vlm}, ${obj.chp}, ${obj.ver}, ${obj.blank}]`);//[Bible:' + volume +', '+ chapter + ', ' + verse + ',' + doblank + ']');
    broadcast(requestData.user);
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

        syncData(requestData.user, requestData.vlm, requestData.chp, requestData.ver, requestData.blank);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Content-Type', 'application/json');

        // 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));//res.end(JSON.stringify(queryResult));

        let obj = verse_MAP.get(requestData.user);
        if (obj == null) return;
        println(`[master ${requestData.user}: ${obj.vlm}, ${obj.chp}, ${obj.ver}, ${obj.blank}]`);//[Bible:' + volume +', '+ chapter + ', ' + verse + ',' + doblank + ']');
        //broadcast_Bible();
        broadcast(requestData.user);

        if (process.send) {
            process.send({
                type: "syncBible",
                volume: obj.vlm,
                chapter: obj.chp,
                verse: obj.ver,
                doblank: obj.blank,
                user: requestData.user
            });
        }

    });
}

function syncFromWorker(msg) {
    syncData(msg.user, msg.volume, msg.chapter, msg.verse, msg.doblank);
    broadcast(msg.user);
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
        res.end(getBibleObjStr(requestData.user));

    });
}

function broadcast(user) {
    let clients = B_clients_MAP.get(user);
    if (clients == null) return;
    let data = getBibleObjStr(user);
    print(` [ conn: ${clients.size} ] `);
    clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            print('[broadcast ' + user + ' ' + client._socket.remoteAddress + ']');
            client.send(data);
        } else {
            clients.delete(client);
            print(`[${user} ${client._socket.remoteAddress} removed]`);
        }
    });
}

function addClient2Map(usr, ws) {
    let clients = B_clients_MAP.get(usr);
    if (clients) {
        clients.add(ws);
    } else {
        let _clients = new Set();
        B_clients_MAP.set(usr, _clients);
        _clients.add(ws);
    }
    ws.on('message', function incoming(message) { //print('[from client: ' + message + ']');
        println(`[client ${usr}: ${message}]`);
        ws.send(getBibleObjStr(usr));//'Whatsup client! -- from server');
    });
}

function getInfo() {
    //let info = [`[${volume}, ${chapter}, ${verse}, ${doblank}]`];
    let info = [];
    let i = 0;
    B_clients_MAP.forEach((value, key) => {
        value.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                info[i] = `[📖 %{key}: ${client._socket.remoteAddress}]`;
                i++;
            }
        });
    });
    return info;
}

module.exports = {
    addClient2Map,
    synscripture,
    synscripture_get,
    restorescripture,
    syncFromWorker,
    getInfo
};
