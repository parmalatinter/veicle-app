FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["sh", "-c", "NODE_ENV=development yarn dev --hostname 0.0.0.0 --port 3000"] 