FROM node:lts-alpine

RUN apk update

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

COPY src /app/src

RUN ls -a

RUN npm install && npm install typescript -g

COPY . .

RUN tsc

ENV PORT=4000

EXPOSE 4000

CMD [ "npm", "start" ]
