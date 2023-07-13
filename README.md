# Neo's ActivityPub

Mastodon もどきを作ってみたい。


## できるようにしたいこと

- [x] ユーザ登録
- [ ] ユーザ削除
- [x] ログイン
- [x] ログアウト
- [x] 投稿
- [x] 他ユーザからのフォローを承認する
    - [x] フォローされたことを通知する
- [x] 他ユーザからのアンフォローを承認する
- [ ] 自身のプロフィールページ
    - [x] Bio
    - [x] 過去トゥート表示
    - [ ] フォロー中一覧
    - [x] フォロワー一覧
- [ ] ローカルの他ユーザのプロフィールページ
    - [x] Bio
    - [x] 過去トゥート表示
    - [ ] フォロー中一覧
    - [x] フォロワー一覧
    - [ ] フォロー・アンフォローボタン
- [ ] 他サーバのユーザのプロフィールページ
    - [ ] フォロー・アンフォローボタン
    - [ ] 最新の投稿
- [ ] 他ユーザをフォローする
- [ ] 他ユーザをアンフォローする
- [ ] 他ユーザの投稿をふぁぼる
- [ ] 他ユーザの投稿をブーストする
- [ ] 他ユーザの投稿にリプライする
- [ ] ホームタイムライン
- [ ] ローカルタイムライン
- [ ] 連合タイムライン
- 優先度低
    - [ ] 他ユーザをミュートする
    - [ ] 他ユーザをブロックする
    - [ ] キーワードミュート
    - [ ] 投稿の削除


## 構成

- フロントエンド : Angular
- バックエンド : NestJS
- DB : SQLite


## 開発

```bash
# バックエンド (ポート 3000) を立ち上げておく
$ cd ./backend/
$ npm install
$ npm run dev

# フロントエンド (ポート 4200) を起動する・バックエンドへのアクセスは Angular を経由して行う
$ cd ./frontend/
$ npm install
$ npm start
```


## ビルド

```bash
# フロントエンドをビルドしておく
$ cd ./frontend/
$ npm run build

# バックエンドをビルドして起動する・・フロントエンドのアクセスもバックエンドから透過される
$ cd ./backend/
$ npm run build
$ npm start
```
