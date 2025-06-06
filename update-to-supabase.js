const fs = require('fs');
const path = require('path');

// HTMLファイルを更新してSupabase対応にする
function updateHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 重複したナビゲーションを削除（古いオレンジ色のナビゲーション）
    content = content.replace(/<nav style="background-color: #FF6B35[^>]*>[\s\S]*?<\/nav>/g, '');
    
    // fetch API呼び出しをSupabase呼び出しに置換
    content = content.replace(/await fetch\(`\$\{API_BASE\}\/api\/candidates`\)/g, 
        'await window.SUPABASE_CLIENT.from("candidates").select("*")');
    
    // fetchのレスポンス処理を調整
    content = content.replace(/const response = await window\.SUPABASE_CLIENT\.from\("candidates"\)\.select\("\*"\);\s*const data = await response\.json\(\);/g,
        'const { data, error } = await window.SUPABASE_CLIENT.from("candidates").select("*");\nif (error) throw error;');
    
    // API_BASE変数の参照を削除
    content = content.replace(/\$\{API_BASE\}/g, '');
    
    return content;
}

// 対象ファイル
const files = [
    'evaluation-form.html',
    'aptitude-test-form.html',
    'offer-management.html',
    'data-management.html',
    'organization-settings.html',
    'db-viewer.html',
    'stage-detail.html'
];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const updated = updateHtmlFile(filePath);
        fs.writeFileSync(filePath, updated, 'utf8');
        console.log(`Updated: ${file}`);
    }
});

console.log('Supabase update complete!');