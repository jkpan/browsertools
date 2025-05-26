FROM node:22

WORKDIR /usr/tpcaog/app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
