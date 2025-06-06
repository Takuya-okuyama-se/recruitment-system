# Vercelデプロイ完全ガイド

## 📊 データベースのプライバシーについて

### ⚠️ 重要：データベースの分離

**現在の状況**：
- あなたのSupabaseプロジェクトのデータは、あなたにしか見えません
- クライアントには**別のSupabaseプロジェクト**を作成してもらう必要があります

### 🔐 セキュリティの仕組み
1. **Supabase URL**: プロジェクト固有（他人はアクセス不可）
2. **Anon Key**: 公開可能（RLSで保護）
3. **Service Key**: 秘密（絶対に共有しない）
4. **データベース**: 完全に分離（プロジェクト間でデータ共有なし）

## 🚀 Vercelデプロイ手順（画像付き）

### ステップ1: GitHubリポジトリの準備

1. **GitHubでリポジトリ作成**
   ```
   1. GitHub.com にログイン
   2. 右上の「+」→「New repository」
   3. Repository name: recruitment-system
   4. Private を選択（プライベートリポジトリ）
   5. 「Create repository」をクリック
   ```

2. **コードをアップロード**
   ```bash
   cd recruitment-system
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[username]/recruitment-system.git
   git push -u origin main
   ```

### ステップ2: Vercelアカウント作成

1. **Vercel登録**
   ```
   1. https://vercel.com にアクセス
   2. 「Sign Up」をクリック
   3. 「Continue with GitHub」を選択
   4. GitHubアカウントで認証
   ```

### ステップ3: プロジェクトのインポート

1. **新規プロジェクト作成**
   ```
   1. Vercelダッシュボード
   2. 「Add New...」→「Project」
   3. 「Import Git Repository」
   4. recruitment-system を選択
   ```

2. **設定**
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: （空欄のまま）
   Output Directory: ./
   ```

3. **デプロイ**
   ```
   「Deploy」ボタンをクリック
   約1-2分でデプロイ完了
   ```

### ステップ4: 本番URLの取得

```
https://recruitment-system-[username].vercel.app
```

## 🔄 クライアント用Supabaseセットアップ

### 1. クライアントに新規Supabaseプロジェクトを作成してもらう

```markdown
## Supabaseプロジェクト作成手順

1. https://app.supabase.com にアクセス
2. 「New Project」をクリック
3. 以下を入力：
   - Name: recruitment-prod
   - Database Password: [強力なパスワード]
   - Region: Northeast Asia (Tokyo)
4. 「Create new project」をクリック
```

### 2. データベーススキーマの適用

```sql
-- SQL Editorで実行
-- 提供されたschema.sqlの内容をコピー&ペースト
```

### 3. 環境変数の更新

```javascript
// クライアントのSupabase情報に更新
const SUPABASE_URL = 'https://[client-project-id].supabase.co';
const SUPABASE_ANON_KEY = '[client-anon-key]';
```

### 4. Vercelで環境変数を設定（オプション）

```
Settings → Environment Variables
NEXT_PUBLIC_SUPABASE_URL = [client-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [client-key]
```

## 📦 納品パッケージ

### 1. クライアント用セットアップキット
```
recruitment-system-client/
├── source-code/          # ソースコード一式
├── database/
│   ├── schema.sql       # データベーススキーマ
│   └── sample-data.sql  # サンプルデータ（オプション）
├── docs/
│   ├── setup-guide.pdf  # セットアップガイド
│   └── user-manual.pdf  # 操作マニュアル
└── README.md            # クイックスタート
```

### 2. 環境構築スクリプト
```javascript
// setup-client.js
const clientConfig = {
  supabaseUrl: '', // クライアントが入力
  supabaseKey: '', // クライアントが入力
  vercelUrl: ''    // デプロイ後に判明
};
```

## 🛡️ セキュリティベストプラクティス

### やるべきこと ✅
1. クライアント専用のSupabaseプロジェクト作成
2. RLS（Row Level Security）の有効化
3. 強力なデータベースパスワード
4. 定期的なバックアップ

### やってはいけないこと ❌
1. あなたのSupabaseプロジェクトを共有
2. Service Roleキーの公開
3. データベースパスワードの共有
4. 本番データをローカルに保存

## 💡 よくある質問

**Q: クライアントは私のデータを見れますか？**
A: いいえ。Supabaseプロジェクトは完全に分離されています。

**Q: 私はクライアントのデータを見れますか？**
A: いいえ。クライアントのSupabaseプロジェクトにはアクセスできません。

**Q: 料金は誰が払いますか？**
A: 各自が自分のアカウントの料金を支払います。
- Vercel: クライアントのアカウント
- Supabase: クライアントのアカウント

**Q: カスタムドメインは使えますか？**
A: はい。Vercelで簡単に設定できます（クライアントのドメイン）。

## 📞 サポート引き継ぎ

### クライアントへの引き継ぎ事項
1. Vercel管理画面へのアクセス方法
2. Supabase管理画面へのアクセス方法
3. 基本的なトラブルシューティング
4. アップデート方法（GitHubプッシュ→自動デプロイ）

---
これで、あなたとクライアントのデータは完全に分離され、
プライバシーが保護されます。