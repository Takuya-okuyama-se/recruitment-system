// ハンバーガーメニューの問題を修正するスクリプト
const fs = require('fs');
const path = require('path');

// 修正が必要なHTMLファイルのリスト
const htmlFiles = [
    'aptitude-test-form.html',
    'candidate-detail.html',
    'candidate-form-supabase.html',
    'candidate-form.html',
    'dashboard-supabase.html',
    'dashboard.html',
    'data-management.html',
    'db-viewer.html',
    'evaluation-form-complete.html',
    'evaluation-form.html',
    'index.html',
    'offer-management.html',
    'one-click-start.html',
    'organization-settings.html',
    'stage-detail.html',
    'test-supabase-connection.html'
];

// 各ファイルを処理
htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 元のコンテンツを保存
        const originalContent = content;
        
        // 1. 既存のnavタグ内のインラインスタイルを削除
        content = content.replace(/<nav>\s*<div[^>]*style="[^"]*"[^>]*>/g, '<nav>\n    <div>');
        
        // 2. unified-styles.cssが他のスタイルの後に読み込まれるように修正
        // まず、既存のunified-styles.cssのリンクを削除
        content = content.replace(/<link rel="stylesheet" href="unified-styles.css">\s*/g, '');
        
        // 3. </head>タグの直前にunified-styles.cssを追加（最後に読み込まれるように）
        content = content.replace(/<\/head>/g, '    <link rel="stylesheet" href="unified-styles.css">\n</head>');
        
        // 4. nav-hamburger.jsがbodyの最後で読み込まれているか確認
        // すでに正しい位置にある場合はそのまま
        
        // 5. ナビゲーション内の.nav-linkスタイルの上書きを防ぐ
        // styleタグ内の.nav-linkスタイルを削除または名前変更
        content = content.replace(/\.nav-link\s*{[^}]*}/g, (match) => {
            // .nav-linkのローカルスタイルをコメントアウト
            return `/* Local nav-link styles removed to use unified styles\n${match}\n*/`;
        });
        
        // 変更があった場合のみファイルを保存
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${filename}`);
        } else {
            console.log(`⏭️  Skipped: ${filename} (no changes needed)`);
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
    }
});

console.log('\n✨ Hamburger menu fix completed!');
console.log('\nNext steps:');
console.log('1. Check if the hamburger menu works on mobile devices');
console.log('2. If issues persist, run "node verify-nav-structure.js" to check the navigation structure');