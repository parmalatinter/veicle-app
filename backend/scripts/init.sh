#!/bin/sh

# Prismaマイグレーションの実行
echo "Running Prisma migrations..."
yarn db:setup

# バックエンドサーバーの起動
echo "Starting backend server..."
yarn start:dev &

# プロセスを維持
wait 