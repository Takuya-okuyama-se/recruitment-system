# クライアント用Supabaseプロジェクト作成ガイド

## 🚀 新規Supabaseプロジェクトの作成手順

### ステップ1: Supabaseアカウント作成

1. **Supabaseにアクセス**
   - https://app.supabase.com にアクセス
   - 「Start your project」をクリック

2. **アカウント作成**
   - GitHubアカウントでサインアップ（推奨）
   - またはメールアドレスで登録

### ステップ2: 新規プロジェクト作成

1. **ダッシュボードで「New Project」をクリック**
   
2. **プロジェクト情報を入力**
   ```
   Organization: Personal（または会社名）
   Project name: recruitment-system-prod
   Database Password: [強力なパスワードを生成]
   Region: Northeast Asia (Tokyo)
   Pricing Plan: Free（無料）
   ```

3. **「Create new project」をクリック**
   - プロジェクトの作成に1-2分かかります

### ステップ3: プロジェクトの認証情報を取得

1. **Settings → API をクリック**

2. **以下の情報をコピー**
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### ステップ4: データベースのセットアップ

1. **SQL Editorを開く**
   - 左メニューの「SQL Editor」をクリック

2. **スキーマを作成**
   - 以下のSQLを順番に実行：

```sql
-- 1. 部署テーブル
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ポジションテーブル
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 候補者テーブル
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position_id INTEGER REFERENCES positions(id),
    source VARCHAR(50),
    resume_url TEXT,
    status VARCHAR(50) DEFAULT '書類選考',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 採用ステージテーブル
CREATE TABLE recruitment_stages (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    stage VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT '進行中',
    scheduled_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 面接評価テーブル
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    evaluator_name VARCHAR(100) NOT NULL,
    interview_date DATE NOT NULL,
    technical_score INTEGER CHECK (technical_score >= 1 AND technical_score <= 5),
    communication_score INTEGER CHECK (communication_score >= 1 AND communication_score <= 5),
    cultural_fit_score INTEGER CHECK (cultural_fit_score >= 1 AND cultural_fit_score <= 5),
    overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 5),
    strengths TEXT,
    weaknesses TEXT,
    comments TEXT,
    recommendation VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 適性検査結果テーブル
CREATE TABLE aptitude_tests (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    test_date DATE NOT NULL,
    verbal_score INTEGER,
    numerical_score INTEGER,
    logical_score INTEGER,
    personality_type VARCHAR(50),
    test_provider VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 内定情報テーブル
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    position_id INTEGER REFERENCES positions(id),
    salary INTEGER,
    start_date DATE,
    offer_date DATE,
    response_deadline DATE,
    status VARCHAR(50) DEFAULT '提示中',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **RLS（Row Level Security）を有効化**
```sql
-- セキュリティポリシーを有効化
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE aptitude_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- 読み取り専用ポリシーを作成（anon keyでアクセス可能）
CREATE POLICY "Enable read access for all users" ON candidates FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON positions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON evaluations FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON departments FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON recruitment_stages FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON aptitude_tests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON offers FOR SELECT USING (true);

-- 書き込みポリシー（必要に応じて認証を追加）
CREATE POLICY "Enable insert for all users" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON candidates FOR UPDATE USING (true);
CREATE POLICY "Enable insert for all users" ON evaluations FOR INSERT WITH CHECK (true);
-- 他のテーブルも同様に設定
```

### ステップ5: サンプルデータの挿入（オプション）

```sql
-- 部署のサンプルデータ
INSERT INTO departments (name) VALUES 
('エンジニアリング'),
('営業'),
('マーケティング'),
('人事'),
('財務');

-- ポジションのサンプルデータ
INSERT INTO positions (title, department_id, requirements) VALUES
('フロントエンドエンジニア', 1, 'React/Vue.jsの経験3年以上'),
('バックエンドエンジニア', 1, 'Node.js/Pythonの経験3年以上'),
('営業マネージャー', 2, '営業経験5年以上、マネジメント経験あり');
```

### ステップ6: プロジェクトファイルの更新

1. **supabase-config.jsを更新**
```javascript
// 新しいプロジェクトの情報に更新
const SUPABASE_URL = 'https://[新しいプロジェクトID].supabase.co';
const SUPABASE_ANON_KEY = '[新しいanon key]';
```

2. **GitHubにプッシュ**
```bash
git add supabase-config.js
git commit -m "Supabaseプロジェクトを本番用に更新"
git push origin main
```

3. **Vercelが自動的に再デプロイ**
   - 2-3分で新しい設定が反映されます

## 🔒 セキュリティのベストプラクティス

### やるべきこと ✅
- 強力なデータベースパスワードを使用
- RLSを必ず有効化
- 定期的なバックアップ
- アクセスログの監視

### やってはいけないこと ❌
- service_role keyを公開
- RLSを無効のまま運用
- データベースパスワードを共有
- 本番データをローカルに保存

## 💰 料金について

### Supabase無料プラン
- データベース: 500MB
- ストレージ: 1GB
- 転送量: 2GB/月
- API リクエスト: 無制限

### アップグレードが必要な場合
- Pro Plan: $25/月
- データベース: 8GB
- ストレージ: 100GB
- 転送量: 50GB/月

## 🆘 トラブルシューティング

### よくある問題

1. **「Table does not exist」エラー**
   - SQLを順番通りに実行しているか確認
   - スキーマが正しく作成されているか確認

2. **「Permission denied」エラー**
   - RLSポリシーが正しく設定されているか確認
   - anon keyが正しいか確認

3. **データが表示されない**
   - ブラウザのキャッシュをクリア
   - Supabase URLとキーが正しいか確認

## 📝 完了チェックリスト

- [ ] Supabaseアカウント作成
- [ ] 新規プロジェクト作成
- [ ] データベーススキーマ作成
- [ ] RLS有効化
- [ ] supabase-config.js更新
- [ ] GitHubにプッシュ
- [ ] Vercelで再デプロイ確認
- [ ] 本番環境で動作確認

---
これで、あなたのデータとは完全に分離された
クライアント専用の環境が構築できます。