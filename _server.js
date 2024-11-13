const http = require('http');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// 模擬用戶資料庫
const users = {
    user1: 'password1',
    user2: 'password2'
};

// JWT 秘密
const SECRET_KEY = 'your_secret_key';

//讀檔輸出
function responseFile(filePath, res) {
    fs.readFile(filePath, (err, content) => {
        if (err) { // 若檔案不存在，回傳404 Not Found狀態碼
            res.writeHead(404);
            res.end('404 Not Found');
        } else { // 回傳200 OK狀態碼及HTML內容
            res.writeHead(200, { 'Content-Type': 'text/html' });//; charset = UTF-8
            res.write(content);
            res.end();
            //print('(file:' + filePath + ')');
        }
    });
}

// 解析請求數據
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
    });
}

// 建立伺服器
const server = http.createServer(async (req, res) => {
    console.log(req.url);
    // 處理登入請求
    if (req.method === 'POST' && req.url === '/login') {
        try {
            const { username, password } = await parseBody(req);

            console.log('[' + username + ', ' + password + ']');

            // 驗證用戶
            if (users[username] && users[username] === password) {
                // 成功登入，生成 JWT
                const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token }));
            } else {
                // 驗證失敗
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Server error' }));
        }
    } // 保護資源的路由
    else if (req.method === 'GET' && req.url === '/protected') {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log("authHeader : " + authHeader);
        console.log("     token : " + token);

        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Token not provided' }));
        }

        // 驗證 token
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid token' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Hello, ${user.username}!` }));
        });
    }

    // 其他路由
    else {
        const filePath = `.${req.url}`;
        responseFile(filePath, res);
        //res.writeHead(404, { 'Content-Type': 'application/json' });
        //res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


/*
function getValues() {
    return {
        first: 1,
        second: 2,
    }
}

const {first, second} = getValues()

console.log(first + ',  ' + second);

function test(req) {
    return new Promise((resolve, reject) => {
        let body = req;
        try {
            resolve(body);//JSON.parse(body));
        } catch (error) {
            reject(error);
        }
    });
}

const xxx = test({ user: "jkpan", 
                              passd: "admin"});
function ppp() {
    //console.log(user +' ... '+ passd);
    console.log(xxx[1]);
}

setTimeout(ppp, 2.0);
*/

