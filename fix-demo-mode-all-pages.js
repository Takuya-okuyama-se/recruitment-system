#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of HTML files that need demo mode fixes
const filesToFix = [
    'candidate-form.html',
    'evaluation-form.html',
    'aptitude-test-form.html',
    'offer-management.html',
    'data-management.html',
    'organization-settings.html',
    'db-viewer.html',
    'stage-detail.html',
    'candidate-detail.html'
];

function fixDemoModePage(filePath) {
    console.log(`Fixing ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  - File not found, skipping`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Check if file includes auth.js and demo-data.js
    if (!content.includes('auth.js') || !content.includes('demo-data.js')) {
        console.log(`  - File doesn't include auth.js or demo-data.js, skipping`);
        return;
    }
    
    // Find the DOMContentLoaded event handler
    const domLoadMatch = content.match(/window\.addEventListener\(['"]DOMContentLoaded['"],\s*(?:function\s*\([^)]*\)|[^)]*=>)\s*{\s*([^}]+(?:{[^}]*}[^}]*)*)\s*}\)/);
    
    if (domLoadMatch) {
        const originalHandler = domLoadMatch[1];
        console.log(`  - Found DOMContentLoaded handler`);
        
        // Check if it already waits for auth
        if (!originalHandler.includes('authComplete') && !originalHandler.includes('AuthSystem')) {
            console.log(`  - Adding auth and demo mode handling`);
            
            // Extract the function calls from the original handler
            const functionCalls = originalHandler.trim();
            
            const newHandler = `
            // 認証完了を待つ
            function initializeAfterAuth() {
                console.log('Initializing after auth...');
                
                // デモモードかチェック
                if (window.AuthSystem && window.AuthSystem.isDemoMode()) {
                    console.log('Demo mode active, waiting for demo data...');
                    
                    // デモデータの準備完了を待つ
                    document.addEventListener('demoDataReady', function() {
                        console.log('Demo data ready, initializing page...');
                        ${functionCalls}
                    }, { once: true });
                    
                    // フォールバック: 1秒後にまだロードされていなければ強制的にロード
                    setTimeout(function() {
                        if (!window._pageInitialized) {
                            console.log('Demo data timeout, initializing anyway...');
                            window._pageInitialized = true;
                            ${functionCalls}
                        }
                    }, 1000);
                } else {
                    // 通常モードの場合はすぐに初期化
                    window._pageInitialized = true;
                    ${functionCalls}
                }
            }
            
            // 認証完了イベントを待つ
            document.addEventListener('authComplete', function(e) {
                console.log('Auth completed, initializing page...', e.detail);
                initializeAfterAuth();
            });
            
            // 既にログイン済みの場合の処理
            setTimeout(function() {
                if (window.AuthSystem && window.AuthSystem.isSessionValid() && !window._pageInitialized) {
                    console.log('Already logged in, initializing page...');
                    initializeAfterAuth();
                }
            }, 200);`;
            
            // Replace the DOMContentLoaded handler
            const newContent = content.replace(domLoadMatch[0], 
                `window.addEventListener('DOMContentLoaded', () => {${newHandler}
        })`);
            
            content = newContent;
            modified = true;
        } else {
            console.log(`  - Already has auth handling`);
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✅ Fixed demo mode handling`);
    } else {
        console.log(`  - No changes needed`);
    }
}

console.log('Fixing demo mode handling in all pages...\n');

filesToFix.forEach(file => {
    fixDemoModePage(file);
});

console.log('\nDone!');
console.log('\nNext steps:');
console.log('1. Test demo mode by visiting any page with ?demo parameter');
console.log('2. Login with password: demo2024');
console.log('3. Verify that demo data is shown on all pages');
console.log('4. Check the browser console for demo mode logs');