FROM node:22-alpine

WORKDIR /usr/app/web

COPY package*.json ./
RUN npm install

EXPOSE 3000

COPY . .

# ENTRYPOINT ["node", "./app/_cmd_server.js"]
# CMD ["-p", "3000"]
# CMD ["-p", "3000", "-auth"]

# [node image]
# docker build -t app .
# [node container]
# docker run -d --name tpcaog -p 3000:3000 app
# docker run -d --name jkpan -p 3001:3000 app
# [docker compose]
# docker-compose up -d

# [nginx]
# nginx
# nginx -s stop

# [docker]
# docker ps
# docker ps -all
# docker rm [id]
# docker images 
# docker save -o [file name] [image]
# docker load -i [file name]
# docker build --platform=linux/amd64 -t [image name] .
# docker rmi [image name]
# docker run --restart=always -d -p 3001:3000 [image name]
# 

# linux
# scp [file name] root@[ip]:[file name]