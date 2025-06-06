# Supabaseを使った本番環境での納品ガイド

## 🚀 最も簡単な納品方法（推奨）

### 1. Vercelでの展開（無料・5分で完了）

1. **GitHubにコードをアップロード**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[your-username]/recruitment-system.git
   git push -u origin main
   ```

2. **Vercelアカウント作成**
   - https://vercel.com にアクセス
   - GitHubアカウントでサインイン

3. **プロジェクトをインポート**
   - "New Project"をクリック
   - GitHubリポジトリを選択
   - そのままデプロイ

4. **環境変数を設定**
   - Settings > Environment Variables
   - 以下を追加：
     ```
     SUPABASE_URL=https://obmuuwipbwoaoeakpkfg.supabase.co
     SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

5. **完了！**
   - https://[your-project].vercel.app でアクセス可能

### 2. Netlifyでの展開（無料・同じく簡単）

1. **Netlifyアカウント作成**
   - https://www.netlify.com
   - GitHubでサインイン

2. **ドラッグ&ドロップでデプロイ**
   - プロジェクトフォルダをドラッグ&ドロップ
   - または "Import from Git"

3. **本番URLを取得**
   - https://[your-project].netlify.app

## 📱 クライアントへの提供方法

### オプション1: ホスティング済みURLを提供（推奨）
```
採用管理システムのURLをお送りします：
https://[your-company]-recruitment.vercel.app

ログイン情報：
- Supabaseダッシュボード: https://app.supabase.com
- プロジェクト名: [project-name]
```

### オプション2: クライアント自身でホスティング

1. **必要なもの**
   - GitHubアカウント
   - Vercel/Netlifyアカウント
   - Supabaseアカウント

2. **手順書を提供**
   ```markdown
   ## セットアップ手順
   1. 提供されたZIPファイルを解凍
   2. GitHubに新規リポジトリを作成
   3. コードをプッシュ
   4. Vercelでインポート
   5. 環境変数を設定
   ```

## 🔧 Supabase本番環境の設定

### 1. 新規Supabaseプロジェクト作成（クライアント用）
```bash
1. https://app.supabase.com にアクセス
2. "New Project"をクリック
3. プロジェクト名: "recruitment-system-prod"
4. データベースパスワードを設定（強力なものを）
5. リージョン: "Northeast Asia (Tokyo)"を選択
```

### 2. データベースセットアップ
```sql
-- Supabase SQL Editorで実行
-- database/supabase-schema.sql の内容をコピー&ペースト
```

### 3. セキュリティ設定
```sql
-- RLS（Row Level Security）を有効化
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- 必要に応じてポリシーを作成
```

### 4. 環境変数の更新
```javascript
// supabase-config.js を更新
const SUPABASE_URL = 'https://[new-project-id].supabase.co';
const SUPABASE_ANON_KEY = '[new-anon-key]';
```

## 📦 納品パッケージ

### 1. ソースコード一式
- すべてのHTMLファイル
- JavaScriptファイル
- CSSファイル
- 設定ファイル

### 2. ドキュメント
- このデプロイメントガイド
- 操作マニュアル
- API仕様書

### 3. アクセス情報
- 本番環境URL
- Supabaseダッシュボード
- 管理者アカウント

## 🛡️ セキュリティチェックリスト

- [ ] Supabaseのanon keyは公開可能なもの
- [ ] RLSポリシーが適切に設定されている
- [ ] HTTPSが有効になっている
- [ ] 環境変数が正しく設定されている

## 💰 コスト

### Supabase（無料プラン）
- 500MBデータベース
- 月間100GBバンド幅
- 月間200万リクエスト

### Vercel/Netlify（無料プラン）
- 月間100GBバンド幅
- 自動SSL証明書
- カスタムドメイン対応

## 📞 サポート

### トラブルシューティング
1. **CORS エラー**
   - Supabaseダッシュボード > Settings > API
   - Allowed originsに本番URLを追加

2. **データベース接続エラー**
   - 環境変数が正しいか確認
   - Supabaseプロジェクトがアクティブか確認

3. **認証エラー**
   - anon keyが正しいか確認
   - RLSポリシーを確認

---
これで、クライアントは自分のSupabaseアカウントで
本番環境を簡単に構築できます。