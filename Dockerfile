FROM node:22

WORKDIR /usr/tpcaog/web

COPY package*.json ./
RUN npm install

EXPOSE 8080

COPY . .

ENTRYPOINT ["node", "./app/_cmd_server.js"]
CMD ["-p", "8080"]