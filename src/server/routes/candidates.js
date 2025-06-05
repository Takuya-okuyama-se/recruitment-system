const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// データベース接続（実際の実装では別ファイルに分離）
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'recruitment_system',
  password: process.env.DB_PASSWORD || 'postgres123',
  port: process.env.DB_PORT || 5432,
});

// 候補者登録のバリデーションルール
const candidateValidationRules = () => {
  return [
    body('first_name').notEmpty().withMessage('名は必須です'),
    body('last_name').notEmpty().withMessage('姓は必須です'),
    body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
    body('phone').optional().isMobilePhone('ja-JP'),
    body('applied_position_id').isInt().withMessage('応募職種を選択してください'),
    body('years_of_experience').optional().isInt({ min: 0 })
  ];
};

// バリデーションエラーハンドラ
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 候補者一覧取得
router.get('/', async (req, res) => {
  try {
    const { stage, status, department, limit = 50, offset = 0 } = req.query;
    
    let query = `
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
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (stage) {
      query += ` AND rs.id = $${paramIndex++}`;
      params.push(stage);
    }
    if (status) {
      query += ` AND rp.status = $${paramIndex++}`;
      params.push(status);
    }
    if (department) {
      query += ` AND d.id = $${paramIndex++}`;
      params.push(department);
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    res.json({
      candidates: result.rows,
      total: result.rowCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 候補者詳細取得
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 候補者基本情報
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
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    // 採用プロセス履歴
    const processQuery = `
      SELECT 
        rp.*,
        rs.name as stage_name,
        rs.stage_order
      FROM recruitment_processes rp
      JOIN recruitment_stages rs ON rp.stage_id = rs.id
      WHERE rp.candidate_id = $1
      ORDER BY rp.entered_at DESC
    `;
    
    const processResult = await pool.query(processQuery, [id]);
    
    res.json({
      candidate: candidateResult.rows[0],
      process_history: processResult.rows
    });
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 候補者登録
router.post('/', candidateValidationRules(), validate, async (req, res) => {
  const client = await pool.connect();
  
  try {
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
      first_name, last_name, email, phone,
      current_company, years_of_experience,
      education, languages, applied_position_id, source
    ];
    
    const candidateResult = await client.query(insertCandidateQuery, candidateValues);
    const newCandidate = candidateResult.rows[0];
    
    // 最初の採用プロセス（書類選考）を自動的に開始
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
    
    if (error.code === '23505') { // unique violation
      return res.status(409).json({ error: 'このメールアドレスは既に登録されています' });
    }
    
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// 候補者情報更新
router.put('/:id', candidateValidationRules(), validate, async (req, res) => {
  try {
    const { id } = req.params;
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
    
    const updateQuery = `
      UPDATE candidates SET
        first_name = $1,
        last_name = $2,
        email = $3,
        phone = $4,
        current_company = $5,
        years_of_experience = $6,
        education = $7,
        languages = $8,
        applied_position_id = $9,
        source = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `;
    
    const values = [
      first_name, last_name, email, phone,
      current_company, years_of_experience,
      education, languages, applied_position_id,
      source, id
    ];
    
    const result = await pool.query(updateQuery, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json({
      message: '候補者情報が更新されました',
      candidate: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 採用ステージ更新
router.post('/:id/advance-stage', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // action: 'pass' or 'fail'
    
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
      notes,
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
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;