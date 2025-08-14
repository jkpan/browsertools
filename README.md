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


todo list:
swip opacity
Bible j jump chaos 

certbot delete --cert-name tpcaog.org.tw
certbot certonly --nginx -d tpcaog.org.tw -d www.tpcaog.org.tw -d proj.tpcaog.org.tw

//

重裝機
install chrome
install git
    sudo apt-get install git-all
git clone browsertools
install vscode

install nodejs nvm npm
npm install (ws, jsonwebtoken)
stop apache2
    sudo systemctl stop apache2
    sudo update-rc.d apache2 disable (sudo update-rc.d apache2 enable)

install input zhuyin method

in browsertools init VOLUMES 
cp -R ./user/* ./VOLUMES/tpcaog/
install docker engine
    docker website

# start docker daemom (docker compose up -d "restart=always")
#    sudo systemctl start docker
# stop docker daemon
#    sudo systemctl stop docker.socket docker.serivce
sudo docker ps 
sudo docker start [container id] 

install nginx
    sudo apt install nginx
start nginx
    /usr/sbin/nginx
stop nginx
    /usr/sbin/nginx -s stop
edit nginx config file 
    /etc/nginx/sites-available/default
    /etc/nginx/conf.d/node0.conf node1.conf ...

install sshd  
    sudo apt install openssh-server
start ssh service sudo 
    sudo systemctl enable --now ssh 
    sudo systemctl status ssh

    ssh tpcaog@[ip]

/etc/nginx/sites-available/default
/etc/nginx/conf.d/node0.conf node1.conf
/etc/hosts

[update code]
'check list'
sudo docker images
sudo docker ps
sudo docker ps -al
'checkout code'
app/browsertools/git pull
sudo docker stop [container id]
sudo docker rm [container id]
sudo docker rmi [image name]
'edit Dockerfile'
app/browsertools/sudo docker build -t app .
'edit docker-compose.yaml'
app/browsertools/sudo docker compose up -d

[update shell script]
sudo docker ps //for get all containers id
app/browsertools/docker-update.sh [id] [id] ...


[free ssl certificate]
sudo certbot delete --cert-name tpcaog.org.tw
sudo certbot certonly --nginx -d tpcaog.org.tw -d www.tpcaog.org.tw -d proj.tpcaog.org.tw

sudo certbot renew           # 手動更新憑證
sudo certbot renew --dry-run # 測試憑證更新程序

sudo systemctl status certbot.timer

[nginx]
/etc/nginx/nginx.conf
client_max_body_size 100m; 允许上传最大100MB 的文件. 
