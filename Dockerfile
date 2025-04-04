FROM node:16

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

USER node

COPY --chown=node:node . .

RUN npm run build

