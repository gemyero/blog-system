FROM node:12-alpine

WORKDIR /app

RUN apk --update add --virtual netcat-openbsd && rm -rf /var/cache/apk/*

COPY package*.json ./

RUN npm ci --production

COPY . .

RUN chown -R node:node .

USER node

CMD [ "node", "." ]