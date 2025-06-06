# Supabaseセットアップガイド

## 1. Supabaseプロジェクトの作成

1. [https://app.supabase.com](https://app.supabase.com) にアクセス
2. GitHubアカウントでサインイン
3. 「New project」をクリック
4. プロジェクト情報を入力：
   - Organization: 既存のものを選択または新規作成
   - Project name: `recruitment-system`（任意）
   - Database Password: 強力なパスワードを設定（保存しておく）
   - Region: `Northeast Asia (Tokyo)`を選択
   - Pricing Plan: Free（無料）

## 2. データベースのセットアップ

1. プロジェクトが作成されたら、左メニューから「SQL Editor」を選択
2. 「New query」をクリック
3. `database/supabase-schema.sql`の内容をコピー＆ペースト
4. 「Run」をクリックしてスキーマを作成

## 3. API認証情報の取得

1. 左メニューから「Settings」→「API」を選択
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 4. アプリケーションの設定

1. `supabase-config.js`を開く
2. 取得した情報で更新：
   ```javascript
   const SUPABASE_URL = 'https://あなたのプロジェクト.supabase.co';
   const SUPABASE_ANON_KEY = 'あなたのanon key';
   ```

## 5. 使用方法

### ローカルで使用する場合
1. ブラウザで以下のファイルを直接開く：
   - `dashboard-supabase.html` - ダッシュボード
   - 他のHTMLファイルも同様にSupabase対応版を作成予定

### オンラインで公開する場合
1. GitHub Pagesを使用：
   - リポジトリのSettings → Pages
   - Source: Deploy from a branch
   - Branch: main, /(root)を選択
   - Save

2. 数分後、以下のURLでアクセス可能：
   `https://[ユーザー名].github.io/recruitment-system/dashboard-supabase.html`

## 注意事項

- **anon key**は公開されても問題ありません（Row Level Securityで保護）
- 本番環境では適切なRLSポリシーを設定してください
- 無料プランの制限：
  - データベース: 500MB
  - ファイルストレージ: 1GB
  - 月間アクティブユーザー: 50,000人
  - エッジ関数実行: 500,000回/月

## トラブルシューティング

### CORS エラーが発生する場合
- ローカルファイルから直接アクセスしている場合は、簡易的なWebサーバーを使用：
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Node.js
  npx http-server
  ```

### データが表示されない場合
1. ブラウザの開発者ツールでエラーを確認
2. Supabaseダッシュボードでテーブルにデータがあるか確認
3. API認証情報が正しいか確認