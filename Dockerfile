FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./src ./

COPY ./public ./

COPY ./.env ./

RUN npm install

EXPOSE 4000

CMD [ "node", "run", "start" ]