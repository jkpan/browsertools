const http = require('http');
const fs = require('fs');
const path = require('path');
const { formidable } = require('formidable');

// 建立 uploads 資料夾
const uploadDir = './users/uploads'//path.join('', 'uploads');
if (!fs.existsSync(uploadDir))
    fs.mkdirSync(uploadDir);

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

    form.parse(req, (err, fields, files) => {

        println('form.parse ...');

        if (err) {
            res.writeHead(500);
            return res.end('Upload failed.');
        }

        const uploaded = Array.isArray(files.file) ? files.file : [files.file];

        const promises = uploaded.map(file => {
            const oldPath = file.filepath;
            const newPath = path.join(uploadDir, file.originalFilename || 'upload_' + Date.now());
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

/*
// HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // 傳回 index.html
        const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(html);
    }
});
*/


function getInfo() {
    return '';
}

module.exports = {
    uploadFile,
    getInfo
};

