#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of HTML files that need to wait for auth
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

function fixAuthWait(filePath) {
    console.log(`Processing ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  - File not found, skipping`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Check if it already waits for auth
    if (content.includes('authComplete') && content.includes('initializeAfterAuth')) {
        console.log(`  - Already waits for auth`);
        return;
    }
    
    // Find the DOMContentLoaded handler
    const domLoadRegex = /window\.addEventListener\(['"]DOMContentLoaded['"],\s*(?:function\s*\([^)]*\)|[^)]*=>)\s*{\s*([^}]+(?:{[^}]*}[^}]*)*)\s*}\);/;
    const match = content.match(domLoadRegex);
    
    if (match) {
        console.log(`  - Found DOMContentLoaded handler`);
        const originalHandler = match[1].trim();
        
        // Replace with auth-aware version
        const replacement = `// 認証完了を待ってから初期化
        function initializeAfterAuth() {
            console.log('Initializing page after auth...');
            
            // デモモードかチェック
            if (window.AuthSystem && window.AuthSystem.isDemoMode()) {
                console.log('Demo mode active, waiting for demo data...');
                
                // デモデータの準備完了を待つ
                const demoReadyHandler = function() {
                    console.log('Demo data ready, initializing page...');
                    ${originalHandler}
                };
                
                // 既にデモデータが準備済みかチェック
                if (window.DemoData && window.SUPABASE_CLIENT._demoOverridden) {
                    console.log('Demo data already ready');
                    demoReadyHandler();
                } else {
                    document.addEventListener('demoDataReady', demoReadyHandler, { once: true });
                    
                    // フォールバック: 1秒後にまだロードされていなければ強制的にロード
                    setTimeout(function() {
                        if (!window._pageInitialized) {
                            console.log('Demo data timeout, initializing anyway...');
                            window._pageInitialized = true;
                            ${originalHandler}
                        }
                    }, 1000);
                }
            } else {
                // 通常モードの場合はすぐに初期化
                window._pageInitialized = true;
                ${originalHandler}
            }
        }
        
        // 認証完了イベントを待つ
        document.addEventListener('authComplete', function(e) {
            console.log('Auth completed, initializing page...', e.detail);
            initializeAfterAuth();
        });
        
        // 既にログイン済みの場合の処理
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(function() {
                if (window.AuthSystem && window.AuthSystem.isSessionValid() && !window._pageInitialized) {
                    console.log('Already logged in, initializing page...');
                    initializeAfterAuth();
                }
            }, 200);
        });`;
        
        content = content.replace(match[0], replacement);
        modified = true;
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✅ Fixed to wait for auth`);
    } else {
        console.log(`  - No changes needed`);
    }
}

console.log('Fixing pages to wait for authentication...\n');

filesToFix.forEach(file => {
    fixAuthWait(file);
});

console.log('\nDone!');
console.log('\nTo test demo mode:');
console.log('1. Visit any page with ?demo parameter (e.g., dashboard.html?demo)');
console.log('2. Login with password: demo2024');
console.log('3. You should see demo data (6 candidates, 5 positions, etc.)');
console.log('4. Check browser console for "Demo mode active" messages');