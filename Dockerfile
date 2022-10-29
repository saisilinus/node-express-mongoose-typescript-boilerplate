# development stage
FROM node:14-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ecosystem.config.json ./

COPY ./src ./src

RUN ls -a

RUN yarn install --pure-lockfile && yarn compile

# production stage

FROM base as production

WORKDIR /usr/prod/app

ENV NODE_ENV=production

COPY package.json yarn.lock ecosystem.config.json ./

RUN yarn install --production --pure-lockfile

COPY --from=base /usr/src/app/dist ./dist
