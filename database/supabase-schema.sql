-- Supabase用スキーマ
-- 既存のテーブルをSupabaseで使用するための調整版

-- 既存のテーブルをドロップ（必要に応じて）
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS aptitude_tests CASCADE;
DROP TABLE IF EXISTS recruitment_stages CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS positions CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 部署マスタ
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 職種マスタ
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    target_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザー（面接官・採用担当者）
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'interviewer', 'viewer')),
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 候補者
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    position_id INTEGER REFERENCES positions(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT '応募済み',
    source VARCHAR(50),
    resume_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 採用ステージ
CREATE TABLE recruitment_stages (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT '進行中',
    scheduled_date DATE,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 適性検査結果
CREATE TABLE aptitude_tests (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    test_type VARCHAR(50) NOT NULL,
    score INTEGER,
    max_score INTEGER DEFAULT 100,
    sub_scores JSONB,
    conducted_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 面接評価
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    interviewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    stage_id INTEGER REFERENCES recruitment_stages(id) ON DELETE CASCADE,
    technical_score INTEGER CHECK (technical_score >= 1 AND technical_score <= 5),
    communication_score INTEGER CHECK (communication_score >= 1 AND communication_score <= 5),
    cultural_fit_score INTEGER CHECK (cultural_fit_score >= 1 AND cultural_fit_score <= 5),
    overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 5),
    strengths TEXT,
    weaknesses TEXT,
    recommendation VARCHAR(50) CHECK (recommendation IN ('強く推薦', '推薦', '保留', '不採用')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 内定情報
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    position_id INTEGER REFERENCES positions(id) ON DELETE SET NULL,
    salary INTEGER,
    start_date DATE,
    offer_date DATE NOT NULL,
    response_deadline DATE,
    status VARCHAR(50) DEFAULT '提示中' CHECK (status IN ('提示中', '承諾', '辞退', '取消')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_position ON candidates(position_id);
CREATE INDEX idx_recruitment_stages_candidate ON recruitment_stages(candidate_id);
CREATE INDEX idx_recruitment_stages_stage ON recruitment_stages(stage);
CREATE INDEX idx_evaluations_candidate ON evaluations(candidate_id);
CREATE INDEX idx_offers_candidate ON offers(candidate_id);

-- Row Level Security (RLS) を有効化
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE aptitude_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- 基本的なRLSポリシー（全ユーザーが読み書き可能）
-- 本番環境では適切な認証ベースのポリシーに変更してください
CREATE POLICY "Enable all access for all users" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON candidates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON recruitment_stages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON aptitude_tests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON evaluations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for all users" ON offers FOR ALL USING (true) WITH CHECK (true);

-- サンプルデータ
INSERT INTO departments (name, description) VALUES
('エンジニアリング', 'ソフトウェア開発部門'),
('営業', '法人営業部門'),
('マーケティング', 'デジタルマーケティング部門'),
('人事', '採用・人材開発部門');

INSERT INTO positions (department_id, title, description, requirements, target_count) VALUES
(1, 'フロントエンドエンジニア', 'Webアプリケーションのフロントエンド開発', 'React/Vue.js経験3年以上', 3),
(1, 'バックエンドエンジニア', 'APIおよびサーバーサイド開発', 'Node.js/Python経験3年以上', 2),
(2, '法人営業', 'エンタープライズ向け営業', '法人営業経験5年以上', 4),
(3, 'デジタルマーケター', 'デジタルマーケティング戦略立案・実行', 'デジタルマーケティング経験3年以上', 2);