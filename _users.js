const users = {
    tpcaog: '0223210665',
     jkpan: '0223210665'
};
// JWT 秘密
const SECRET_KEY = 'your_secret_key';
  
var jwt = null;

try {
    require.resolve('jsonwebtoken');
    println('jsonwebtoken Module exists');
    jwt = require('jsonwebtoken');
  } catch (err) {
    console.log('jsonwebtoken Module does not exist');
  }

