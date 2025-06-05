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

// 部門一覧取得
router.get('/departments', async (req, res) => {
  try {
    const query = `
      SELECT 
        d.*,
        COUNT(DISTINCT jp.id) as position_count,
        SUM(jp.target_count) as total_target,
        COUNT(DISTINCT c.id) as total_applicants
      FROM departments d
      LEFT JOIN job_positions jp ON d.id = jp.department_id
      LEFT JOIN candidates c ON jp.id = c.applied_position_id
      GROUP BY d.id
      ORDER BY d.name
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('部門一覧取得エラー:', error);
    res.status(500).json({ error: '部門一覧の取得に失敗しました' });
  }
});

// 部門詳細取得
router.get('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM departments WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '部門が見つかりません' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('部門詳細取得エラー:', error);
    res.status(500).json({ error: '部門詳細の取得に失敗しました' });
  }
});

// 部門追加
router.post('/departments', async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: '部門名は必須です' });
    }
    
    const query = `
      INSERT INTO departments (name, code, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, code, description]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('部門追加エラー:', error);
    res.status(500).json({ error: '部門の追加に失敗しました' });
  }
});

// 部門更新
router.put('/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: '部門名は必須です' });
    }
    
    const query = `
      UPDATE departments 
      SET name = $2, code = $3, description = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, name, code, description]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '部門が見つかりません' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('部門更新エラー:', error);
    res.status(500).json({ error: '部門の更新に失敗しました' });
  }
});

// 部門削除
router.delete('/departments/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');
    
    // 関連する職種があるか確認
    const checkQuery = 'SELECT COUNT(*) FROM job_positions WHERE department_id = $1';
    const checkResult = await client.query(checkQuery, [id]);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'この部門には募集職種が登録されています。先に職種を削除してください。' 
      });
    }
    
    // 部門を削除
    const deleteQuery = 'DELETE FROM departments WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: '部門が見つかりません' });
    }
    
    await client.query('COMMIT');
    res.json({ message: '部門を削除しました' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('部門削除エラー:', error);
    res.status(500).json({ error: '部門の削除に失敗しました' });
  } finally {
    client.release();
  }
});

// 職種一覧取得
router.get('/positions', async (req, res) => {
  try {
    const query = `
      SELECT 
        jp.*,
        d.name as department_name,
        COUNT(DISTINCT c.id) as applicant_count,
        COUNT(DISTINCT CASE WHEN jo.status = 'accepted' THEN c.id END) as hired_count
      FROM job_positions jp
      LEFT JOIN departments d ON jp.department_id = d.id
      LEFT JOIN candidates c ON jp.id = c.applied_position_id
      LEFT JOIN job_offers jo ON c.id = jo.candidate_id
      GROUP BY jp.id, d.name
      ORDER BY d.name, jp.title
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('職種一覧取得エラー:', error);
    res.status(500).json({ error: '職種一覧の取得に失敗しました' });
  }
});

// 職種詳細取得
router.get('/positions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT jp.*, d.name as department_name
      FROM job_positions jp
      LEFT JOIN departments d ON jp.department_id = d.id
      WHERE jp.id = $1
    `;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '職種が見つかりません' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('職種詳細取得エラー:', error);
    res.status(500).json({ error: '職種詳細の取得に失敗しました' });
  }
});

// 職種追加
router.post('/positions', async (req, res) => {
  try {
    const { department_id, title, requirements, target_count } = req.body;
    
    if (!department_id || !title || !target_count) {
      return res.status(400).json({ 
        error: '部門ID、職種名、採用予定人数は必須です' 
      });
    }
    
    const query = `
      INSERT INTO job_positions (department_id, title, requirements, target_count)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      department_id, 
      title, 
      requirements, 
      target_count
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('職種追加エラー:', error);
    res.status(500).json({ error: '職種の追加に失敗しました' });
  }
});

// 職種更新
router.put('/positions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { department_id, title, requirements, target_count } = req.body;
    
    if (!department_id || !title || !target_count) {
      return res.status(400).json({ 
        error: '部門ID、職種名、採用予定人数は必須です' 
      });
    }
    
    const query = `
      UPDATE job_positions 
      SET department_id = $2, title = $3, requirements = $4, target_count = $5
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      id,
      department_id,
      title,
      requirements,
      target_count
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: '職種が見つかりません' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('職種更新エラー:', error);
    res.status(500).json({ error: '職種の更新に失敗しました' });
  }
});

// 職種削除
router.delete('/positions/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    
    await client.query('BEGIN');
    
    // 関連する候補者があるか確認
    const checkQuery = 'SELECT COUNT(*) FROM candidates WHERE applied_position_id = $1';
    const checkResult = await client.query(checkQuery, [id]);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'この職種には応募者が存在します。削除できません。' 
      });
    }
    
    // 職種を削除
    const deleteQuery = 'DELETE FROM job_positions WHERE id = $1 RETURNING *';
    const result = await client.query(deleteQuery, [id]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: '職種が見つかりません' });
    }
    
    await client.query('COMMIT');
    res.json({ message: '職種を削除しました' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('職種削除エラー:', error);
    res.status(500).json({ error: '職種の削除に失敗しました' });
  } finally {
    client.release();
  }
});

// 採用予定人数の一括更新
router.put('/positions/bulk-update-targets', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { updates } = req.body; // [{id: 1, target_count: 5}, ...]
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: '更新データが必要です' });
    }
    
    await client.query('BEGIN');
    
    const results = [];
    for (const update of updates) {
      const query = `
        UPDATE job_positions 
        SET target_count = $2
        WHERE id = $1
        RETURNING id, title, target_count
      `;
      
      const result = await client.query(query, [update.id, update.target_count]);
      if (result.rows.length > 0) {
        results.push(result.rows[0]);
      }
    }
    
    await client.query('COMMIT');
    res.json({ 
      message: '採用予定人数を更新しました',
      updated: results 
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('一括更新エラー:', error);
    res.status(500).json({ error: '採用予定人数の更新に失敗しました' });
  } finally {
    client.release();
  }
});

module.exports = router;