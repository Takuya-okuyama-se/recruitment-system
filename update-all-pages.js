const fs = require('fs');
const path = require('path');

// ナビゲーションHTML
const navigationHTML = `
<nav style="background-color: #2c3e50; padding: 0; margin: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <div style="max-width: 1400px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
        <a href="dashboard.html" class="nav-link">📊 ダッシュボード</a>
        <a href="candidate-form.html" class="nav-link">👤 候補者登録</a>
        <a href="evaluation-form.html" class="nav-link">📝 面接評価</a>
        <a href="aptitude-test-form.html" class="nav-link">📊 適性検査</a>
        <a href="offer-management.html" class="nav-link">💼 内定管理</a>
        <a href="data-management.html" class="nav-link">📈 データ管理</a>
        <a href="organization-settings.html" class="nav-link">⚙️ 組織設定</a>
        <a href="db-viewer.html" class="nav-link">🗄️ DBビューア</a>
    </div>
</nav>

<style>
.nav-link {
    color: white;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 5px;
    transition: all 0.3s ease;
    display: inline-block;
    font-size: 14px;
}
.nav-link:hover {
    background-color: #34495e;
    transform: translateY(-2px);
}
</style>
`;

// 更新対象のHTMLファイル
const htmlFiles = [
    'dashboard.html',
    'candidate-form.html',
    'evaluation-form.html',
    'aptitude-test-form.html',
    'offer-management.html',
    'data-management.html',
    'organization-settings.html',
    'db-viewer.html',
    'stage-detail.html',
    'index.html'
];

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // config.jsをsupabase-config.jsに置換
        content = content.replace(/<script src="config\.js"><\/script>/g, 
            '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n    <script src="supabase-config.js"></script>');
        
        // API_BASE定義を削除
        content = content.replace(/const API_BASE = .+;/g, 
            '// Supabaseクライアントはsupabase-config.jsで定義済み');
        
        // <body>タグの直後にナビゲーションを追加（既に存在しない場合）
        if (!content.includes('nav-link')) {
            content = content.replace(/<body[^>]*>/, (match) => {
                return match + '\n' + navigationHTML;
            });
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
});

console.log('All files updated!');