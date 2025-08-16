const fs = require('fs'); //const users = { "user1" : "123", "user2" : "231", "user3" : "312" };

var users = {}
var doauth = false;

// JWT 秘密
const SECRET_KEY = '0223210665';

var jwt = null;

try {
  require.resolve('jsonwebtoken'); //console.log('jsonwebtoken Module exists');
  jwt = require('jsonwebtoken');
} catch (err) {
  console.log('jsonwebtoken Module does not exist');
}

/**
 * 設定是否啟用驗證
 * @param {boolean} _auth - 是否啟用驗證
 * @returns {boolean} - 返回當前的驗證狀態 
 */
function setDoAuth(_auth) {
  doauth = _auth;
  if (doauth) {
    try {
      let txt = fs.readFileSync('./users/accounts.json', 'utf8');
      users = JSON.parse(txt); //console.log(users);
    } catch (parseError) {
      console.error('解析 JSON 檔案時發生錯誤:', parseError);
    }
  }
  return doauth;
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

function resposeGuest(res, level) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    "state": level,
    "username": "guest",
    "token": "null"
  }));
}

async function auth(req, res) {

  try {

    const { username, password } = await parseBody(req);

    //權限全開的guest (state = 1)
    if (!doauth) { //const token = jwt.sign({ "username":"guest" }, SECRET_KEY, { expiresIn: '10h' });
      println('auth : no auth {guest all state 1}');
      resposeGuest(res, 1);
      return;
    }

    //有限制的guest (state = 2)
    if (username === 'guest') {
      println('auth : auth but guest {guest helf state 2}');
      resposeGuest(res, 2);
      return;
    }

    console.log("user : " + username + ", " + "pwd : " + password);

    // 驗證用戶
    if (users[username] && users[username] === password) {
      println('auth : auth success {user all state 1}');
      // 成功登入，生成 JWT
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        "state": 1,
        "username": username,
        "token": token
      }));
    } else {
      //console.log("user passwd fail");
      println('auth : auth fail {login fail state -1}');
      // 驗證失敗
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        "state": -1,
        des: 'Login fail'
      }));
    }
  } catch (error) {
    println('auth : system fail { system fail state 0}');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      "state": 0,
      des: 'Exception: ' + error
    }));
  }

}

function chk(req, res) {

  if (!doauth) {
    println('chk : no auth {guest all state 1}');
    resposeGuest(res, 1);
    return;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //console.log("authHeader : " + authHeader);console.log("     token : " + token);

  if (!token) {
    println('chk : auth but token fail {guest helf state 2}');
    //res.writeHead(200, { 'Content-Type': 'application/json' });
    //res.end(JSON.stringify({ state:-1, des: 'Token not provided' }));
    resposeGuest(res, 2);
    return;
  }

  // 驗證 token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      println('err : ' + err);
      /*
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        state: -1,
        des: err
      }));
      */
      println('chk : auth but login fail {guest helf state 2}');
      resposeGuest(res, 2);
      return;
    }
    println('chk : auth success {user all state 1}');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      state: 1,
      username: `${user.username}`, //message: `Hello, ${user.username}!`
      des: "auth success"
    }));
  });

}

function adduser(username, password) {
  if (username.toLowerCase() == 'guest') return { state: -1, des: "name exist" };
  return {
    state: 1,
    username: username,
    des: "name exist"
  };
}

module.exports = {
  auth,
  chk,
  adduser,
  setDoAuth
};
