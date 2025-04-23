const WebSocket = require('ws');
const urltool = require('url');

const obj_clients_MAP = new Map();

class CameraObj {

    user = '';
    clients = new Set();
    camera = null;

    constructor(usr) {
        this.user = usr;
    }

    setCamera(ws) {
        if (this.camera && this.camera.readyState === WebSocket.OPEN) {
            this.camera.close();
        }
        // 接收二進制消息
        ws.on('message', (message) => {
            if (message instanceof Buffer) {
                // 廣播二進制數據給所有其他客戶端
                this.broadcast(message);
                //ptlet('.' + message.length);
                if (process.send) {
                    process.send({
                        type: "syncCamera",
                        user: usr,
                        content: message
                    });
                }
            }
        });
    
    }

    broadcast(msg) {
        this.clients.forEach(function (ws) {
            if (ws.readyState === WebSocket.OPEN) {
                //print('[broadcast ' + user + ' ' + client._socket.remoteAddress + ']');
                ws.send(msg, { binary: true });
            } else {
                this.clients.delete(client);
                //print(`[${user} ${client._socket.remoteAddress} removed]`);
            }
        });
    }

    addClient2Map(ws) {
        this.clients.add(ws);
        ws.on('message', (message) => { //print('[from client: ' + message + ']');
            println(`#client ${this.user}: ${message}#`);
            //ws.send(JSON.stringify(this.getBibleObjStr()));//'Whatsup client! -- from server');
        });
    }
}

function addClient2Map(user, ws) {
    let obj = getObj(user);
    obj.addClient2Map(ws);
}


function syncFromWorker(msg) {
    let obj = getObj(msg.user);
    println(`#syncFromWorker ${msg.user}#`);
    obj.broadcast(msg.content);
}

function setCamera(usr, ws) {
    let obj = getObj(usr);
    obj.setCamera(ws);
}


function getObj(usr) {
    let obj = obj_clients_MAP.get(usr);
    if (obj) return obj;
    obj = new CameraObj(usr);
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
                info[i] = `#${key}: ${client._socket.remoteAddress}#`;
                i++;
            }
        });
    });
    return info;
}

module.exports = {
    addClient2Map,
    setCamera,
    syncFromWorker,
    getInfo
};

