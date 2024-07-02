FROM node:slim

WORKDIR /usr/src/app

# Install app dependencies
COPY ./package*.json /

# COPY . .

COPY ./src /

COPY ./public /

COPY ./.env /

RUN npm install

EXPOSE 4000

CMD [ "npm", "run", "start" ]