FROM node:latest

WORKDIR /usr/tpcaog/web

COPY package*.json ./
RUN npm install

EXPOSE 3000

COPY . .

ENTRYPOINT ["node", "./app/_cmd_server.js"]
CMD ["-p", "3000"]