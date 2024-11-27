//const users = require('/users/account')

const users = {
  "tpcaog" : "0223210665",
  "jkpan" : "xx"
};

// JWT 秘密
const SECRET_KEY = 'your_secret_key';

var jwt = null;

try {
  require.resolve('jsonwebtoken');
  console.log('jsonwebtoken Module exists');
  jwt = require('jsonwebtoken');
} catch (err) {
  console.log('jsonwebtoken Module does not exist');
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

    const { username, password } = await parseBody(req);

    console.log("user : " + username + ", " + "pwd : " + password);

    // 驗證用戶
    if (users[username] && users[username] === password) {
      console.log("user passwd success");
      // 成功登入，生成 JWT
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
      console.log("token : " + token);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token }));
    } else {
      console.log("user passwd fail");
      // 驗證失敗
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Server error' }));
  }

}

function chk(req, res) {

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

module.exports = {
  auth,
  chk
};
