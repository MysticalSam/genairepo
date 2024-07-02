FROM node:slim

WORKDIR /usr/src/app

# Install app dependencies
COPY ./package*.json /usr/src/app/

# COPY . .

COPY ./src /usr/src/app/src/

COPY ./public /usr/src/app/public/

COPY ./.env /usr/src/app/

RUN npm install

RUN ls

EXPOSE 4000

CMD [ "npm", "run", "start" ]