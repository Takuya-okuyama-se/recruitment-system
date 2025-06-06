// ナビゲーション構造を検証するスクリプト
const fs = require('fs');
const path = require('path');

// チェックするHTMLファイル
const htmlFiles = [
    'dashboard.html',
    'dashboard-supabase.html',
    'candidate-form.html',
    'evaluation-form.html',
    'aptitude-test-form.html',
    'offer-management.html',
    'data-management.html',
    'organization-settings.html',
    'db-viewer.html'
];

console.log('🔍 Verifying navigation structure in HTML files...\n');

htmlFiles.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        console.log(`\n📄 ${filename}:`);
        
        // 1. nav要素の存在確認
        const hasNav = content.includes('<nav>');
        console.log(`  ✓ Has <nav> element: ${hasNav ? 'Yes' : 'No'}`);
        
        // 2. nav内のdiv構造確認
        const navMatch = content.match(/<nav>([\s\S]*?)<\/nav>/);
        if (navMatch) {
            const navContent = navMatch[1];
            const hasDivInNav = navContent.includes('<div');
            console.log(`  ✓ Has <div> inside nav: ${hasDivInNav ? 'Yes' : 'No'}`);
            
            // インラインスタイルの確認
            const hasInlineStyle = navContent.includes('style=');
            console.log(`  ✓ Has inline styles: ${hasInlineStyle ? 'Yes ⚠️' : 'No ✅'}`);
        }
        
        // 3. unified-styles.cssの読み込み確認
        const hasUnifiedStyles = content.includes('unified-styles.css');
        console.log(`  ✓ Loads unified-styles.css: ${hasUnifiedStyles ? 'Yes' : 'No'}`);
        
        // 4. nav-hamburger.jsの読み込み確認
        const hasHamburgerJS = content.includes('nav-hamburger.js');
        console.log(`  ✓ Loads nav-hamburger.js: ${hasHamburgerJS ? 'Yes' : 'No'}`);
        
        // 5. ローカルの.nav-linkスタイル定義確認
        const hasLocalNavStyles = content.match(/\.nav-link\s*{[^}]*}/);
        if (hasLocalNavStyles) {
            console.log(`  ⚠️  Has local .nav-link styles (may override unified styles)`);
        }
        
        // 6. navigation.jsの読み込み確認（競合の可能性）
        const hasNavigationJS = content.includes('navigation.js');
        if (hasNavigationJS) {
            console.log(`  ⚠️  Loads navigation.js (potential conflict with nav-hamburger.js)`);
        }
        
    } catch (error) {
        console.error(`  ❌ Error reading ${filename}: ${error.message}`);
    }
});

console.log('\n\n📊 Summary:');
console.log('If you see warnings (⚠️), those files need attention.');
console.log('Run "node fix-hamburger-menu.js" to fix common issues.');