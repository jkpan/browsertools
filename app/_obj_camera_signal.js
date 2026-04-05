const WebSocket = require('ws');
const fs = require('fs');
const urltool = require('url');

const clients = new Set();

/*
wss.on("connection", ws => {
  clients.add(ws);

  ws.on("message", msg => {
    for (const c of clients) {
      if (c !== ws) c.send(msg.toString());
    }
  });

  ws.on("close", () => clients.delete(ws));
});
*/

function setCamera(ws) {
    clients.add(ws);
    ws.on("message", msg => {
        for (const c of clients) {
            console.log('_obj_camera_signal setCamera: ' + msg.toString());
            if (c !== ws) c.send(msg.toString());
        }
    });
    ws.on("close", () => clients.delete(ws));
}

function getInfo() {
    return [];
}

module.exports = {
    setCamera,
    getInfo
};


/*

const clients = new Map(); // id -> ws
let nextId = 1;

function setCamera(ws) {

    console.log('socket accept');

    const id = nextId++;
    clients.set(id, ws);
    ws.send(JSON.stringify({ type: "id", id }));

    ws.on("message", msg => {
        const data = JSON.parse(msg);
        const target = clients.get(data.to);
        if (target) {
            target.send(JSON.stringify(data));
        }

        //for (const c of clients) {
        //    console.log('_obj_camera_signal setCamera: ' + msg.toString());
        //    if (c !== ws) c.send(msg.toString());
        //}
    });

    ws.on("close", () => clients.delete(id));

}

*/