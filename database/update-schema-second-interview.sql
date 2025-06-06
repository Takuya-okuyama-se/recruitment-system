-- 二次面接を追加するためのデータベース更新スクリプト

-- 既存のステージの順番を更新
UPDATE recruitment_stages SET stage_order = 4 WHERE name = '適性検査';
UPDATE recruitment_stages SET stage_order = 5 WHERE name = '最終面接';
UPDATE recruitment_stages SET stage_order = 6 WHERE name = '内定';

-- 二次面接を追加
INSERT INTO recruitment_stages (name, name_en, stage_order) 
VALUES ('二次面接', 'Second Interview', 3)
ON CONFLICT (name) DO NOTHING;

-- 確認用のクエリ
SELECT * FROM recruitment_stages ORDER BY stage_order;