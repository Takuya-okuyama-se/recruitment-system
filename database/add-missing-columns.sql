-- Supabaseに不足しているカラムを追加

-- departmentsテーブルに追加のカラムを追加（必要に応じて）
ALTER TABLE departments 
ADD COLUMN IF NOT EXISTS target_hires INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hired INTEGER DEFAULT 0;

-- positionsテーブルに追加のカラムを追加（必要に応じて）
ALTER TABLE positions
ADD COLUMN IF NOT EXISTS applicant_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS hired_count INTEGER DEFAULT 0;

-- departmentsのRLSポリシーを更新（必要に応じて）
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに読み取り・書き込み権限を付与
CREATE POLICY "Enable all operations for all users on departments" ON departments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for all users on positions" ON positions
    FOR ALL USING (true) WITH CHECK (true);