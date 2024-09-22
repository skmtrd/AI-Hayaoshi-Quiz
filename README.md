## Next.jsのフルスタックテンプレート

(App Router), TailWind CSS, NextAuth v5, PostgreSQL, Prisma が使えるテンプレートです

- frontend : Next.js(App Router)
- backend : Next.js Route Handler
- auth : NextAuth v5
- db ORM : PostgreSQL, Prisma
- css : TailWind CSS
- formatter : Prettier, ESLint

NextAuthは初期でGoogle認証を設定されていますがOAuthの環境変数を設定する必要があります[NextAuth v5 Documentation](https://authjs.dev/getting-started/authentication/oauth)

## 開発手順

### 1.npmパッケージのインストール

```bash
$ npm i
```

### 2.環境変数の設定

もし認証を使わない場合は無視してください

```bash
$ cp .env.local.example .env.local
```

先述したようにNextAuthの環境変数を設定してください

```bash
AUTH_GOOGLE_ID="*****************************************"
AUTH_GOOGLE_SECRET="*****************************************"
AUTH_SECRET=*****************************************
```

### 3.Dockerの起動

```bash
$ docker-compose up -d
```

### 4.Prismaのセットアップ

```bash
$ npx prisma migrate dev
$ npx prisma generate
```

### 5.開発サーバーの起動

```bash
$ npm run dev
```

Webサーバーは[http://localhost:3000](http://localhost:3000)でアクセスできます

## 開発

### 初期ページ

localhost:3000が初期ページです
初期ページにはログイン、ログアウトボタンが表示されます
ログインするとユーザーのセッション情報が表示されます

`/todo`にアクセスすると開発の例としてTodoリストが表示されます

### Prisma

Prismaのスキーマを変更した場合は以下のコマンドを実行してください

```bash
$ npx prisma db push
$ npx prisma generate
```

Prismaのdbの確認は以下のコマンドを実行してください

```bash
$ npx prisma studio
```

[localhost:5555](http://localhost:5555)でアクセスできます

### 認証

他の認証プロバイダーを使いたい場合は[NextAuth v5 Documentation](https://authjs.dev/getting-started/authentication/oauth)を参照してください
