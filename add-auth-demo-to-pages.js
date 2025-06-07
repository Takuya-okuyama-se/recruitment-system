#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of HTML files that need auth.js and demo-data.js
const filesToUpdate = [
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

function addAuthAndDemoScripts(filePath) {
    console.log(`Processing ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  - File not found, skipping`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Check if auth.js is already included
    if (!content.includes('<script src="auth.js"></script>')) {
        console.log(`  - Adding auth.js`);
        
        // Find where to insert - after supabase-config.js
        const supabaseConfigMatch = content.match(/(<script\s+src="supabase-config\.js"[^>]*><\/script>)/);
        if (supabaseConfigMatch) {
            const insertPoint = supabaseConfigMatch.index + supabaseConfigMatch[0].length;
            content = content.slice(0, insertPoint) + 
                '\n    <script src="auth.js"></script>' + 
                content.slice(insertPoint);
            modified = true;
        }
    }
    
    // Check if demo-data.js is already included
    if (!content.includes('<script src="demo-data.js"></script>')) {
        console.log(`  - Adding demo-data.js`);
        
        // Find where to insert - after auth.js or supabase-config.js
        const authMatch = content.match(/(<script\s+src="auth\.js"[^>]*><\/script>)/);
        const supabaseConfigMatch = content.match(/(<script\s+src="supabase-config\.js"[^>]*><\/script>)/);
        
        if (authMatch) {
            const insertPoint = authMatch.index + authMatch[0].length;
            content = content.slice(0, insertPoint) + 
                '\n    <script src="demo-data.js"></script>' + 
                content.slice(insertPoint);
            modified = true;
        } else if (supabaseConfigMatch) {
            const insertPoint = supabaseConfigMatch.index + supabaseConfigMatch[0].length;
            content = content.slice(0, insertPoint) + 
                '\n    <script src="demo-data.js"></script>' + 
                content.slice(insertPoint);
            modified = true;
        }
    }
    
    // Update DOMContentLoaded to wait for auth
    if (modified) {
        console.log(`  - Updating DOMContentLoaded handler to wait for auth`);
        
        // Find and update the DOMContentLoaded handler
        const domLoadRegex = /(window\.addEventListener\(['"]DOMContentLoaded['"],\s*(?:function\s*\([^)]*\)|[^)]*=>)\s*{\s*)([^}]+(?:{[^}]*}[^}]*)*)\s*}\)/;
        const match = content.match(domLoadRegex);
        
        if (match) {
            const originalHandler = match[2].trim();
            
            // Create new handler that waits for auth
            const newHandler = `
            // 認証完了を待つ
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
            setTimeout(function() {
                if (window.AuthSystem && window.AuthSystem.isSessionValid() && !window._pageInitialized) {
                    console.log('Already logged in, initializing page...');
                    initializeAfterAuth();
                }
            }, 200);`;
            
            // Replace the handler
            content = content.replace(match[0], 
                `window.addEventListener('DOMContentLoaded', () => {${newHandler}
        })`);
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✅ Updated successfully`);
    } else {
        console.log(`  - No changes needed`);
    }
}

console.log('Adding auth.js and demo-data.js to all pages...\n');

filesToUpdate.forEach(file => {
    addAuthAndDemoScripts(file);
});

console.log('\nDone!');
console.log('\nNext steps:');
console.log('1. Test demo mode by visiting any page with ?demo parameter');
console.log('2. Login with password: demo2024');
console.log('3. Verify that demo data is shown on all pages');
console.log('4. Navigation between pages should maintain demo mode');