FROM node:alpine

# Create app directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json /usr/src/app/

COPY ./src /usr/src/app/

COPY ./public /usr/src/app/

COPY ./.env /usr/src/app/

RUN npm install

EXPOSE 4000

CMD [ "node", "run", "start" ]