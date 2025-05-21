const WebSocket = require('ws');
const fs = require('fs');
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
        this.camera = ws;
        // 接收二進制消息
        this.camera.on('message', (message) => {
            if (message instanceof Buffer) {
                               
                const buffer = Buffer.from(message);

                // 前 8 bytes 是 timestamp
                const timestamp = buffer.readBigUInt64BE(0);
                //const dateStr = new Date(Number(timestamp)).toISOString().replace(/[:.]/g, '-');
                
                let ct = Date.now();//console.log(`diff: ${ct} - ${timestamp} = ${ct - Number(timestamp)}`);
                if (ct - Number(timestamp) > 1000) {
                    console.log(`too old reject ${ct} - ${timestamp} = ${ct - Number(timestamp)}`);
                    return;
                }

                //const imageBuffer = buffer.slice(8);
                this.broadcast(message);
                
                if (process.send) {
                    process.send({
                        type: "syncCamera",
                        user: this.user,
                        content: message
                    });
                }
                
            }
        });
    
    }

    broadcast(msg) {
        this.clients.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                //print('[broadcast ' + this.user + ' ' + ws._socket.remoteAddress + ']');
                ws.send(msg, { binary: true });
            } else {
                this.clients.delete(ws);
                //print(`[${this.user} ${ws._socket.remoteAddress} removed]`);
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

function setCamera(usr, ws) {
    let obj = getObj(usr);
    obj.setCamera(ws);
}

function addClient2Map(user, ws) {
    let obj = getObj(user);
    obj.addClient2Map(ws);
}

function syncFromWorker(msg) {
    let obj = getObj(msg.user); //println(`#syncFromWorker ${msg.user}#`);
    obj.broadcast(msg.content);
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
        value.clients.forEach((client) => {
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

