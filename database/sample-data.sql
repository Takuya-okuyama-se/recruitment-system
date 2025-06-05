-- サンプルデータ投入スクリプト
-- 実際の採用プロセスを模したリアルなデータ

-- 1. 候補者データ（50名）
INSERT INTO candidates (
    first_name, last_name, email, phone, 
    applied_position_id, source, resume_url,
    created_at
) VALUES
-- 研究開発エンジニア応募者（15名）
('太郎', '山田', 'yamada.taro@example.com', '090-1111-1111', 1, '転職サイト', 'resumes/yamada_taro.pdf', '2024-12-01 09:00:00'),
('花子', '鈴木', 'suzuki.hanako@example.com', '090-2222-2222', 1, '人材紹介', 'resumes/suzuki_hanako.pdf', '2024-12-02 10:30:00'),
('一郎', '高橋', 'takahashi.ichiro@example.com', '090-3333-3333', 1, '転職サイト', 'resumes/takahashi_ichiro.pdf', '2024-12-03 14:15:00'),
('美咲', '田中', 'tanaka.misaki@example.com', '090-4444-4444', 1, '自社HP', 'resumes/tanaka_misaki.pdf', '2024-12-04 11:20:00'),
('健太', '渡辺', 'watanabe.kenta@example.com', '090-5555-5555', 1, 'リファラル', 'resumes/watanabe_kenta.pdf', '2024-12-05 16:45:00'),
('由美', '伊藤', 'ito.yumi@example.com', '090-6666-6666', 1, '転職サイト', 'resumes/ito_yumi.pdf', '2024-12-06 09:30:00'),
('大輔', '山本', 'yamamoto.daisuke@example.com', '090-7777-7777', 1, '人材紹介', 'resumes/yamamoto_daisuke.pdf', '2024-12-07 13:00:00'),
('愛子', '中村', 'nakamura.aiko@example.com', '090-8888-8888', 1, '転職サイト', 'resumes/nakamura_aiko.pdf', '2024-12-08 10:15:00'),
('翔太', '小林', 'kobayashi.shota@example.com', '090-9999-9999', 1, '自社HP', 'resumes/kobayashi_shota.pdf', '2024-12-09 15:30:00'),
('真由', '加藤', 'kato.mayu@example.com', '090-0000-0001', 1, '転職サイト', 'resumes/kato_mayu.pdf', '2024-12-10 11:45:00'),
('隆', '吉田', 'yoshida.takashi@example.com', '090-0000-0002', 1, 'リファラル', 'resumes/yoshida_takashi.pdf', '2024-12-11 14:20:00'),
('優子', '山口', 'yamaguchi.yuko@example.com', '090-0000-0003', 1, '転職サイト', 'resumes/yamaguchi_yuko.pdf', '2024-12-12 09:00:00'),
('健二', '松本', 'matsumoto.kenji@example.com', '090-0000-0004', 1, '人材紹介', 'resumes/matsumoto_kenji.pdf', '2024-12-13 16:00:00'),
('千春', '井上', 'inoue.chiharu@example.com', '090-0000-0005', 1, '転職サイト', 'resumes/inoue_chiharu.pdf', '2024-12-14 10:30:00'),
('拓也', '木村', 'kimura.takuya@example.com', '090-0000-0006', 1, '自社HP', 'resumes/kimura_takuya.pdf', '2024-12-15 13:45:00'),

-- 品質管理責任者応募者（5名）
('明美', '林', 'hayashi.akemi@example.com', '090-0000-0007', 2, '人材紹介', 'resumes/hayashi_akemi.pdf', '2024-12-01 10:00:00'),
('正人', '清水', 'shimizu.masato@example.com', '090-0000-0008', 2, '転職サイト', 'resumes/shimizu_masato.pdf', '2024-12-03 11:30:00'),
('恵子', '森', 'mori.keiko@example.com', '090-0000-0009', 2, 'リファラル', 'resumes/mori_keiko.pdf', '2024-12-05 14:00:00'),
('浩二', '阿部', 'abe.koji@example.com', '090-0000-0010', 2, '転職サイト', 'resumes/abe_koji.pdf', '2024-12-08 09:15:00'),
('友美', '池田', 'ikeda.tomomi@example.com', '090-0000-0011', 2, '人材紹介', 'resumes/ikeda_tomomi.pdf', '2024-12-10 15:45:00'),

-- 生産技術マネージャー応募者（10名）
('秀樹', '橋本', 'hashimoto.hideki@example.com', '090-0000-0012', 3, '転職サイト', 'resumes/hashimoto_hideki.pdf', '2024-12-02 09:30:00'),
('直子', '山下', 'yamashita.naoko@example.com', '090-0000-0013', 3, '自社HP', 'resumes/yamashita_naoko.pdf', '2024-12-04 10:45:00'),
('博之', '石川', 'ishikawa.hiroyuki@example.com', '090-0000-0014', 3, '人材紹介', 'resumes/ishikawa_hiroyuki.pdf', '2024-12-06 13:15:00'),
('麻衣', '前田', 'maeda.mai@example.com', '090-0000-0015', 3, '転職サイト', 'resumes/maeda_mai.pdf', '2024-12-07 11:00:00'),
('勇人', '小川', 'ogawa.hayato@example.com', '090-0000-0016', 3, 'リファラル', 'resumes/ogawa_hayato.pdf', '2024-12-09 14:30:00'),
('京子', '岡田', 'okada.kyoko@example.com', '090-0000-0017', 3, '転職サイト', 'resumes/okada_kyoko.pdf', '2024-12-11 09:45:00'),
('剛', '近藤', 'kondo.tsuyoshi@example.com', '090-0000-0018', 3, '人材紹介', 'resumes/kondo_tsuyoshi.pdf', '2024-12-12 16:15:00'),
('奈々', '武田', 'takeda.nana@example.com', '090-0000-0019', 3, '転職サイト', 'resumes/takeda_nana.pdf', '2024-12-13 10:00:00'),
('修', '中島', 'nakajima.osamu@example.com', '090-0000-0020', 3, '自社HP', 'resumes/nakajima_osamu.pdf', '2024-12-14 13:30:00'),
('亜紀', '野口', 'noguchi.aki@example.com', '090-0000-0021', 3, '転職サイト', 'resumes/noguchi_aki.pdf', '2024-12-15 11:15:00'),

-- マーケティング担当応募者（12名）
('聡', '松田', 'matsuda.satoshi@example.com', '090-0000-0022', 4, '転職サイト', 'resumes/matsuda_satoshi.pdf', '2024-12-01 13:00:00'),
('絵里', '福田', 'fukuda.eri@example.com', '090-0000-0023', 4, '人材紹介', 'resumes/fukuda_eri.pdf', '2024-12-02 15:30:00'),
('宏樹', '村上', 'murakami.hiroki@example.com', '090-0000-0024', 4, '転職サイト', 'resumes/murakami_hiroki.pdf', '2024-12-03 09:45:00'),
('沙織', '竹内', 'takeuchi.saori@example.com', '090-0000-0025', 4, 'リファラル', 'resumes/takeuchi_saori.pdf', '2024-12-05 11:20:00'),
('達也', '金子', 'kaneko.tatsuya@example.com', '090-0000-0026', 4, '転職サイト', 'resumes/kaneko_tatsuya.pdf', '2024-12-06 14:45:00'),
('理恵', '和田', 'wada.rie@example.com', '090-0000-0027', 4, '自社HP', 'resumes/wada_rie.pdf', '2024-12-08 10:30:00'),
('大樹', '石井', 'ishii.daiki@example.com', '090-0000-0028', 4, '転職サイト', 'resumes/ishii_daiki.pdf', '2024-12-09 16:00:00'),
('美穂', '西村', 'nishimura.miho@example.com', '090-0000-0029', 4, '人材紹介', 'resumes/nishimura_miho.pdf', '2024-12-10 09:15:00'),
('亮太', '太田', 'ota.ryota@example.com', '090-0000-0030', 4, '転職サイト', 'resumes/ota_ryota.pdf', '2024-12-11 13:45:00'),
('さやか', '三浦', 'miura.sayaka@example.com', '090-0000-0031', 4, 'リファラル', 'resumes/miura_sayaka.pdf', '2024-12-12 11:30:00'),
('純一', '藤井', 'fujii.junichi@example.com', '090-0000-0032', 4, '転職サイト', 'resumes/fujii_junichi.pdf', '2024-12-13 14:15:00'),
('瞳', '斎藤', 'saito.hitomi@example.com', '090-0000-0033', 4, '人材紹介', 'resumes/saito_hitomi.pdf', '2024-12-14 10:00:00'),

-- 人事総務スタッフ応募者（8名）
('智也', '藤原', 'fujiwara.tomoya@example.com', '090-0000-0034', 5, '転職サイト', 'resumes/fujiwara_tomoya.pdf', '2024-12-02 11:00:00'),
('香織', '岡本', 'okamoto.kaori@example.com', '090-0000-0035', 5, '自社HP', 'resumes/okamoto_kaori.pdf', '2024-12-04 13:30:00'),
('和也', '小野', 'ono.kazuya@example.com', '090-0000-0036', 5, '人材紹介', 'resumes/ono_kazuya.pdf', '2024-12-06 09:45:00'),
('裕子', '酒井', 'sakai.yuko@example.com', '090-0000-0037', 5, '転職サイト', 'resumes/sakai_yuko.pdf', '2024-12-08 15:00:00'),
('誠', '長谷川', 'hasegawa.makoto@example.com', '090-0000-0038', 5, 'リファラル', 'resumes/hasegawa_makoto.pdf', '2024-12-10 10:15:00'),
('千佳', '田村', 'tamura.chika@example.com', '090-0000-0039', 5, '転職サイト', 'resumes/tamura_chika.pdf', '2024-12-12 13:45:00'),
('雅人', '渡部', 'watanabe.masahito@example.com', '090-0000-0040', 5, '人材紹介', 'resumes/watanabe_masahito.pdf', '2024-12-14 11:30:00'),
('由紀', '杉本', 'sugimoto.yuki@example.com', '090-0000-0041', 5, '転職サイト', 'resumes/sugimoto_yuki.pdf', '2024-12-15 09:00:00');

-- 2. 採用プロセスデータ（各候補者の進捗）
-- 研究開発エンジニアの採用プロセス
INSERT INTO recruitment_processes (candidate_id, stage_id, status, entered_at, completed_at, days_in_stage) VALUES
-- 山田太郎：内定まで進んだケース
(1, 1, 'passed', '2024-12-01 09:00:00', '2024-12-03 17:00:00', 2),
(1, 2, 'passed', '2024-12-03 17:00:00', '2024-12-08 17:00:00', 5),
(1, 3, 'passed', '2024-12-08 17:00:00', '2024-12-10 17:00:00', 2),
(1, 4, 'passed', '2024-12-10 17:00:00', '2024-12-15 17:00:00', 5),
(1, 5, 'in_progress', '2024-12-15 17:00:00', NULL, NULL),

-- 鈴木花子：最終面接で不合格
(2, 1, 'passed', '2024-12-02 10:30:00', '2024-12-04 17:00:00', 2),
(2, 2, 'passed', '2024-12-04 17:00:00', '2024-12-09 17:00:00', 5),
(2, 3, 'passed', '2024-12-09 17:00:00', '2024-12-11 17:00:00', 2),
(2, 4, 'failed', '2024-12-11 17:00:00', '2024-12-16 17:00:00', 5),

-- 高橋一郎：一次面接で不合格
(3, 1, 'passed', '2024-12-03 14:15:00', '2024-12-05 17:00:00', 2),
(3, 2, 'failed', '2024-12-05 17:00:00', '2024-12-10 17:00:00', 5),

-- 田中美咲：適性検査実施中
(4, 1, 'passed', '2024-12-04 11:20:00', '2024-12-06 17:00:00', 2),
(4, 2, 'passed', '2024-12-06 17:00:00', '2024-12-11 17:00:00', 5),
(4, 3, 'in_progress', '2024-12-11 17:00:00', NULL, NULL),

-- 渡辺健太：書類選考で不合格
(5, 1, 'failed', '2024-12-05 16:45:00', '2024-12-07 17:00:00', 2),

-- 伊藤由美：最終面接実施中
(6, 1, 'passed', '2024-12-06 09:30:00', '2024-12-08 17:00:00', 2),
(6, 2, 'passed', '2024-12-08 17:00:00', '2024-12-13 17:00:00', 5),
(6, 3, 'passed', '2024-12-13 17:00:00', '2024-12-15 17:00:00', 2),
(6, 4, 'in_progress', '2024-12-15 17:00:00', NULL, NULL),

-- 他の候補者も同様にプロセスを設定（一部のみ記載）
(7, 1, 'passed', '2024-12-07 13:00:00', '2024-12-09 17:00:00', 2),
(7, 2, 'in_progress', '2024-12-09 17:00:00', NULL, NULL),

(8, 1, 'passed', '2024-12-08 10:15:00', '2024-12-10 17:00:00', 2),
(8, 2, 'passed', '2024-12-10 17:00:00', '2024-12-15 17:00:00', 5),
(8, 3, 'in_progress', '2024-12-15 17:00:00', NULL, NULL),

(9, 1, 'in_progress', '2024-12-09 15:30:00', NULL, NULL),

(10, 1, 'passed', '2024-12-10 11:45:00', '2024-12-12 17:00:00', 2),
(10, 2, 'in_progress', '2024-12-12 17:00:00', NULL, NULL);

-- 3. 面接評価データ
INSERT INTO interview_evaluations (
    candidate_id, interview_type, interviewer_name, interview_date,
    technical_score, communication_score, culture_fit_score, 
    overall_score, recommendation, comments
) VALUES
-- 山田太郎の評価
(1, 'first', '佐藤部長', '2024-12-05', 5, 4, 5, 4.7, 'strongly_recommend', '技術力が高く、即戦力として期待できる。'),
(1, 'final', '田中役員', '2024-12-12', 5, 5, 5, 5.0, 'strongly_recommend', '素晴らしい候補者。是非採用したい。'),

-- 鈴木花子の評価
(2, 'first', '佐藤部長', '2024-12-06', 4, 4, 4, 4.0, 'recommend', '技術力は十分。チームワークも期待できる。'),
(2, 'final', '田中役員', '2024-12-14', 3, 4, 3, 3.3, 'not_recommend', 'マネジメント経験が不足。もう少し経験を積んでから。'),

-- 高橋一郎の評価
(3, 'first', '佐藤部長', '2024-12-07', 2, 3, 3, 2.7, 'not_recommend', '技術力が要求レベルに達していない。'),

-- 田中美咲の評価
(4, 'first', '佐藤部長', '2024-12-09', 4, 5, 4, 4.3, 'recommend', 'コミュニケーション能力が高い。技術面も問題なし。'),

-- 伊藤由美の評価
(6, 'first', '佐藤部長', '2024-12-11', 5, 4, 4, 4.3, 'recommend', '研究開発の実績が豊富。即戦力になる。');

-- 4. 適性検査結果データ
INSERT INTO aptitude_test_results (
    candidate_id, test_date,
    verbal_ability_score, numerical_ability_score, logical_ability_score,
    personality_traits, test_summary
) VALUES
-- 山田太郎の結果
(1, '2024-12-09', 85, 92, 88, 
'{"外向性": "高", "協調性": "高", "誠実性": "非常に高", "開放性": "高", "情緒安定性": "高"}',
'バランスの取れた優秀な結果。特に数値処理能力が高い。'),

-- 鈴木花子の結果
(2, '2024-12-10', 78, 75, 80,
'{"外向性": "中", "協調性": "高", "誠実性": "高", "開放性": "中", "情緒安定性": "高"}',
'全体的に良好な結果。協調性が高くチームワークに期待。'),

-- 田中美咲の結果（実施中のため仮データ）
(4, '2024-12-12', 82, 79, 85,
'{"外向性": "高", "協調性": "非常に高", "誠実性": "高", "開放性": "高", "情緒安定性": "中"}',
'論理的思考力が高い。コミュニケーション能力も優れている。'),

-- 伊藤由美の結果
(6, '2024-12-14', 90, 88, 91,
'{"外向性": "中", "協調性": "高", "誠実性": "非常に高", "開放性": "非常に高", "情緒安定性": "高"}',
'非常に優秀な結果。研究開発職に最適な資質を持つ。');

-- 5. 内定提示データ
INSERT INTO job_offers (
    candidate_id, offered_position, offered_department,
    offered_salary, offer_date, response_deadline, status
) VALUES
-- 山田太郎への内定
(1, '研究開発エンジニア', '研究開発本部', 6500000, '2024-12-16', '2024-12-23', 'pending');

-- 6. 部門の目標採用数を更新（実際の進捗を反映）
UPDATE job_positions SET target_count = 3 WHERE id = 1;  -- 研究開発エンジニア
UPDATE job_positions SET target_count = 1 WHERE id = 2;  -- 品質管理責任者
UPDATE job_positions SET target_count = 2 WHERE id = 3;  -- 生産技術マネージャー
UPDATE job_positions SET target_count = 2 WHERE id = 4;  -- マーケティング担当
UPDATE job_positions SET target_count = 1 WHERE id = 5;  -- 人事総務スタッフ