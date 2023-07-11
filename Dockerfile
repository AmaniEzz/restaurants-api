FROM node:16-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

CMD [ "node", "dist/main" ]