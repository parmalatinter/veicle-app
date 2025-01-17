FROM node:18-alpine

WORKDIR /app

# シェルスクリプトの実行に必要なツールをインストール
RUN apk add --no-cache \
    curl \
    openssl \
    openssl-dev \
    libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

# bcryptのビルドに必要なパッケージをインストール
RUN apk add --no-cache python3 make g++ \
    && yarn install \
    && apk del python3 make g++

COPY . .

# 初期化スクリプトに実行権限を付与
RUN chmod +x ./scripts/init.sh

# Prismaクライアントの生成
RUN npx prisma generate

EXPOSE 5000

CMD ["./scripts/init.sh"] 