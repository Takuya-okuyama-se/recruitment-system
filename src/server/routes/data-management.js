const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// PostgreSQL接続設定
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'recruitment_system',
  password: process.env.DB_PASSWORD || 'postgres123',
  port: process.env.DB_PORT || 5432,
});

// サンプルデータ投入
router.post('/load-sample', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. 候補者データ投入
    const candidatesQuery = `
      INSERT INTO candidates (
        first_name, last_name, email, phone, 
        applied_position_id, source, resume_url,
        created_at
      ) VALUES
      -- 研究開発エンジニア応募者
      ('太郎', '山田', 'yamada.taro@example.com', '090-1111-1111', 1, '転職サイト', 'resumes/yamada_taro.pdf', '2024-12-01 09:00:00'),
      ('花子', '鈴木', 'suzuki.hanako@example.com', '090-2222-2222', 1, '人材紹介', 'resumes/suzuki_hanako.pdf', '2024-12-02 10:30:00'),
      ('一郎', '高橋', 'takahashi.ichiro@example.com', '090-3333-3333', 1, '転職サイト', 'resumes/takahashi_ichiro.pdf', '2024-12-03 14:15:00')
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;
    
    const candidateResult = await client.query(candidatesQuery);
    
    // 2. 採用プロセスデータ投入
    if (candidateResult.rows.length > 0) {
      const processQuery = `
        INSERT INTO recruitment_processes (candidate_id, stage_id, status, entered_at, completed_at, days_in_stage) 
        SELECT 
          c.id,
          1,
          'in_progress',
          c.created_at,
          NULL,
          NULL
        FROM candidates c
        WHERE c.created_at >= '2024-12-01'
        ON CONFLICT DO NOTHING
      `;
      
      await client.query(processQuery);
    }
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'サンプルデータを投入しました',
      candidatesAdded: candidateResult.rows.length
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('サンプルデータ投入エラー:', error);
    res.status(500).json({
      success: false,
      error: 'サンプルデータの投入に失敗しました'
    });
  } finally {
    client.release();
  }
});

// データクリア
router.delete('/clear', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 依存関係の順序でデータを削除
    await client.query('DELETE FROM job_offers');
    await client.query('DELETE FROM aptitude_test_results');
    await client.query('DELETE FROM interview_evaluations');
    await client.query('DELETE FROM recruitment_processes');
    await client.query('DELETE FROM candidates');
    
    await client.query('COMMIT');
    
    res.json({
      success: true,
      message: 'すべてのデータをクリアしました'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('データクリアエラー:', error);
    res.status(500).json({
      success: false,
      error: 'データのクリアに失敗しました'
    });
  } finally {
    client.release();
  }
});

// 処理時間更新
router.put('/update-times', async (req, res) => {
  try {
    // 完了したプロセスの滞在日数を計算して更新
    const updateQuery = `
      UPDATE recruitment_processes
      SET days_in_stage = EXTRACT(DAY FROM (completed_at - entered_at))
      WHERE completed_at IS NOT NULL
        AND days_in_stage IS NULL
    `;
    
    const result = await pool.query(updateQuery);
    
    res.json({
      success: true,
      message: '処理時間を更新しました',
      updatedRows: result.rowCount
    });
    
  } catch (error) {
    console.error('処理時間更新エラー:', error);
    res.status(500).json({
      success: false,
      error: '処理時間の更新に失敗しました'
    });
  }
});

module.exports = router;