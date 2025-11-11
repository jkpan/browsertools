const http = require('http');
const fs = require('fs');
const path = require('path');
const { formidable } = require('formidable');

// 建立 uploads 資料夾
const uploadDir = './users/sheetmusic'//path.join('', 'uploads');

function filter(songid, res) {

    let obj = {
        files: [],
        folder: "",
        state: 0,
        des: ""
    };

    try {
        obj.folder = uploadDir;
        obj.des = "";
        // 使用同步方法

        const files = fs.readdirSync(obj.folder);
        files.forEach(file => {
            const itemPath = path.join(obj.folder, file);
            const stats = fs.statSync(itemPath);
            //if (file.startsWith('.')) return;
            if (stats.isFile() && file.startsWith(songid + '__')) {
                obj['files'].push(`${file}`);
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

function delfile(file) {
    try {
        // Check if the file exists
        file = decodeURIComponent(file);
        println('##delfile ' + file);
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
        //await fs.access(file, null);
        // If it exists, delete the file
        
        println(`File deleted successfully: ${file}`);

    } catch (err) {
        if (err.code === 'ENOENT') {
            println(`File does not exist: ${file}`);
        } else {
            println(`Error processing file ${file}:`, err);
        }
    }

    //
    //file = decodeURIComponent(file); //if (fs.existsSync(file)) fs.remove(file);
    //fs.unlinkSync(file);
}

function removeFileByPrefix(prefix) {
    try {
        // 使用同步方法
        const files = fs.readdirSync(uploadDir);
        files.forEach(file => {
            const itemPath = path.join(uploadDir, file);
            const stats = fs.statSync(itemPath); 
            if (file.startsWith('.')) return;
            if (stats.isFile() && file.startsWith(prefix)) {
                delfile(itemPath);
            }
        });

    } catch (err) {
        println('讀取資料夾錯誤:', err);
    }
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

        println('action: ' + action);
        println('    p1: ' + p1);

        switch (action) {
            case 'listbysongid': //println('p1: ' + p1);
                filter(p1, res);
                return;
            case 'delfile':
                try {
                    //const u = new URL(p1);
                    //let file = '.' + u.pathname;//'./users/uploads'//path.join('', 'uploads');
                    //delfile(file);
                    removeFileByPrefix(p1);
                    //file = decodeURIComponent(file); //if (fs.existsSync(file)) fs.remove(file);
                    //fs.unlinkSync(file);
                    println('sheet# ' + p1 + '... deleted successfully');
                    res.setHeader('Content-Type', 'application/json');// 发送响应数据
                    res.end(JSON.stringify({ "state": 1 }));
                } catch (err) {
                    res.setHeader('Content-Type', 'application/json');// 发送响应数据
                    res.end(JSON.stringify({ "state": -1 }));
                }
                return;
        }
    });
}

function uploadFile(req, res) {

    if (req.method != 'POST') {
        res.writeHead(404);
        res.end('Not Found');
        println("<<上傳>> : not 'POST'");
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

    println('<<上傳>> uploadFile ...');

    form.parse(req, (err, fields, files) => {

        println('<<上傳>> form.parse ...');

        if (err) {
            res.writeHead(500);
            println('<<上傳>> ' + err);
            return res.end('Upload failed.');
        }

        const uploaded = Array.isArray(files.file) ? files.file : [files.file];

        const promises = uploaded.map(file => {
            
            
            try {
                
                const oldPath = file.filepath;
                
                //delfile(newPath.toString());
                //const ext = path.extname(file.originalFilename);
                //const newPath = path.join(dir, 'upload_' + getCurrent() + ext);

                let array = file.originalFilename.split('__');
                let idx = parseInt(array[1]);//array[0];
                removeFileByPrefix(array[0] + '__' + idx + '__');

                let newName = array[0] + '__' + idx + '__' + Date.now() + array[2];

                const newPath = path.join(uploadDir, newName);//file.originalFilename);
                println('<<上傳>> ' + ' ... ' + newPath);

                return fs.promises.rename(oldPath, newPath);

            } catch (err) {
                println('upload(removeFileByPrefix) err: ' + err);
                return null;

            }
            
        });

        Promise.all(promises)
            .then(() => {
                res.writeHead(200);
                println('<<上傳>> Upload successful.');
                res.end('Upload successful.');
            })
            .catch((err) => {
                res.writeHead(500);
                println('<<上傳>> ' + err);
                res.end('Upload ' + err);
            });

        println('<<上傳>> ... end.');
    });

}

function getInfo() {
    return '';
}

module.exports = {
    uploadFile,
    handleFile,
    getInfo
};

