
const CAMERAS = 4;
const msgs = ['.', '.', '.', '.', '.'];

//intercom下指令
function command(req, res) {
    let body = '';

    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
    });

    // 请求数据接收完成后的处理
    req.on('end', () => {
        // 解析请求数据
        const requestData = JSON.parse(body);

        println('{cmd:' + body + '}');

        if (requestData.camera == 0) {
            for (let i = 0; i < msgs.length; i++) msgs[i] = '.';
        } else {
            if (requestData.msg) {
                msgs[requestData.camera] = requestData.msg;
            } else {
                msgs[requestData.camera] = '.';
            }
        }

        res.setHeader('Content-Type', 'application/json');

        // 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));//res.end(JSON.stringify(queryResult));

    });
}

//intercom查目前所有指令
function query(req, res) {

    let body = '';
    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
    });

    // 请求数据接收完成后的处理
    req.on('end', () => {
        // 解析请求数据 const requestData = JSON.parse(body);

        print('{query}');

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ "state": msgs }));

    });
}

//intercom得到相機數量
function initui(req, res) {
    let body = '';
    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
    });

    // 请求数据接收完成后的处理
    req.on('end', () => {

        print('{initui}');

        res.setHeader('Content-Type', 'application/json');

        // 发送响应数据
        let obj = {
            "camera": CAMERAS,
            //"cmd" : COMMANDS
        };
        res.end(JSON.stringify(obj));
    });
}

//好像沒用到
function cmdAll(req, res) { //for M5Stick
    let body = '';
    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
    });

    // 请求数据接收完成后的处理
    req.on('end', () => {
        res.setHeader('Content-Type', 'text/html');

        let cc = '';
        for (let i = 1; i < msgs.length; i++) {
            cc += ' ' + msgs[i];
        }
        cc = cc.trim();
        res.end(cc);
    });
}

//intercom M5Stick取得指令
function cmd(req, res, _cma) {
    let body = '';
    // 接收请求的数据
    req.on('data', (data) => {
        body += data;
    });

    // 请求数据接收完成后的处理
    req.on('end', () => {

        print('.');

        res.setHeader('Content-Type', 'text/html');
        res.end(msgs[_cma]);
    });
}

module.exports = {
    query,
    command,
    cmdAll,
    cmd,
    initui
};