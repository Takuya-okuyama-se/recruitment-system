const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// データベース接続
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'recruitment_system',
  password: process.env.DB_PASSWORD || 'postgres123',
  port: process.env.DB_PORT || 5432,
});

// 簡単なバリデーション関数
function validateCandidate(data) {
  const errors = [];
  
  if (!data.first_name || data.first_name.trim() === '') {
    errors.push('名は必須です');
  }
  if (!data.last_name || data.last_name.trim() === '') {
    errors.push('姓は必須です');
  }
  if (!data.email || !data.email.includes('@')) {
    errors.push('有効なメールアドレスを入力してください');
  }
  if (!data.applied_position_id) {
    errors.push('応募職種を選択してください');
  }
  
  return errors;
}

// 候補者一覧取得
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.*,
        jp.title as position_title,
        d.name as department_name,
        rs.name as current_stage,
        rp.status as stage_status
      FROM candidates c
      LEFT JOIN job_positions jp ON c.applied_position_id = jp.id
      LEFT JOIN departments d ON jp.department_id = d.id
      LEFT JOIN (
        SELECT DISTINCT ON (candidate_id) 
          candidate_id, stage_id, status, entered_at
        FROM recruitment_processes
        ORDER BY candidate_id, entered_at DESC
      ) rp ON c.id = rp.candidate_id
      LEFT JOIN recruitment_stages rs ON rp.stage_id = rs.id
      ORDER BY c.created_at DESC
    `;

    const result = await pool.query(query);
    
    res.json({
      candidates: result.rows,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

// 候補者詳細取得
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidateQuery = `
      SELECT 
        c.*,
        jp.title as position_title,
        d.name as department_name
      FROM candidates c
      LEFT JOIN job_positions jp ON c.applied_position_id = jp.id
      LEFT JOIN departments d ON jp.department_id = d.id
      WHERE c.id = $1
    `;
    
    const candidateResult = await pool.query(candidateQuery, [id]);
    
    if (candidateResult.rows.length === 0) {
      return res.status(404).json({ error: '候補者が見つかりません' });
    }
    
    res.json({
      candidate: candidateResult.rows[0]
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

// 候補者登録
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    // バリデーション
    const errors = validateCandidate(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    await client.query('BEGIN');
    
    const {
      first_name,
      last_name,
      email,
      phone,
      current_company,
      years_of_experience,
      education,
      languages,
      applied_position_id,
      source
    } = req.body;
    
    // 職種IDの存在確認（簡易的に1-5の範囲でチェック）
    if (applied_position_id < 1 || applied_position_id > 5) {
      // 職種マスタを作成
      const createPositions = `
        INSERT INTO job_positions (id, department_id, title) VALUES
        (1, 1, '研究開発エンジニア'),
        (2, 3, '品質管理責任者'),
        (3, 2, '生産技術マネージャー'),
        (4, 4, 'マーケティング担当'),
        (5, 5, '人事総務スタッフ')
        ON CONFLICT (id) DO NOTHING
      `;
      await client.query(createPositions);
    }
    
    // 候補者情報を登録
    const insertCandidateQuery = `
      INSERT INTO candidates (
        first_name, last_name, email, phone,
        current_company, years_of_experience,
        education, languages, applied_position_id, source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const candidateValues = [
      first_name, last_name, email, phone || null,
      current_company || null, years_of_experience || null,
      education || null, languages || null, 
      applied_position_id, source || null
    ];
    
    const candidateResult = await client.query(insertCandidateQuery, candidateValues);
    const newCandidate = candidateResult.rows[0];
    
    // 最初の採用プロセス（書類選考）を開始
    const insertProcessQuery = `
      INSERT INTO recruitment_processes (
        candidate_id, stage_id, status
      ) VALUES ($1, 1, 'in_progress')
      RETURNING *
    `;
    
    await client.query(insertProcessQuery, [newCandidate.id]);
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: '候補者が正常に登録されました',
      candidate: newCandidate
    });
  } catch (error) {
    await client.query('ROLLBACK');
    
    if (error.code === '23505') {
      return res.status(409).json({ error: 'このメールアドレスは既に登録されています' });
    }
    
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  } finally {
    client.release();
  }
});

// 採用ステージ更新
router.post('/:id/advance-stage', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { action, notes } = req.body;
    
    if (!action || (action !== 'pass' && action !== 'fail')) {
      return res.status(400).json({ error: 'actionは"pass"または"fail"である必要があります' });
    }
    
    await client.query('BEGIN');
    
    // 現在のプロセスを取得
    const currentProcessQuery = `
      SELECT rp.*, rs.stage_order, rs.name as stage_name
      FROM recruitment_processes rp
      JOIN recruitment_stages rs ON rp.stage_id = rs.id
      WHERE rp.candidate_id = $1 AND rp.status = 'in_progress'
      ORDER BY rp.entered_at DESC
      LIMIT 1
    `;
    
    const currentProcess = await client.query(currentProcessQuery, [id]);
    
    if (currentProcess.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: '進行中のプロセスが見つかりません' });
    }
    
    const current = currentProcess.rows[0];
    
    // 現在のプロセスを完了
    const updateCurrentQuery = `
      UPDATE recruitment_processes
      SET status = $1, completed_at = CURRENT_TIMESTAMP, notes = $2
      WHERE id = $3
    `;
    
    await client.query(updateCurrentQuery, [
      action === 'pass' ? 'passed' : 'failed',
      notes || null,
      current.id
    ]);
    
    // 合格の場合、次のステージへ
    if (action === 'pass') {
      const nextStageQuery = `
        SELECT * FROM recruitment_stages
        WHERE stage_order = $1 AND is_active = true
      `;
      
      const nextStage = await client.query(nextStageQuery, [current.stage_order + 1]);
      
      if (nextStage.rows.length > 0) {
        const insertNextProcess = `
          INSERT INTO recruitment_processes (candidate_id, stage_id, status)
          VALUES ($1, $2, 'in_progress')
        `;
        
        await client.query(insertNextProcess, [id, nextStage.rows[0].id]);
      }
    }
    
    await client.query('COMMIT');
    
    res.json({
      message: `候補者は${current.stage_name}を${action === 'pass' ? '通過' : '不合格'}しました`,
      action,
      stage: current.stage_name
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error advancing stage:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  } finally {
    client.release();
  }
});

module.exports = router;