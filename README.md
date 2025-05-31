# browsertool
browsertool
subtitle_b.html : use html canvas display Bible versers.

docker build -t tpcaog .   
docker run -d -p 8081:3000 my-node-app

docker run -d --name nginx -p 80:80 nginx
docker exec -it nginx sh

//npm install ws
//sudo su -
//ssh -i "taipei_jkpan_macmini.pem" ubuntu@ec2-54-169-169-141.ap-southeast-1.compute.amazonaws.com
//pm2 start _cmd_server.js
//pm2 stop _cmd_server
//pm2 logs --lines 200
//pm2 delete all
//ec2-54-169-169-141.ap-southeast-1.compute.amazonaws.com
//cluster
//pm2 start _cmd_server.js -i 10
//standalong process
//pm2 start process.json
//pm2 start _cmd_server.js -- -port 8080 -cluster
/*
Install Nodejs & ws module (websocket)
node _cmd_server.js [-port number] [-cluster]
npm install jsonwebtoken

Ex:
 node _cmd_server.js
預設一個process執行 使用port 80

Ex:
	node _cmd_server.js -port 8080 -cluster
使用 8080 port 有多少核心跑多少process

Install pm2
Ex:
	pm2 start _cmd_server.js -- -port 80 -cluster
*/


類別	路徑	說明
設定檔（主設定）	/etc/nginx/nginx.conf	Nginx 的主配置檔案
網站設定檔	/etc/nginx/conf.d/*.conf	每個網站的虛擬主機設定檔可放這裡
靜態網頁根目錄	/usr/share/nginx/html	預設靜態網站根目錄
SSL 憑證（自訂）	/etc/nginx/ssl（自訂掛載）	你可以自定 SSL 憑證檔掛載到這裡

server {
    listen 80;

    server_name guest.local;
    location / {
        proxy_pass http://localhost:3000;
    }
}

server {
    listen 80;

    server_name tpcaog.local;
    location / {
        proxy_pass http://localhost:3000;
    }
}
