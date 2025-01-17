# フルスタックアプリケーション

Next.js（フロントエンド）、Nest.js（バックエンド）、MongoDB（データベース）を使用したフルスタックアプリケーションです。

## 技術スタック

-   フロントエンド: Next.js (TypeScript)
-   バックエンド: Nest.js (TypeScript)
-   データベース: MongoDB
-   コンテナ化: Docker

## 必要条件

-   Docker
-   Docker Compose
-   Node.js (ローカル開発用)
-   Yarn

## プロジェクト構造

```
veicle-app/
├── frontend/          # Next.jsフロントエンド
├── backend/           # Nest.jsバックエンド
├── docker-compose.yml # Dockerコンテナの設定
└── .env              # 環境変数
```

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd fullstack-app
```

### 2. フロントエンドプロジェクトの作成

```bash
# frontendディレクトリの作成
npx create-next-app@latest frontend --typescript --tailwind --eslint
```

### 3. バックエンドプロジェクトの作成

```bash
# backendディレクトリの作成
npx @nestjs/cli new backend
```

### 4. アプリケーションの起動

```bash
# コンテナのビルドと起動
docker-compose up --build

# バックグラウンドで実行する場合
docker-compose up -d --build
```

## アクセス方法

-   フロントエンド: http://localhost:3000
-   バックエンド API: http://localhost:5000
-   MongoDB: localhost:27017

## 開発用コマンド

```bash
# コンテナの起動
docker-compose up

# コンテナの停止
docker-compose down

# コンテナのログ確認
docker-compose logs

# 特定のサービスのログ確認
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongodb

# コンテナ内でコマンドを実行
docker-compose exec frontend yarn add <package-name>
docker-compose exec backend yarn add <package-name>
```

## 環境変数

`.env`ファイルで以下の環境変数を設定できます：

-   `MONGODB_URI`: MongoDB の接続 URL
-   `NEXT_PUBLIC_API_URL`: バックエンド API の URL

## 開発のヒント

1. **ホットリロード**

    - フロントエンドとバックエンドの両方でホットリロードが有効になっています
    - ソースコードを変更すると自動的に再読み込みされます

2. **データベース**

    - MongoDB のデータは`mongodb_data`ボリュームに永続化されます
    - データベースの初期化が必要な場合は`docker-compose down -v`を実行してボリュームを削除してください
    - MongoDB はレプリカセットモードで実行され、以下の設定が含まれています：
        - 認証（ユーザー名: root, パスワード: example）
        - メモリ制限（開発環境用に 0.25GB）
        - トランザクションのサポート
    - 初期ユーザーアカウント：

        ```
        管理者アカウント:
          メールアドレス: admin@example.com
          パスワード: password123
          権限: 管理者権限

        一般ユーザーアカウント:
          メールアドレス: user@example.com
          パスワード: password123
          権限: 一般ユーザー権限
        ```

    - ⚠️ 注意: 本番環境では、必ずこれらの初期パスワードを変更してください

    ## 環境設定

    ### MongoDB 設定

    開発環境では以下の設定が適用されています：

    ```yaml
    - レプリカセット名: rs0
    - メモリキャッシュ: 0.25GB
    - 認証: 有効
    - トランザクションタイムアウト: 5000ms
    ```

    本番環境では以下の点に注意してください：

    - メモリ設定の調整

        ```yaml
        --wiredTigerCacheSizeGB: サーバーのメモリに応じて調整（推奨: 全メモリの50%）
        ```

    - セキュリティ設定

        - 強力なパスワードの使用
        - 環境変数での認証情報管理
        - ネットワークアクセス制限

    - パフォーマンス設定
        ```yaml
        maxTransactionLockRequestTimeoutMillis: ワークロードに応じて調整
        ```

    ### 初期データ

    マイグレーション実行時に以下のデータが作成されます：

    - 管理者ユーザー

        - 用途: システム管理、ユーザー管理、設定管理など
        - アクセス権限: すべての機能にアクセス可能

    - 一般ユーザー
        - 用途: 通常のアプリケーション利用
        - アクセス権限: 一般機能のみアクセス可能

    初期データの生成は`prisma/seed.ts`で管理されており、以下のコマンドで手動実行することも可能です：

    ```bash
    # 開発環境での実行
    yarn prisma:seed

    # Dockerコンテナ内での実行
    docker-compose exec backend yarn prisma:seed
    ```

    **注意**: 本番環境では、これらの初期ユーザーのパスワードを必ず変更してください。

3. **パッケージの追加**
    - 新しいパッケージを追加する場合は、対応するサービスのコンテナ内で実行してください
    ```bash
    docker-compose exec frontend yarn add <package-name>
    docker-compose exec backend yarn add <package-name>
    ```

## トラブルシューティング

1. **コンテナが起動しない場合**

    - ポートが既に使用されていないか確認してください
    - `docker-compose down`を実行してから再度試してください
    - Docker Desktop が起動していることを確認してください
    - Docker デーモンが実行中であることを確認してください

    ```bash
    # Docker の状態確認
    docker info

    # Docker Compose のバージョン確認
    docker-compose --version
    ```

2. **モジュールが見つからないエラー**

    - コンテナ内で`yarn install`を実行してください

    ```bash
    docker-compose exec frontend yarn install
    docker-compose exec backend yarn install
    ```

3. **データベース接続エラー**

    - MongoDB コンテナが完全に起動するまで待ってください
    - 環境変数`MONGODB_URI`が正しく設定されているか確認してください
    - レプリカセットの初期化が完了するまで待ってください（初回起動時に 30 秒程度かかることがあります）
    - レプリカセットの状態を確認するには：

    ```bash
    docker-compose exec mongodb mongosh --eval "rs.status()"
    ```

4. **Docker デーモンのエラー**

    - Docker Desktop が正しく起動していることを確認してください
    - Docker Desktop を再起動してください
    - システムを再起動してください
    - Docker のキャッシュをクリアしてください：

    ```bash
    docker system prune -a
    ```

5. **Next.js サイトが表示されない場合**

    - フロントエンドのログを確認してください：

    ```bash
    docker-compose logs frontend
    ```

    - ホットリロードの問題が発生している場合は、コンテナを再起動してください：

    ```bash
    docker-compose restart frontend
    ```

    - 完全に作り直す場合は：

    ```bash
    docker-compose down
    docker-compose up --build
    ```

6. **MongoDB の問題**

    - レプリカセットの初期化エラー

    ```bash
    # MongoDBのログを確認
    docker-compose logs mongodb

    # レプリカセットの状態確認
    docker-compose exec mongodb mongosh --eval "rs.status()"
    ```

    - 認証エラー

    ```bash
    # 認証情報の確認
    docker-compose exec mongodb mongosh --eval "db.auth('root', 'example')"
    ```

    - メモリ不足

    ```bash
    # メモリ使用量の確認
    docker stats

    # 必要に応じてwiredTigerCacheSizeGBを調整
    ```

## ライセンス

[MIT License](LICENSE)
