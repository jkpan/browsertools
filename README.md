# browsertool
browsertool
subtitle_b.html : use html canvas display Bible versers.

[node image]
docker build -t tpcaog .
[node container]
docker run -d --name tpcaog -p 3000:3000 tpcaog
docker run -d --name jkpan -p 3001:3000 tpcaog
[nginx image & container]
docker run -d --name web -p 80:80 nginx

[shell]
docker exec -it nginx sh


Install Nodejs & ws module (websocket)
node _cmd_server.js [-port -p number] [-cluster] [-auth] [-https]
npm install jsonwebtoken

Ex:
 node ./app/_cmd_server.js
預設一個process執行 使用port 80

Ex:
 node ./app/_cmd_server.js -p 3000 -cluster
使用 3000 port 有多少核心跑多少process

設定檔（主設定） /etc/nginx/nginx.conf   (Nginx 的主配置)
include /opt/homebrew/etc/nginx/conf.d/*.conf;

網站設定檔	/etc/nginx/conf.d/*.conf    每個網站的虛擬主機設定檔可放這裡
node0.jkpan.com.conf

server {
    listen       80 ;
    server_name  node0.jkpan.com;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host  $http_host;
        proxy_set_header X-Nginx-Proxy true;
        proxy_http_version 1.1;
        # Node.js的本機地址，注意端口
        proxy_pass    http://localhost:3000;
        # websocket 
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}

靜態網頁根目錄	/usr/share/nginx/html	預設靜態網站根目錄
SSL 憑證（自訂）	/etc/nginx/ssl（自訂掛載）	你可以自定 SSL 憑證檔掛載到這裡

Install pm2
sudo su -
//pm2 stop _cmd_server
//pm2 logs --lines 200
//pm2 delete all
//cluster
//pm2 start _cmd_server.js -i 10
//standalong process
//pm2 start process.json
//pm2 start _cmd_server.js -- -port 8080 -cluster

ssh -i "taipei_jkpan_macmini.pem" ubuntu@ec2-54-169-169-141.ap-southeast-1.compute.amazonaws.com
