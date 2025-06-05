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

// 面接評価の登録
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const {
      candidate_id,
      interviewer_name,
      interview_date,
      technical_score,
      communication_score,
      culture_fit_score,
      overall_recommendation,
      comments
    } = req.body;
    
    // バリデーション
    if (!candidate_id || !interviewer_name || !interview_date) {
      return res.status(400).json({ 
        error: '候補者ID、面接官名、面接日は必須です' 
      });
    }
    
    // スコアの検証（1-5の範囲）
    const scores = [technical_score, communication_score, culture_fit_score];
    if (scores.some(score => score && (score < 1 || score > 5))) {
      return res.status(400).json({ 
        error: 'スコアは1から5の範囲で入力してください' 
      });
    }
    
    await client.query('BEGIN');
    
    // 現在進行中のプロセスを取得
    const processQuery = `
      SELECT rp.id, rs.name as stage_name
      FROM recruitment_processes rp
      JOIN recruitment_stages rs ON rp.stage_id = rs.id
      WHERE rp.candidate_id = $1 
        AND rp.status = 'in_progress'
        AND rs.name IN ('一次面接', '最終面接')
      ORDER BY rp.entered_at DESC
      LIMIT 1
    `;
    
    const processResult = await client.query(processQuery, [candidate_id]);
    
    if (processResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'この候補者は面接段階にありません' 
      });
    }
    
    const process_id = processResult.rows[0].id;
    
    // 面接評価を登録
    const insertQuery = `
      INSERT INTO interview_evaluations (
        process_id,
        interviewer_name,
        interview_date,
        technical_score,
        communication_score,
        culture_fit_score,
        overall_recommendation,
        comments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      process_id,
      interviewer_name,
      interview_date,
      technical_score || null,
      communication_score || null,
      culture_fit_score || null,
      overall_recommendation || null,
      comments || null
    ];
    
    const result = await client.query(insertQuery, values);
    
    await client.query('COMMIT');
    
    res.status(201).json({
      message: '面接評価が登録されました',
      evaluation: result.rows[0],
      stage: processResult.rows[0].stage_name
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating evaluation:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  } finally {
    client.release();
  }
});

// 候補者の評価一覧取得
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const query = `
      SELECT 
        ie.*,
        rs.name as stage_name,
        c.first_name,
        c.last_name
      FROM interview_evaluations ie
      JOIN recruitment_processes rp ON ie.process_id = rp.id
      JOIN recruitment_stages rs ON rp.stage_id = rs.id
      JOIN candidates c ON rp.candidate_id = c.id
      WHERE rp.candidate_id = $1
      ORDER BY ie.interview_date DESC
    `;
    
    const result = await pool.query(query, [candidateId]);
    
    // 平均スコアの計算
    const evaluations = result.rows;
    let avgTechnical = 0, avgCommunication = 0, avgCultureFit = 0;
    let count = 0;
    
    evaluations.forEach(eval => {
      if (eval.technical_score) {
        avgTechnical += parseInt(eval.technical_score);
        count++;
      }
      if (eval.communication_score) {
        avgCommunication += parseInt(eval.communication_score);
      }
      if (eval.culture_fit_score) {
        avgCultureFit += parseInt(eval.culture_fit_score);
      }
    });
    
    const averages = count > 0 ? {
      technical: (avgTechnical / count).toFixed(1),
      communication: (avgCommunication / count).toFixed(1),
      culture_fit: (avgCultureFit / count).toFixed(1),
      overall: ((avgTechnical + avgCommunication + avgCultureFit) / (count * 3)).toFixed(1)
    } : null;
    
    res.json({
      candidate: evaluations.length > 0 ? {
        id: candidateId,
        name: `${evaluations[0].last_name} ${evaluations[0].first_name}`
      } : null,
      evaluations,
      averages,
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

// 評価サマリー（ダッシュボード用）
router.get('/summary', async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(DISTINCT ie.id) as total_evaluations,
        COUNT(DISTINCT rp.candidate_id) as evaluated_candidates,
        AVG(ie.technical_score) as avg_technical,
        AVG(ie.communication_score) as avg_communication,
        AVG(ie.culture_fit_score) as avg_culture_fit,
        COUNT(CASE WHEN ie.overall_recommendation = 'strong_yes' THEN 1 END) as strong_yes_count,
        COUNT(CASE WHEN ie.overall_recommendation = 'yes' THEN 1 END) as yes_count,
        COUNT(CASE WHEN ie.overall_recommendation = 'neutral' THEN 1 END) as neutral_count,
        COUNT(CASE WHEN ie.overall_recommendation = 'no' THEN 1 END) as no_count,
        COUNT(CASE WHEN ie.overall_recommendation = 'strong_no' THEN 1 END) as strong_no_count
      FROM interview_evaluations ie
      JOIN recruitment_processes rp ON ie.process_id = rp.id
      WHERE ie.created_at >= CURRENT_DATE - INTERVAL '30 days'
    `;
    
    const result = await pool.query(query);
    const summary = result.rows[0];
    
    // 数値を整形
    Object.keys(summary).forEach(key => {
      if (key.startsWith('avg_') && summary[key]) {
        summary[key] = parseFloat(summary[key]).toFixed(1);
      }
    });
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching evaluation summary:', error);
    res.status(500).json({ error: 'データベースエラーが発生しました' });
  }
});

module.exports = router;