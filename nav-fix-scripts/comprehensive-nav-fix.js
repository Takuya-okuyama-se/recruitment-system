// 包括的なナビゲーション修正スクリプト
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

// 標準的なナビゲーションHTML
const standardNavHTML = `<nav>
    <div>
        <a href="dashboard.html" class="nav-link">📊 ダッシュボード</a>
        <a href="candidate-form.html" class="nav-link">👤 候補者登録</a>
        <a href="evaluation-form.html" class="nav-link">📝 面接評価</a>
        <a href="aptitude-test-form.html" class="nav-link">📊 適性検査</a>
        <a href="offer-management.html" class="nav-link">💼 内定管理</a>
        <a href="data-management.html" class="nav-link">📈 データ管理</a>
        <a href="organization-settings.html" class="nav-link">⚙️ 組織設定</a>
        <a href="db-viewer.html" class="nav-link">🗄️ DBビューア</a>
    </div>
</nav>`;

let totalFixed = 0;
let totalErrors = 0;

// 各ファイルを処理
htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        let changes = [];
        
        // 1. navigation.jsの参照を削除（nav-hamburger.jsと競合するため）
        if (content.includes('navigation.js')) {
            content = content.replace(/<script src="navigation\.js"><\/script>\s*/g, '');
            changes.push('Removed navigation.js reference');
        }
        
        // 2. 既存のnavタグを標準化
        const navMatch = content.match(/<nav>([\s\S]*?)<\/nav>/);
        if (navMatch) {
            const oldNav = navMatch[0];
            // インラインスタイルを持つdivタグを修正
            let newNav = oldNav.replace(/<div[^>]*style="[^"]*"[^>]*>/g, '<div>');
            
            if (newNav !== oldNav) {
                content = content.replace(oldNav, newNav);
                changes.push('Removed inline styles from nav div');
            }
        } else if (filename === 'dashboard-supabase.html') {
            // dashboard-supabase.htmlにはnavタグがないので追加
            const headerMatch = content.match(/<div class="header">/);
            if (headerMatch) {
                content = content.replace('<body>', `<body>\n\n${standardNavHTML}\n`);
                changes.push('Added missing nav element');
            }
        }
        
        // 3. ローカルの.nav-linkスタイルをコメントアウト
        const styleTagMatch = content.match(/<style>([\s\S]*?)<\/style>/g);
        if (styleTagMatch) {
            styleTagMatch.forEach(styleTag => {
                if (styleTag.includes('.nav-link')) {
                    const newStyleTag = styleTag.replace(
                        /\.nav-link\s*{[^}]*}/g, 
                        match => `/* Commented out to use unified styles\n${match}\n*/`
                    );
                    if (newStyleTag !== styleTag) {
                        content = content.replace(styleTag, newStyleTag);
                        changes.push('Commented out local .nav-link styles');
                    }
                }
            });
        }
        
        // 4. unified-styles.cssが</head>の直前にあることを確認
        if (!content.includes('unified-styles.css')) {
            // unified-styles.cssがない場合は追加
            content = content.replace('</head>', '    <link rel="stylesheet" href="unified-styles.css">\n</head>');
            changes.push('Added unified-styles.css');
        } else {
            // すでにある場合は位置を確認し、必要なら移動
            const unifiedStylesRegex = /<link rel="stylesheet" href="unified-styles\.css">\s*/g;
            const headEndIndex = content.indexOf('</head>');
            const unifiedStylesIndex = content.search(unifiedStylesRegex);
            
            if (unifiedStylesIndex > -1 && unifiedStylesIndex < headEndIndex) {
                // スタイルタグの後にあるか確認
                const afterUnified = content.substring(unifiedStylesIndex, headEndIndex);
                if (afterUnified.includes('<style>')) {
                    // unified-styles.cssを削除して最後に追加
                    content = content.replace(unifiedStylesRegex, '');
                    content = content.replace('</head>', '    <link rel="stylesheet" href="unified-styles.css">\n</head>');
                    changes.push('Moved unified-styles.css to end of head');
                }
            }
        }
        
        // 5. nav-hamburger.jsが</body>の直前にあることを確認
        if (!content.includes('nav-hamburger.js')) {
            content = content.replace('</body>', '    <script src="nav-hamburger.js"></script>\n</body>');
            changes.push('Added nav-hamburger.js');
        }
        
        // 変更があった場合のみファイルを保存
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`\n✅ Fixed: ${filename}`);
            changes.forEach(change => console.log(`   - ${change}`));
            totalFixed++;
        } else {
            console.log(`⏭️  Skipped: ${filename} (no changes needed)`);
        }
        
    } catch (error) {
        console.error(`\n❌ Error processing ${filename}:`, error.message);
        totalErrors++;
    }
});

console.log('\n========================================');
console.log(`✨ Navigation fix completed!`);
console.log(`   Files fixed: ${totalFixed}`);
console.log(`   Errors: ${totalErrors}`);
console.log('========================================\n');

if (totalFixed > 0) {
    console.log('🔍 Please test the hamburger menu on mobile devices.');
    console.log('💡 If issues persist, check the browser console for JavaScript errors.');
}