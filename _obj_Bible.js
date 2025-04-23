const WebSocket = require('ws');
const urltool = require('url');

const obj_clients_MAP = new Map();

class BibleObj {

    vlm = 1;
    chp = 1;
    ver = 1;
    blank = 1;
    user = '';
    clients = new Set();

    constructor(usr) {
        this.user = usr;
    }

    syncData(vol, chp, ver, db) {
        this.vlm = vol;
        this.chp = chp;
        this.ver = ver;
        this.blank = db;
    }

    getBibleObjStr() {
        return {
            type: "syncBible",
            vlm: this.vlm,
            chp: this.chp,
            ver: this.ver,
            blank: this.blank,
            user: this.user
        };
    }

    synscripture_get(url, res) {

        var requestData = urltool.parse(url, true).query;

        this.syncData(parseInt(requestData.vlm),
            parseInt(requestData.chp),
            parseInt(requestData.ver),
            parseInt(requestData.blank));

        res.writeHead(200, { 'Content-Type': 'text/plain' });

        res.end('get done!\n');

        this.broadcast();
        if (process.send) {
            process.send(this.getBibleObjStr());
        }
    }

    broadcast() {
        let data = JSON.stringify(this.getBibleObjStr());
        this.clients.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                print(`[send ${this.user} ${ws._socket.remoteAddress}]`);
                ws.send(data);
            } else {
                this.clients.delete(ws);
                print(`[remove ${this.user} ${ws._socket.remoteAddress}]`);
            }
        });
    }

    addClient2Map(ws) {
        this.clients.add(ws);
        ws.on('message', (message)=> { //print('[from client: ' + message + ']');
            println(`[client ${this.user}: ${message}]`);
            ws.send(JSON.stringify(this.getBibleObjStr()));//'Whatsup client! -- from server');
        });
    }

}

function addClient2Map(user, ws) {
    let obj = getObj(user);
    obj.addClient2Map(ws);
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

        println(`[restorescripture ${requestData.user}]`);
        // 发送响应数据
        let obj = getObj(requestData.user);
        res.end(JSON.stringify(obj.getBibleObjStr()));

    });
}

function syncFromWorker(msg) {
    let obj = getObj(msg.user);
    println(`[syncFromWorker ${msg.user}]`);
    obj.syncData(msg.vlm, msg.chp, msg.ver, msg.blank);
    obj.broadcast();
}

function synscripture(req, res) {
    let body = '';

    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
    });

    // 请求数据接收完成后的处理
    req.on('end', () => {

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Content-Type', 'application/json');

        // 解析请求数据
        const requestData = JSON.parse(body);

        let obj = getObj(requestData.user);
        obj.syncData(requestData.vlm, requestData.chp, requestData.ver, requestData.blank);
        res.end(JSON.stringify({ "state": "success" }));//res.end(JSON.stringify(queryResult));

        println(`[synscripture ${requestData.user}: ${obj.vlm}, ${obj.chp}, ${obj.ver}, ${obj.blank}]`);//[Bible:' + volume +', '+ chapter + ', ' + verse + ',' + doblank + ']');
        
        obj.broadcast();

        if (process.send) {
            process.send(obj.getBibleObjStr());
        }

    });
}

function synscripture_get(url, res) {
    var requestData = urltool.parse(url, true).query;
    let obj = getObj(requestData.user);
    obj.synscripture_get(url, res);
}

function getInfo() {
    let info = [];
    let i = 0;
    obj_clients_MAP.forEach((value, key) => {
        value.clients.forEach(function (client) {
            if (client.readyState === WebSocket.OPEN) {
                info[i] = `[${key}: ${client._socket.remoteAddress}]`;
                i++;
            }
        });
    });
    return info;
}

function getObj(usr) {
    let obj = obj_clients_MAP.get(usr);
    if (obj) return obj;
    obj = new BibleObj(usr);
    obj_clients_MAP.set(usr, obj);
    return obj;
}

module.exports = {
    syncFromWorker,
    addClient2Map,
    restorescripture,
    synscripture_get,
    synscripture,
    getInfo
};