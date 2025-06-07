#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of HTML files that might need the demo mode timing fix
const filesToCheck = [
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

function fixDemoModeTiming(filePath) {
    console.log(`Checking ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  - File not found, skipping`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // Check if the file loads data on authComplete event
    if (content.includes('authComplete') && content.includes('loadData') || content.includes('loadDashboard')) {
        console.log(`  - Found data loading on authComplete`);
        
        // Check if it already has demo mode handling
        if (!content.includes('demoDataReady')) {
            console.log(`  - Adding demo mode timing fix`);
            
            // Find the authComplete event listener
            const authCompleteRegex = /document\.addEventListener\(['"]authComplete['"],\s*function\s*\([^)]*\)\s*{\s*([^}]+)}/;
            const match = content.match(authCompleteRegex);
            
            if (match) {
                const originalHandler = match[1];
                const newHandler = `
            console.log('Auth completed, checking mode...', e.detail);
            
            // デモモードの場合は、デモデータの準備完了を待つ
            if (e.detail && e.detail.mode === 'demo') {
                console.log('Demo mode detected, waiting for demo data...');
                // デモデータの準備完了を待つ
                document.addEventListener('demoDataReady', function() {
                    console.log('Demo data ready, loading data...');
                    ${originalHandler.trim()}
                }, { once: true });
                
                // フォールバック: 1秒後にまだロードされていなければ強制的にロード
                setTimeout(function() {
                    if (!window._dataLoaded) {
                        console.log('Demo data timeout, loading data anyway...');
                        ${originalHandler.trim()}
                    }
                }, 1000);
            } else {
                // 通常モードの場合はすぐにロード
                ${originalHandler.trim()}
            }`;
                
                const newContent = content.replace(authCompleteRegex, 
                    `document.addEventListener('authComplete', function(e) {${newHandler}
        }`);
                
                content = newContent;
                modified = true;
            }
        } else {
            console.log(`  - Already has demo mode handling`);
        }
    }
    
    // Also check for DOMContentLoaded handlers that might need fixing
    if (content.includes('DOMContentLoaded') && content.includes('isSessionValid')) {
        console.log(`  - Found session check on DOMContentLoaded`);
        
        // Add demo mode check if not already present
        const domLoadRegex = /if\s*\(window\.AuthSystem\s*&&\s*window\.AuthSystem\.isSessionValid\(\)\)\s*{([^}]+)}/;
        const match = content.match(domLoadRegex);
        
        if (match && !match[1].includes('isDemoMode')) {
            console.log(`  - Adding demo mode check to DOMContentLoaded`);
            
            const originalHandler = match[1];
            const newHandler = `
                    console.log('Already logged in, checking mode...');
                    
                    // デモモードかチェック
                    if (window.AuthSystem.isDemoMode()) {
                        console.log('Demo mode active, waiting for demo data...');
                        // デモデータの準備完了を待つ
                        document.addEventListener('demoDataReady', function() {
                            console.log('Demo data ready, loading data...');
                            ${originalHandler.trim()}
                        }, { once: true });
                        
                        // フォールバック: 1秒後にまだロードされていなければ強制的にロード
                        setTimeout(function() {
                            if (!window._dataLoaded) {
                                console.log('Demo data timeout, loading data anyway...');
                                ${originalHandler.trim()}
                            }
                        }, 1000);
                    } else {
                        // 通常モードの場合はすぐにロード
                        ${originalHandler.trim()}
                    }`;
            
            const newContent = content.replace(domLoadRegex, 
                `if (window.AuthSystem && window.AuthSystem.isSessionValid()) {${newHandler}
                }`);
            
            content = newContent;
            modified = true;
        }
    }
    
    // Add _dataLoaded flag to prevent duplicate loads
    if (modified && content.includes('async function load') && !content.includes('window._dataLoaded')) {
        console.log(`  - Adding duplicate load prevention`);
        
        // Find the main load function
        const loadFuncRegex = /(async function load\w+\(\)\s*{)/;
        const match = content.match(loadFuncRegex);
        
        if (match) {
            const newFunc = match[1] + `
            // 重複ロードを防ぐ
            if (window._dataLoaded) {
                console.log('Data already loaded, skipping...');
                return;
            }
            window._dataLoaded = true;
            `;
            
            content = content.replace(loadFuncRegex, newFunc);
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✅ Fixed demo mode timing issues`);
    } else {
        console.log(`  - No changes needed`);
    }
}

console.log('Fixing demo mode timing issues in HTML files...\n');

filesToCheck.forEach(file => {
    fixDemoModeTiming(file);
});

console.log('\nDone!');
console.log('\nNext steps:');
console.log('1. Test demo mode by visiting: dashboard.html?demo');
console.log('2. Login with password: demo2024');
console.log('3. Verify that demo data is shown, not real Supabase data');
console.log('4. Check the browser console for demo mode logs');