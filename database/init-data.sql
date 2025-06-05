-- 職種マスタデータの初期投入
INSERT INTO job_positions (id, department_id, title, requirements, target_count) VALUES
(1, 1, '研究開発エンジニア', '化学・バイオ系の知識、3年以上の研究開発経験', 3),
(2, 3, '品質管理責任者', 'ISO9001の知識、品質管理経験5年以上', 1),
(3, 2, '生産技術マネージャー', '製造業での生産管理経験、リーダーシップ', 2),
(4, 4, 'マーケティング担当', 'BtoB/BtoCマーケティング経験、データ分析スキル', 2),
(5, 5, '人事総務スタッフ', '人事労務の実務経験、コミュニケーション能力', 1)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  department_id = EXCLUDED.department_id;