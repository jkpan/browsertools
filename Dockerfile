FROM node:latest

WORKDIR /usr/tpcaog/web

COPY package*.json ./
RUN npm install

EXPOSE 3000

COPY . .

ENTRYPOINT ["node", "./app/_cmd_server.js"]
CMD ["-p", "3000"]

# [node image]
# docker build -t tpcaog .
# [node container]
# docker run -d --name tpcaog -p 3000:3000 tpcaog
# docker run -d --name jkpan -p 3001:3000 tpcaog