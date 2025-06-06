-- 採用プロセストラッキングの改善

-- 1. 候補者の現在のステータスを追跡するビューを作成
CREATE OR REPLACE VIEW candidate_current_status AS
SELECT DISTINCT ON (c.id)
    c.id as candidate_id,
    c.name,
    c.email,
    p.title as position,
    rs.stage as current_stage,
    rs.status as stage_status,
    rs.scheduled_date,
    rs.completed_date,
    CASE 
        WHEN rs.status = '不合格' THEN '不合格'
        WHEN rs.stage = '内定' AND rs.status = '合格' THEN '内定承諾'
        WHEN rs.stage = '内定' AND rs.status = '進行中' THEN '内定提示中'
        ELSE rs.stage || ' - ' || rs.status
    END as display_status
FROM candidates c
LEFT JOIN positions p ON c.position_id = p.id
LEFT JOIN recruitment_stages rs ON c.id = rs.candidate_id
ORDER BY c.id, rs.created_at DESC;

-- 2. ステージ別の統計を取得するビュー
CREATE OR REPLACE VIEW stage_statistics AS
SELECT 
    stage,
    COUNT(CASE WHEN status = '進行中' THEN 1 END) as in_progress,
    COUNT(CASE WHEN status = '合格' THEN 1 END) as passed,
    COUNT(CASE WHEN status = '不合格' THEN 1 END) as failed,
    COUNT(*) as total
FROM recruitment_stages
GROUP BY stage;

-- 3. ファネル分析用のビュー（累積型）
CREATE OR REPLACE VIEW recruitment_funnel AS
WITH stage_order AS (
    SELECT 
        stage,
        CASE stage
            WHEN '書類選考' THEN 1
            WHEN '一次面接' THEN 2
            WHEN '二次面接' THEN 3
            WHEN '適性検査' THEN 4
            WHEN '最終面接' THEN 5
            WHEN '内定' THEN 6
        END as stage_num
    FROM (VALUES 
        ('書類選考'), ('一次面接'), ('二次面接'), 
        ('適性検査'), ('最終面接'), ('内定')
    ) AS stages(stage)
),
candidate_progress AS (
    SELECT 
        c.id,
        MAX(so.stage_num) as max_stage_reached
    FROM candidates c
    JOIN recruitment_stages rs ON c.id = rs.candidate_id
    JOIN stage_order so ON rs.stage = so.stage
    WHERE rs.status IN ('進行中', '合格')
    GROUP BY c.id
)
SELECT 
    so.stage,
    so.stage_num,
    COUNT(cp.id) as candidate_count
FROM stage_order so
LEFT JOIN candidate_progress cp ON cp.max_stage_reached >= so.stage_num
GROUP BY so.stage, so.stage_num
ORDER BY so.stage_num;

-- 4. 候補者の採用プロセス履歴を保持するためのインデックス
CREATE INDEX IF NOT EXISTS idx_recruitment_stages_candidate_status 
ON recruitment_stages(candidate_id, status, created_at DESC);

-- 5. ステージ進行のトリガー（オプション）
-- 前のステージが完了していない場合は次のステージに進めないようにする
CREATE OR REPLACE FUNCTION validate_stage_progression()
RETURNS TRIGGER AS $$
DECLARE
    current_stage_num INTEGER;
    new_stage_num INTEGER;
    prev_stage_complete BOOLEAN;
BEGIN
    -- ステージ番号を取得
    SELECT CASE NEW.stage
        WHEN '書類選考' THEN 1
        WHEN '一次面接' THEN 2
        WHEN '二次面接' THEN 3
        WHEN '適性検査' THEN 4
        WHEN '最終面接' THEN 5
        WHEN '内定' THEN 6
    END INTO new_stage_num;
    
    -- 前のステージが完了しているか確認
    IF new_stage_num > 1 THEN
        SELECT EXISTS(
            SELECT 1 FROM recruitment_stages
            WHERE candidate_id = NEW.candidate_id
            AND stage = CASE new_stage_num - 1
                WHEN 1 THEN '書類選考'
                WHEN 2 THEN '一次面接'
                WHEN 3 THEN '二次面接'
                WHEN 4 THEN '適性検査'
                WHEN 5 THEN '最終面接'
            END
            AND status = '合格'
        ) INTO prev_stage_complete;
        
        IF NOT prev_stage_complete AND NEW.status = '進行中' THEN
            RAISE EXCEPTION '前のステージが完了していません';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成（必要に応じて有効化）
-- CREATE TRIGGER check_stage_progression
-- BEFORE INSERT ON recruitment_stages
-- FOR EACH ROW
-- EXECUTE FUNCTION validate_stage_progression();