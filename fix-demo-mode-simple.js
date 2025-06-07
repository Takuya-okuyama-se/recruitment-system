#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files to fix
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

function fixFile(filePath) {
    console.log(`Processing ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  - File not found, skipping`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if already fixed
    if (content.includes('initializeAfterAuth')) {
        console.log(`  - Already fixed`);
        return;
    }
    
    // Find the simple DOMContentLoaded pattern
    const pattern = /window\.addEventListener\('DOMContentLoaded', \(\) => {\s*loadPositions\(\);\s*loadCandidates\(\);\s*}\);/;
    
    if (content.match(pattern)) {
        console.log(`  - Found candidate-form pattern`);
        
        const replacement = `// 認証完了を待ってから初期化
        function initializeAfterAuth() {
            console.log('Initializing page after auth...');
            
            // デモモードかチェック
            if (window.AuthSystem && window.AuthSystem.isDemoMode()) {
                console.log('Demo mode active, waiting for demo data...');
                
                // デモデータの準備完了を待つ
                const demoReadyHandler = function() {
                    console.log('Demo data ready, initializing page...');
                    loadPositions();
                    loadCandidates();
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
                            loadPositions();
                            loadCandidates();
                        }
                    }, 1000);
                }
            } else {
                // 通常モードの場合はすぐに初期化
                window._pageInitialized = true;
                loadPositions();
                loadCandidates();
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
        
        content = content.replace(pattern, replacement);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✅ Fixed`);
        return;
    }
    
    // Try to find any DOMContentLoaded with load functions
    const generalPattern = /window\.addEventListener\(['"]DOMContentLoaded['"],\s*\(\)\s*=>\s*{\s*([^}]+)\s*}\);/;
    const match = content.match(generalPattern);
    
    if (match) {
        console.log(`  - Found general DOMContentLoaded pattern`);
        const originalCode = match[1].trim();
        
        const replacement = `// 認証完了を待ってから初期化
        function initializeAfterAuth() {
            console.log('Initializing page after auth...');
            
            // デモモードかチェック
            if (window.AuthSystem && window.AuthSystem.isDemoMode()) {
                console.log('Demo mode active, waiting for demo data...');
                
                // デモデータの準備完了を待つ
                const demoReadyHandler = function() {
                    console.log('Demo data ready, initializing page...');
                    ${originalCode}
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
                            ${originalCode}
                        }
                    }, 1000);
                }
            } else {
                // 通常モードの場合はすぐに初期化
                window._pageInitialized = true;
                ${originalCode}
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
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✅ Fixed`);
    } else {
        console.log(`  - No matching DOMContentLoaded pattern found`);
    }
}

console.log('Fixing demo mode in all pages...\n');

filesToFix.forEach(file => {
    fixFile(file);
});

console.log('\nDone!');
console.log('\nDemo mode should now work correctly on all pages.');
console.log('Test by visiting dashboard.html?demo');