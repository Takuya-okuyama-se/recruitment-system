-- 内定管理機能の拡張のためのデータベース更新スクリプト

-- job_offersテーブルが存在しない場合は作成
CREATE TABLE IF NOT EXISTS job_offers (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id),
    position_id INTEGER REFERENCES job_positions(id),
    salary_offered DECIMAL(12, 2),
    start_date DATE,
    offer_sent_date DATE,
    response_deadline DATE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, negotiating
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 更新日時を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- job_offersテーブルにトリガーを設定
DROP TRIGGER IF EXISTS update_job_offers_updated_at ON job_offers;
CREATE TRIGGER update_job_offers_updated_at
BEFORE UPDATE ON job_offers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 内定条件の変更履歴を記録するテーブル
CREATE TABLE IF NOT EXISTS offer_history (
    id SERIAL PRIMARY KEY,
    offer_id INTEGER REFERENCES job_offers(id),
    field_name VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータ（必要に応じて）
-- INSERT INTO job_offers (candidate_id, position_id, salary_offered, start_date, response_deadline, status)
-- VALUES 
-- (1, 1, 5000000, '2024-04-01', '2024-02-15', 'pending'),
-- (2, 2, 5500000, '2024-04-01', '2024-02-20', 'accepted');