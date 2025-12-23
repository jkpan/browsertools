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