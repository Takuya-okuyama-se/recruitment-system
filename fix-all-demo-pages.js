#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files and their specific patterns
const filesToFix = {
    'evaluation-form.html': {
        pattern: /window\.addEventListener\('DOMContentLoaded', loadCandidates\);/,
        functions: ['loadCandidates()']
    },
    'data-management.html': {
        pattern: /document\.addEventListener\('DOMContentLoaded', function\(\) {\s*loadDataStats\(\);\s*loadDepartmentProgress\(\);\s*loadTimeAnalysis\(\);\s*}\);/,
        functions: ['loadDataStats()', 'loadDepartmentProgress()', 'loadTimeAnalysis()']
    },
    'organization-settings.html': {
        pattern: /document\.addEventListener\('DOMContentLoaded', function\(\) {\s*loadDepartments\(\);\s*loadPositions\(\);\s*loadStats\(\);\s*}\);/,
        functions: ['loadDepartments()', 'loadPositions()', 'loadStats()']
    }
};

// Additional files that might need checking
const additionalFiles = ['aptitude-test-form.html', 'offer-management.html', 'db-viewer.html', 'stage-detail.html', 'candidate-detail.html'];

function generateAuthWaitCode(functions) {
    const functionCalls = functions.join(';\n                    ');
    
    return `// 認証完了を待ってから初期化
        function initializeAfterAuth() {
            console.log('Initializing page after auth...');
            
            // デモモードかチェック
            if (window.AuthSystem && window.AuthSystem.isDemoMode()) {
                console.log('Demo mode active, waiting for demo data...');
                
                // デモデータの準備完了を待つ
                const demoReadyHandler = function() {
                    console.log('Demo data ready, initializing page...');
                    ${functionCalls};
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
                            ${functionCalls};
                        }
                    }, 1000);
                }
            } else {
                // 通常モードの場合はすぐに初期化
                window._pageInitialized = true;
                ${functionCalls};
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
}

function fixFile(filePath, config) {
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
    
    if (config && config.pattern) {
        if (content.match(config.pattern)) {
            console.log(`  - Found pattern, replacing...`);
            const replacement = generateAuthWaitCode(config.functions);
            content = content.replace(config.pattern, replacement);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`  ✅ Fixed`);
        } else {
            console.log(`  - Pattern not found`);
        }
    }
}

function checkAdditionalFile(filePath) {
    console.log(`Checking ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  - File not found, skipping`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if already fixed
    if (content.includes('initializeAfterAuth')) {
        console.log(`  - Already has auth waiting`);
        return;
    }
    
    // Look for any script section
    const scriptMatch = content.match(/<script>[\s\S]*?<\/script>/g);
    if (scriptMatch) {
        const hasLoadFunctions = scriptMatch.some(script => 
            script.includes('load') && 
            (script.includes('DOMContentLoaded') || script.includes('window.onload'))
        );
        
        if (hasLoadFunctions) {
            console.log(`  - Has load functions but needs manual review`);
            
            // Try to find the actual functions
            const loadFunctionMatch = content.match(/(?:window\.addEventListener|document\.addEventListener)\(['"](?:DOMContentLoaded|load)['"],\s*(?:function\s*\([^)]*\)|[^)]*=>)?\s*{?\s*([^}]+)\s*}?\s*\);?/);
            if (loadFunctionMatch) {
                console.log(`  - Found load pattern: ${loadFunctionMatch[1].substring(0, 50)}...`);
            }
        } else {
            console.log(`  - No immediate load functions found`);
        }
    }
}

console.log('Fixing demo mode in all pages...\n');

// Fix known patterns
Object.entries(filesToFix).forEach(([file, config]) => {
    fixFile(file, config);
});

console.log('\nChecking additional files...\n');

// Check additional files
additionalFiles.forEach(file => {
    checkAdditionalFile(file);
});

console.log('\nDone!');
console.log('\nDemo mode should now work correctly on most pages.');
console.log('Test by visiting dashboard.html?demo');
console.log('\nNote: Some pages may need manual review if they have complex initialization patterns.');