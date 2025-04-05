const WebSocket = require('ws');
const urltool = require('url');

const c_clients_MAP = new Map();
const c_MAP = new Map();

var c_camera = new Map();

function syncData(usr, width, height, data) {
    c_MAP.set(usr,
        {
            w: width,
            h: height,
            content: db
        });
}

function getCameraObjStr(user) {
    let obj = c_MAP.get(user);
    if (obj != null) {
        return JSON.stringify({
            w: obj.w,
            h: obj.h,
            content: obj.content,
            user: user
        });
    }
    return JSON.stringify({
        w: 0,
        h: 0,
        content: null,
        user: user
    });
}

function syncFromWorker(msg) {
    syncData(msg.user, msg.volume, msg.chapter, msg.verse, msg.doblank);
    broadcast(msg.user);
}


function broadcast(user, msg) {
    let clients = c_clients_MAP.get(user);
    if (clients == null) return;
    //let data = getCameraObjStr(user);
    //print(` [ conn: ${clients.size} ] `);
    clients.forEach(function (client) {
        if (client.readyState === WebSocket.OPEN) {
            //print('[broadcast ' + user + ' ' + client._socket.remoteAddress + ']');
            client.send(msg, { binary: true });
        } else {
            clients.delete(client);
            //print(`[${user} ${client._socket.remoteAddress} removed]`);
        }
    });
}

function setCamera(usr, ws) {
    let _ws = c_camera.get(usr);
    if (_ws) {
        _ws.close();
    }
    c_camera.set(usr, ws);
    // 接收二進制消息
    ws.on('message', (message) => {
        if (message instanceof Buffer) {
            // 廣播二進制數據給所有其他客戶端
            broadcast('guest', message);
            /*
            clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message, { binary: true });
                }
            });
            */
            //ptlet('.' + message.length);
        }
    });

}

function addClient2Map(usr, ws) {
    let clients = c_clients_MAP.get(usr);
    if (clients) {
        clients.add(ws);
    } else {
        let _clients = new Set();
        c_clients_MAP.set(usr, _clients);
        _clients.add(ws);
    }
    
    
    ws.on('message', function incoming(message) { //print('[from client: ' + message + ']');
        println(`[client ${usr}: ${message}]`);
        //ws.send(getCameraObjStr(usr));//'Whatsup client! -- from server');
    });
    
    
}

function getInfo() {
    //let info = [`[${volume}, ${chapter}, ${verse}, ${doblank}]`];
    let info = [];
    let i = 0;
    c_clients_MAP.forEach((value, key) => {
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
    setCamera,
    syncFromWorker,
    getInfo
};
