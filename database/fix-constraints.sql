
-- evaluationsテーブルのinterviewer_id制約を修正
ALTER TABLE evaluations 
ALTER COLUMN interviewer_id DROP NOT NULL;

-- サンプルユーザーを作成（必要な場合）
INSERT INTO users (email, name, role) 
VALUES ('system@example.com', 'システム', 'admin')
ON CONFLICT (email) DO NOTHING;
