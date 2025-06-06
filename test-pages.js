const fs = require('fs');
const path = require('path');

// HTMLファイルの構文をチェック
function checkHTMLSyntax(filename) {
    console.log(`\n=== Checking ${filename} ===`);
    const content = fs.readFileSync(path.join(__dirname, filename), 'utf8');
    
    // JavaScriptセクションを抽出
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
    if (!scriptMatch) {
        console.log('No script tags found');
        return;
    }
    
    scriptMatch.forEach((script, index) => {
        const jsCode = script.replace(/<\/?script[^>]*>/g, '');
        try {
            // 基本的な構文チェック
            new Function(jsCode.replace(/await /g, '').replace(/async /g, ''));
            console.log(`Script block ${index + 1}: OK`);
        } catch (error) {
            console.log(`Script block ${index + 1}: ERROR`);
            console.log(`  Line: ${error.message}`);
            
            // エラー箇所の前後を表示
            const lines = jsCode.split('\n');
            const errorLine = parseInt(error.stack.match(/<anonymous>:(\d+):/)?.[1] || '0');
            if (errorLine > 0) {
                console.log(`  Around line ${errorLine}:`);
                for (let i = Math.max(0, errorLine - 3); i < Math.min(lines.length, errorLine + 2); i++) {
                    console.log(`    ${i + 1}: ${lines[i]}`);
                }
            }
        }
    });
}

// 各ページをチェック
checkHTMLSyntax('data-management.html');
checkHTMLSyntax('organization-settings.html');

console.log('\n=== Check Complete ===');