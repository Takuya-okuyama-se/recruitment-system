const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'recruitment_system',
  password: 'postgres123',
  port: 5432,
});

async function testConnection() {
  try {
    console.log('データベース接続テスト中...');
    
    // 接続テスト
    const client = await pool.connect();
    console.log('✅ データベースに接続成功');
    
    // テーブル確認
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\n既存のテーブル:');
    tables.rows.forEach(t => console.log('- ' + t.table_name));
    
    // job_positionsテーブルの確認
    const positions = await client.query('SELECT * FROM job_positions');
    console.log('\n職種マスタ件数:', positions.rowCount);
    
    // departmentsテーブルの確認
    const departments = await client.query('SELECT * FROM departments');
    console.log('部門マスタ件数:', departments.rowCount);
    
    // 候補者テーブルの確認
    const candidates = await client.query('SELECT COUNT(*) FROM candidates');
    console.log('候補者数:', candidates.rows[0].count);
    
    client.release();
    pool.end();
  } catch (error) {
    console.error('❌ エラー:', error.message);
    pool.end();
  }
}

testConnection();