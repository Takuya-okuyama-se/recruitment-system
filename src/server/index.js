const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL接続設定
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'recruitment_system',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

app.use(cors());
app.use(bodyParser.json());

// 静的ファイルの配信（重要！）
app.use(express.static(path.join(__dirname, '../../')));

// ルートパスの追加
app.get('/', (req, res) => {
  res.json({
    message: '採用管理システム採用管理システム API',
    version: '1.0.0',
    endpoints: {
      candidates: '/api/candidates',
      recruitment_overview: '/api/recruitment/overview',
      department_metrics: '/api/recruitment/by-department',
      sources: '/api/recruitment/sources'
    }
  });
});

// ルーターの追加
const candidatesRouter = require('./routes/candidates-simple');
const evaluationsRouter = require('./routes/evaluations');
const aptitudeTestsRouter = require('./routes/aptitude-tests');
const dataManagementRouter = require('./routes/data-management');
const organizationRouter = require('./routes/organization');
app.use('/api/candidates', candidatesRouter);
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/aptitude-tests', aptitudeTestsRouter);
app.use('/api/data', dataManagementRouter);
app.use('/api/organization', organizationRouter);

// 採用プロセス可視化エンドポイント
app.get('/api/recruitment/overview', async (req, res) => {
  try {
    // 各ステージの候補者数と通過率を取得
    const stageMetrics = await pool.query(`
      WITH stage_counts AS (
        SELECT 
          rs.id,
          rs.name,
          rs.stage_order,
          COUNT(DISTINCT rp.candidate_id) as total_candidates,
          COUNT(DISTINCT CASE WHEN rp.status = 'passed' THEN rp.candidate_id END) as passed_candidates
        FROM recruitment_stages rs
        LEFT JOIN recruitment_processes rp ON rs.id = rp.stage_id
        WHERE rs.is_active = true
        GROUP BY rs.id, rs.name, rs.stage_order
        ORDER BY rs.stage_order
      )
      SELECT 
        *,
        CASE 
          WHEN total_candidates > 0 
          THEN ROUND((passed_candidates::DECIMAL / total_candidates) * 100, 1)
          ELSE 0 
        END as pass_rate
      FROM stage_counts
    `);

    // 平均所要日数を取得
    const avgDuration = await pool.query(`
      SELECT 
        rs.name as stage_name,
        AVG(rp.days_in_stage) as avg_days
      FROM recruitment_processes rp
      JOIN recruitment_stages rs ON rp.stage_id = rs.id
      WHERE rp.completed_at IS NOT NULL
      GROUP BY rs.id, rs.name, rs.stage_order
      ORDER BY rs.stage_order
    `);

    res.json({
      stages: stageMetrics.rows,
      durations: avgDuration.rows
    });
  } catch (error) {
    console.error('Error fetching recruitment overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 部門別採用進捗
app.get('/api/recruitment/by-department', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        d.name as department,
        COUNT(DISTINCT jp.id) as open_positions,
        SUM(jp.target_count) as target_hires,
        COUNT(DISTINCT c.id) as total_candidates,
        COUNT(DISTINCT CASE WHEN jo.status = 'accepted' THEN jo.candidate_id END) as hired
      FROM departments d
      LEFT JOIN job_positions jp ON d.id = jp.department_id
      LEFT JOIN candidates c ON jp.id = c.applied_position_id
      LEFT JOIN job_offers jo ON c.id = jo.candidate_id
      GROUP BY d.id, d.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching department metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 候補者一覧
app.get('/api/candidates', async (req, res) => {
  try {
    const { stage, status, department } = req.query;
    
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
          candidate_id, stage_id, status
        FROM recruitment_processes
        ORDER BY candidate_id, entered_at DESC
      ) rp ON c.id = rp.candidate_id
      LEFT JOIN recruitment_stages rs ON rp.stage_id = rs.id
      WHERE 1=1
    `;

    const params = [];
    if (stage) {
      params.push(stage);
      query += ` AND rs.id = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND rp.status = $${params.length}`;
    }
    if (department) {
      params.push(department);
      query += ` AND d.id = $${params.length}`;
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 採用チャネル分析
app.get('/api/recruitment/sources', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.source,
        COUNT(*) as total_applications,
        COUNT(DISTINCT CASE WHEN jo.status = 'accepted' THEN c.id END) as hired,
        ROUND(
          COUNT(DISTINCT CASE WHEN jo.status = 'accepted' THEN c.id END)::DECIMAL / 
          NULLIF(COUNT(*), 0) * 100, 
          1
        ) as conversion_rate
      FROM candidates c
      LEFT JOIN job_offers jo ON c.id = jo.candidate_id
      GROUP BY c.source
      ORDER BY total_applications DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching source metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});