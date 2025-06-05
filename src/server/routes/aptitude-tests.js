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

// 適性検査結果の登録
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      candidate_id,
      test_date,
      // 能力検査
      verbal_score,
      numerical_score,
      logical_score,
      // 性格検査
      leadership_score,
      cooperation_score,
      stress_resistance_score,
      // 総合判定
      overall_result,
      notes
    } = req.body;
    
    // バリデーション
    if (!candidate_id || !test_date) {
      return res.status(400).json({ 
        error: '候補者IDと検査日は必須です' 
      });
    }
    
    await client.query('BEGIN');
    
    // 適性検査段階のプロセスを確認
    const processQuery = `
      SELECT rp.id, rs.name as stage_name
      FROM recruitment_processes rp
      JOIN recruitment_stages rs ON rp.stage_id = rs.id
      WHERE rp.candidate_id = $1 
        AND rp.status = 'in_progress'
        AND rs.name = '適性検査'
      ORDER BY rp.entered_at DESC
      LIMIT 1
    `;
    
    const processResult = await client.query(processQuery, [candidate_id]);
    
    if (processResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'この候補者は適性検査段階にありません' 
      });
    }
    
    const process_id = processResult.rows[0].id;
    
    // 適性検査結果テーブルを作成（存在しない場合）
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS aptitude_test_results (
        id SERIAL PRIMARY KEY,
        process_id INTEGER REFERENCES recruitment_processes(id),
        test_date DATE NOT NULL,
        verbal_score INTEGER CHECK (verbal_score >= 0 AND verbal_score <= 100),
        numerical_score INTEGER CHECK (numerical_score >= 0 AND numerical_score <= 100),
        logical_score INTEGER CHECK (logical_score >= 0 AND logical_score <= 100),
        leadership_score INTEGER CHECK (leadership_score >= 1 AND leadership_score <= 5),
        cooperation_score INTEGER CHECK (cooperation_score >= 1 AND cooperation_score <= 5),
        stress_resistance_score INTEGER CHECK (stress_resistance_score >= 1 AND stress_resistance_score <= 5),
        overall_result VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await client.query(createTableQuery);
    
    // 適性検査結果を登録
    const insertQuery = `
      INSERT INTO aptitude_test_results (
        process_id,
        test_date,
        verbal_score,
        numerical_score,
        logical_score,
        leadership_score,
        cooperation_score,
        stress_resistance_score,
        overall_result,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      process_id,
      test_date,
      verbal_score || null,
      numerical_score || null,
      logical_score || null,
      leadership_score || null,
      cooperation_score || null,
      stress_resistance_score || null,
      overall_result || null,
      notes || null
    ];
    
    const result = await client.query(insertQuery, values);
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: '適性検査結果が登録されました',
      result: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating aptitude test result:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  } finally {
    client.release();
  }
});

// 候補者の適性検査結果取得
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const query = `
      SELECT 
        atr.*,
        rs.name as stage_name,
        c.first_name,
        c.last_name
      FROM aptitude_test_results atr
      JOIN recruitment_processes rp ON atr.process_id = rp.id
      JOIN recruitment_stages rs ON rp.stage_id = rs.id
      JOIN candidates c ON rp.candidate_id = c.id
      WHERE rp.candidate_id = $1
      ORDER BY atr.test_date DESC
    `;
    
    const result = await pool.query(query, [candidateId]);
    
    if (result.rows.length > 0) {
      const latest = result.rows[0];
      
      // 能力検査の平均スコア
      const abilityAvg = (
        (parseInt(latest.verbal_score) || 0) +
        (parseInt(latest.numerical_score) || 0) +
        (parseInt(latest.logical_score) || 0)
      ) / 3;
      
      // 性格検査の平均スコア
      const personalityAvg = (
        (parseInt(latest.leadership_score) || 0) +
        (parseInt(latest.cooperation_score) || 0) +
        (parseInt(latest.stress_resistance_score) || 0)
      ) / 3;
      
      res.json({
        candidate: {
          id: candidateId,
          name: `${latest.last_name} ${latest.first_name}`
        },
        results: result.rows,
        summary: {
          ability_average: abilityAvg.toFixed(1),
          personality_average: personalityAvg.toFixed(1),
          latest_result: latest.overall_result
        }
      });
    } else {
      res.json({
        candidate: null,
        results: [],
        summary: null
      });
    }
  } catch (error) {
    console.error('Error fetching aptitude test results:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

// 適性検査統計（ダッシュボード用）
router.get('/statistics', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_tests,
        AVG(verbal_score) as avg_verbal,
        AVG(numerical_score) as avg_numerical,
        AVG(logical_score) as avg_logical,
        AVG(leadership_score * 20) as avg_leadership,
        AVG(cooperation_score * 20) as avg_cooperation,
        AVG(stress_resistance_score * 20) as avg_stress_resistance,
        COUNT(CASE WHEN overall_result = 'excellent' THEN 1 END) as excellent_count,
        COUNT(CASE WHEN overall_result = 'good' THEN 1 END) as good_count,
        COUNT(CASE WHEN overall_result = 'average' THEN 1 END) as average_count,
        COUNT(CASE WHEN overall_result = 'below_average' THEN 1 END) as below_average_count
      FROM aptitude_test_results
      WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
    `;
    
    const result = await pool.query(query);
    const stats = result.rows[0];
    
    // 数値を整形
    Object.keys(stats).forEach(key => {
      if (key.startsWith('avg_') && stats[key]) {
        stats[key] = parseFloat(stats[key]).toFixed(1);
      }
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching aptitude test statistics:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

module.exports = router;