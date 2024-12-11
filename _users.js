//const users = require('/users/account')

const users = {
  "tpcaog" : "0223210665",
  "jkpan" : "xx"
};

var doauth = false;

// JWT 秘密
const SECRET_KEY = '0223210665';

var jwt = null;

try {
  require.resolve('jsonwebtoken');
  console.log('jsonwebtoken Module exists');
  jwt = require('jsonwebtoken');
} catch (err) {
  console.log('jsonwebtoken Module does not exist');
}

function setDoAuth(_auth) {
  doauth = _auth;
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

async function auth(req, res) {
  try {

    //{"username":"jkpan"}
    if (!doauth) { //const token = jwt.sign({ "username":"guest" }, SECRET_KEY, { expiresIn: '10h' });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ "state": 1,
                               "username": "guest",
                               "token": "null"
                             }));
      return;
    }
    
    const { username, password } = await parseBody(req);

    console.log("user : " + username + ", " + "pwd : " + password);

    // 驗證用戶
    if (users[username] && users[username] === password) {
      console.log("user passwd success");
      // 成功登入，生成 JWT
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        "state": 1,
        "username": username,
        "token": token 
      }));
    } else {
      console.log("user passwd fail");
      // 驗證失敗
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        "state": -1,
        des: 'Invalid credentials' }));
    }
  } catch (error) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      "state": -1,
      des: 'Server error: ' + error }));
  }

}

function chk(req, res) {

  if (!doauth) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      state: 1,
      username: "guest" //message: "Hello, guest!"
    }));
    return;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  //console.log("authHeader : " + authHeader);console.log("     token : " + token);

  if (!token) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ state:-1, des: 'Token not provided' }));
    return;
  }

  // 驗證 token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      println('err : ' + err);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        state: -1,
        des: err
      }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      state: 1, 
      username: `${user.username}`, //message: `Hello, ${user.username}!`
      des: "auth success"
    }));
  });

}

function adduser(username, password) {
  if (username.toLowerCase() == 'guest') return { state:-1, des:"name exist"};
  return { state:1, 
           username: username, 
           des:"name exist"};
}

module.exports = {
  auth,
  chk,
  adduser,
  setDoAuth
};
