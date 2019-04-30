
FROM node:latest

RUN npm install --global yarn

RUN cd /tmp && yarn

ADD . /frontend

WORKDIR /frontend

EXPOSE 3000


