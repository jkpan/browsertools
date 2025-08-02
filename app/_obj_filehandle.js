const http = require('http');
const fs = require('fs');
const path = require('path');
const { formidable } = require('formidable');

function listunderfolder(folder, res) {
  let obj = {files:[], folders:[], state: ''};
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

// 建立 uploads 資料夾
const uploadDir = './users/uploads'//path.join('', 'uploads');
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
        listunderfolder(uploadDir, res);
        return;
      case 'listfiles':
        listunderfolder(uploadDir + '/' + p1);
        return;
      case 'addfolder':
        let dir = uploadDir + '/' + p1;//'./users/uploads'//path.join('', 'uploads');
        if (!fs.existsSync(dir))
          fs.mkdirSync(dir);
        println(action + ' end');
        res.setHeader('Content-Type', 'application/json');// 发送响应数据
        res.end(JSON.stringify({ "state": "success" }));
        return;
    }
  });
}

function uploadFile(req, res) {

  if (req.method != 'POST') {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    multiples: true,
  });

  println('uploadFile ...');

  let today = getToday();
  // 建立 uploads 資料夾
  let dir = uploadDir + '/' + today;//'./users/uploads'//path.join('', 'uploads');
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

  form.parse(req, (err, fields, files) => {

    println('form.parse ...');

    if (err) {
      res.writeHead(500);
      return res.end('Upload failed.');
    }

    const uploaded = Array.isArray(files.file) ? files.file : [files.file];

    const promises = uploaded.map(file => {
      const oldPath = file.filepath;
      const newPath = path.join(dir, file.originalFilename || 'upload_' + Date.now());
      println('uploaded.ma ...' + oldPath + ' ... ' + newPath);
      return fs.promises.rename(oldPath, newPath);
    });

    Promise.all(promises)
      .then(() => {
        res.writeHead(200);
        println('Upload successful.');
        res.end('Upload successful.');
      })
      .catch(() => {
        res.writeHead(500);
        println('Error saving file.');
        res.end('Error saving file.');
      });

    println('form.parse ... end.');
  });

  println('uploadFile ...end');

}

function getInfo() {
  return '';
}

module.exports = {
  uploadFile,
  handleFile,
  getInfo
};

