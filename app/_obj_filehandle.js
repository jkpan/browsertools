const http = require('http');
const fs = require('fs');
const path = require('path');
const { formidable } = require('formidable');
const { syncBuiltinESMExports } = require('module');

// 建立 uploads 資料夾
const uploadDir = './users/uploads'//path.join('', 'uploads');

function syncListunderfolder(folder, res) {

  let obj = {
    files: [],
    folders: [],
    folder: "",
    state: 0,
    des: ""
  };
  try {
    obj.folder = folder;
    obj.des = "";
    if (folder == null)
      folder = uploadDir;
    else
      folder = uploadDir + '/' + folder;

    // 使用同步方法
    const files = fs.readdirSync(folder);
    files.forEach(file => {
      const itemPath = path.join(folder, file);
      const stats = fs.statSync(itemPath);
      if (file.startsWith('.')) return;
      if (stats.isFile()) {
        obj['files'].push(`${file}`);
      } else if (stats.isDirectory()) {
        //if (file.length != 8) return; //modify later
        obj['folders'].push(`${file}`);
      }
    });

    obj['state'] = 1;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(obj));

  } catch (err) {
    console.error('讀取資料夾錯誤:', err);
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      obj['state'] = -1;
      obj['des'] = '讀取資料夾失敗';
      res.end(JSON.stringify(obj));
    }
  }

}

/*
function listunderfolder(folder, res) {
  let obj = { files: [], folders: [], state: '' };
  fs.readdir(folder, (err, items) => {
    println('start read path ' + folder);
    if (err) { //console.error('Error reading directory:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: '讀取資料夾失敗' }));
      return;
    } //console.log('Files and folders in the directory:');
    items.forEach(item => {
      println('start item loop ');
      const itemPath = path.join(folder, item);
      fs.stat(itemPath, (statErr, stats) => {
        if (statErr) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '讀取資料夾失敗' }));
          return;
        }
        if (stats.isFile()) {
          console.log(`- File: ${item}`);
          obj['files'].push(`${item}`);
        } else if (stats.isDirectory()) {
          console.log(`- Folder: ${item}`);
          obj['folders'].push(`${item}`);
        }
      });
    });
    println('before res: ' + JSON.stringify(obj));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(obj));
  });
  console.log("listunderfolder end :" + folder);
}
*/

function getCurrent() {

  const now = new Date();
  // Example: YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const mileseconds = String(now.getMilliseconds()).padStart(3, '0');

  const formattedDate = `${year}${month}${day}-${hours}${minutes}${seconds}.${mileseconds}`;
  console.log(formattedDate);
  return formattedDate;
}

function getToday() {
  const now = new Date();
  // Example: YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;
  console.log(formattedDate); // e.g., 2025-07-18
  return formattedDate;
}


if (!fs.existsSync(uploadDir))
  fs.mkdirSync(uploadDir);

function handleFile(req, res) {
  let body = '';
  // 接收请求的数据
  req.on('data', (data) => {
    body += data;
  });

  // 请求数据接收完成后的处理
  req.on('end', () => {
    // 解析请求数据
    const requestData = JSON.parse(body);
    //println(body);

    let action = requestData.action;
    let p1 = requestData.p1;
    //let user = requestData.user;

    /*
    if (user == null) {
      res.setHeader('Content-Type', 'application/json');// 发送响应数据
      res.end(JSON.stringify({ "state": "fail" }));
      return;
    };
    */

    println('action: ' + action + ', ' + p1);

    switch (action) {
      case 'listfolders':
        syncListunderfolder(null, res);//listunderfolder(uploadDir, res);
        return;
      case 'listfiles':
        syncListunderfolder(p1, res);
        return;
      case 'addurl':
        try {
          let dir = makeTodayFolder();
          let p2 = requestData.p2;
          const newPath = path.join(dir, p1 + '.url.txt');
          println('[addurl] ' + p2 + " [save to] " + newPath);
          fs.writeFile(newPath, p2, 'utf8', (err) => {
            if (err) {
              res.setHeader('Content-Type', 'application/json');// 发送响应数据
              res.end(JSON.stringify({ "state": -1 }));
              println('#上傳# ' + err);
              return 
            }
            res.setHeader('Content-Type', 'application/json');// 发送响应数据
            res.end(JSON.stringify({ "state": 1 }));
          });
        } catch (err) {
          res.setHeader('Content-Type', 'application/json');// 发送响应数据
          res.end(JSON.stringify({ "state": -1 }));
        }
        return;
      case 'delfile': {
        try {
          const u = new URL(p1);
          let file = '.' + u.pathname;//'./users/uploads'//path.join('', 'uploads');
          file = decodeURIComponent(file); //if (fs.existsSync(file)) fs.remove(file);
          fs.unlinkSync(file);
          println('#上傳# ' + file + ' deleted successfully');
          res.setHeader('Content-Type', 'application/json');// 发送响应数据
          res.end(JSON.stringify({ "state": 1 }));
        } catch (err) {
          res.setHeader('Content-Type', 'application/json');// 发送响应数据
          res.end(JSON.stringify({ "state": -1 }));
        }

      }
        return;
      /*
      case 'addfolder': {
        let dir = uploadDir + '/' + p1;//'./users/uploads'//path.join('', 'uploads');
        if (!fs.existsSync(dir))
          fs.mkdirSync(dir);
        println(action + ' end');
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        return;
      }
      */
    }
  });
}

function makeTodayFolder() {
  let today = getToday();
  // 建立 uploads 資料夾
  let dir = uploadDir + '/' + today;//'./users/uploads'//path.join('', 'uploads');
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir);
  return dir;
}

function uploadFile(req, res) {

  if (req.method != 'POST') {
    res.writeHead(404);
    res.end('Not Found');
    println('#上傳# ' + " not 'POST'");
    return;
  }

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    multiples: true,
    maxFileSize: 2000 * 1024 * 1024 // 2000MB
    //maxFields: 1000,
    //maxFieldsSize: 20,971,520,
    //maxFileSize: 209715200,
  });

  println('#上傳# uploadFile ...');

  let dir = makeTodayFolder();

  form.parse(req, (err, fields, files) => {

    println('#上傳# form.parse ...');

    if (err) {
      res.writeHead(500);
      println('#上傳# ' + err);
      return res.end('Upload failed.');
    }

    const uploaded = Array.isArray(files.file) ? files.file : [files.file];

    const promises = uploaded.map(file => {
      const oldPath = file.filepath;
      const newPath = path.join(dir, file.originalFilename || 'upload_' + Date.now());
      //const ext = path.extname(file.originalFilename);
      //const newPath = path.join(dir, 'upload_' + getCurrent() + ext);
      println('#上傳# ' + oldPath + ' ... ' + newPath);
      return fs.promises.rename(oldPath, newPath);
    });

    Promise.all(promises)
      .then(() => {
        res.writeHead(200);
        println('#上傳# Upload successful.');
        res.end('Upload successful.');
      })
      .catch((err) => {
        res.writeHead(500);
        println('#上傳# ' + err);
        res.end('#上傳# ' + err);
      });

    println('#上傳# ... end.');
  });

  println('#上傳# ...end');

}

function getInfo() {
  return '';
}

module.exports = {
  uploadFile,
  handleFile,
  getInfo
};

