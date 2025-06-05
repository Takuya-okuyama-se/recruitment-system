const { Client } = require('pg');

async function testConnection() {
    console.log('データベース接続テスト開始...\n');
    
    // 環境変数の確認
    console.log('環境変数:');
    console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
    console.log('DB_PORT:', process.env.DB_PORT || '5432');
    console.log('DB_NAME:', process.env.DB_NAME || 'recruitment_system');
    console.log('DB_USER:', process.env.DB_USER || 'postgres');
    console.log('\n');

    const configs = [
        {
            name: 'Docker内部接続 (postgres)',
            config: {
                host: 'postgres',
                port: 5432,
                database: 'recruitment_system',
                user: 'postgres',
                password: 'postgres123'
            }
        },
        {
            name: 'localhost接続',
            config: {
                host: 'localhost',
                port: 5432,
                database: 'recruitment_system',
                user: 'postgres',
                password: 'postgres123'
            }
        },
        {
            name: 'コンテナ名接続 (sunstar_db)',
            config: {
                host: 'sunstar_db',
                port: 5432,
                database: 'recruitment_system',
                user: 'postgres',
                password: 'postgres123'
            }
        }
    ];

    for (const { name, config } of configs) {
        console.log(`\n=== ${name} をテスト中 ===`);
        const client = new Client(config);
        
        try {
            await client.connect();
            console.log('✅ 接続成功!');
            
            // テーブル確認
            const result = await client.query('SELECT COUNT(*) FROM job_positions');
            console.log(`job_positions テーブルのレコード数: ${result.rows[0].count}`);
            
            await client.end();
        } catch (error) {
            console.log('❌ 接続失敗:', error.message);
        }
    }
    
    console.log('\n\n推奨される対処法:');
    console.log('1. PostgreSQLコンテナが起動していることを確認:');
    console.log('   sudo docker ps | grep postgres');
    console.log('\n2. PostgreSQLコンテナを再起動:');
    console.log('   sudo docker-compose restart postgres');
    console.log('\n3. 完全に再起動:');
    console.log('   sudo bash full-restart.sh');
}

// DNS解決のテスト
const dns = require('dns');
const { promisify } = require('util');
const resolve4 = promisify(dns.resolve4);

async function testDNS() {
    console.log('\n\n=== DNS解決テスト ===');
    const hosts = ['postgres', 'localhost', 'sunstar_db'];
    
    for (const host of hosts) {
        try {
            const addresses = await resolve4(host);
            console.log(`✅ ${host}: ${addresses.join(', ')}`);
        } catch (error) {
            console.log(`❌ ${host}: 解決できません (${error.message})`);
        }
    }
}

// メイン実行
(async () => {
    await testConnection();
    await testDNS();
})();