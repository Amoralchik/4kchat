FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY packege-lock.lock ./

COPY ./ ./

RUN npm i

CMD ["npm", "dev"]
