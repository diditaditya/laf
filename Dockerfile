FROM node:8-slim

RUN apt-get -yyq update && apt-get -yyq upgrade
RUN apt-get -yyq install g++ python make vim

RUN npm install -g node-gyp nodemon

WORKDIR /laf

COPY ./package.json /laf

RUN npm install

EXPOSE 3000
