FROM node:12-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

RUN chown -R node:node .

USER node

CMD [ "node", "." ]