# 一人開発者向けのシンプルなセットアップ

## 🎯 Dockerを使わないシンプルな構成

一人で開発するなら、もっとシンプルに始められます。

### 方法1: ローカル環境で直接開発（最もシンプル）

#### 必要なもの
1. **Node.js** - [nodejs.org](https://nodejs.org/)からインストール
2. **PostgreSQL** - [postgresql.org](https://www.postgresql.org/download/)からインストール
3. **VS Code** - エディタ

#### セットアップ手順
```bash
# 1. PostgreSQLをインストール後、データベース作成
createdb recruitment_system

# 2. プロジェクトディレクトリで依存関係インストール
cd /mnt/c/Users/takuy/jinji/recruitment-system-tracker
npm install

# 3. データベースのセットアップ
psql -d recruitment_system -f database/schema.sql

# 4. 環境変数ファイルを作成
cp .env.example .env
# .envファイルを編集して、ローカルのDB情報を設定

# 5. アプリケーション起動
npm run dev
```

### 方法2: SQLiteを使った超軽量構成（DB インストール不要）

#### 変更点
```javascript
// src/server/db.js - SQLite版
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/recruitment.db');

// PostgreSQL特有の機能を使わないシンプルな設計に変更
```

#### メリット
- データベースのインストール不要
- 1つのファイルで完結
- バックアップも簡単（ファイルコピーだけ）

### 方法3: オールインワンの軽量構成

```bash
# 1. プロジェクト作成
npx create-react-app recruitment-system --template typescript
cd recruitment-system

# 2. バックエンドを同じプロジェクトに追加
npm install express sqlite3 cors
npm install -D nodemon concurrently

# 3. package.jsonに追加
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "nodemon server.js",
  "client": "react-scripts start"
}
```

## 🤔 Dockerが過剰になるケース

### 一人開発でDockerが不要な理由
1. **環境の一貫性が不要** - 自分のPCだけで動けばOK
2. **学習コスト** - Docker自体の学習時間が必要
3. **リソース消費** - メモリ使用量が増える
4. **複雑性** - トラブル時の原因特定が難しくなる

### Dockerを使うべきタイミング
- チームが増えた時
- 本番環境にデプロイする時
- 複数のプロジェクトを並行開発する時

## 📝 推奨：段階的アプローチ

### ステップ1: 最初はシンプルに（1-2週間）
```bash
# ローカルで直接開発
npm install
npm run dev
```

### ステップ2: 必要に応じて追加（1ヶ月後）
- データベースが必要 → PostgreSQLインストール
- 他の人と共有 → その時点でDocker検討

### ステップ3: 本番環境を意識（3ヶ月後）
- クラウドデプロイ → Docker化
- CI/CD構築 → コンテナ化のメリット大

## 💡 一人開発の現実的な選択

### 今すぐ始めるなら
```bash
# Node.jsだけで開始
npx create-react-app recruitment-system
cd recruitment-system
npm install express sqlite3
# データはJSONファイルやSQLiteで十分
```

### メリット
- 5分で開発開始
- デバッグが簡単
- 学習曲線が緩やか
- 必要な時に拡張可能

## 結論

**一人開発なら、Dockerは後回しでOK！**

まずは動くものを作ることが大切。複雑性は必要になってから追加しましょう。