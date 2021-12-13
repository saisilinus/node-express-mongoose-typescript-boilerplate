FROM node:alpine

RUN mkdir -p /usr/dist/node-app && chown -R node:node /usr/dist/node-app

WORKDIR /usr/dist/node-app

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
