const fs = require('fs');
const path = require('path');

// data-management.htmlの構文エラー修正
function fixDataManagementSyntax() {
    const filePath = path.join(__dirname, 'data-management.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // try-catchの構文エラーを修正
    content = content.replace(
        `try {
                // サンプルデータSQLを実行
                showAlert('info', 'この機能はSupabase版では利用できません');
return;
            }`,
        `try {
                // サンプルデータSQLを実行
                showAlert('info', 'この機能はSupabase版では利用できません');
                return;
            } catch (error) {
                console.error('エラー:', error);
            }`
    );
    
    content = content.replace(
        `try {
                showAlert('info', 'この機能はSupabase版では利用できません');
return;
            }`,
        `try {
                showAlert('info', 'この機能はSupabase版では利用できません');
                return;
            } catch (error) {
                console.error('エラー:', error);
            }`
    );
    
    // 他の構文エラーも修正
    content = content.replace(/return;\s*\}/g, (match) => {
        if (match.includes('} catch')) return match;
        return 'return;\n            } catch (error) {\n                console.error(error);\n            }';
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed data-management.html syntax');
}

// offer-management.htmlの修正
function fixOfferManagement() {
    const filePath = path.join(__dirname, 'offer-management.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // candidates配列のundefinedチェックを追加
    content = content.replace(
        `const offerCandidates = data.candidates.filter(c =>`,
        `const offerCandidates = (data.candidates || []).filter(c =>`
    );
    
    // Supabase呼び出しの修正
    content = content.replace(
        `const { data, error } = await window.SUPABASE_CLIENT.from("candidates").select("*");
if (error) throw error;
                
                const offerCandidates = (data.candidates || []).filter(c =>`,
        `const { data: candidates, error } = await window.SUPABASE_CLIENT
                    .from('candidates')
                    .select(\`
                        *,
                        positions(title),
                        recruitment_stages(stage, status)
                    \`);
                
                if (error) throw error;
                
                const offerCandidates = (candidates || []).filter(c =>`
    );
    
    // current_stageの判定を修正
    content = content.replace(
        `c.current_stage === '内定' && c.stage_status === 'passed'`,
        `c.recruitment_stages?.some(s => s.stage === '内定' && s.status === '進行中')`
    );
    
    // フォーム用候補者の修正も同様に
    content = content.replace(
        `const eligibleCandidates = data.candidates.filter(c =>`,
        `const eligibleCandidates = (candidates || []).filter(c =>`
    );
    
    content = content.replace(
        `(c.current_stage === '最終面接' && c.stage_status === 'passed') ||
                    (c.current_stage === '内定')`,
        `c.recruitment_stages?.some(s => 
                        (s.stage === '最終面接' && s.status === '合格') ||
                        (s.stage === '内定')
                    )`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed offer-management.html');
}

// showAlert関数が無い場合は追加
function addShowAlertFunction() {
    const filePath = path.join(__dirname, 'data-management.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('function showAlert')) {
        const alertFunction = `
        // アラート表示関数
        function showAlert(type, message) {
            const alert = document.createElement('div');
            alert.className = 'alert';
            alert.style.cssText = \`
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 1000;
                max-width: 300px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            \`;
            
            if (type === 'success') {
                alert.style.backgroundColor = '#d4edda';
                alert.style.color = '#155724';
                alert.style.border = '1px solid #c3e6cb';
            } else if (type === 'error') {
                alert.style.backgroundColor = '#f8d7da';
                alert.style.color = '#721c24';
                alert.style.border = '1px solid #f5c6cb';
            } else if (type === 'info') {
                alert.style.backgroundColor = '#d1ecf1';
                alert.style.color = '#0c5460';
                alert.style.border = '1px solid #bee5eb';
            }
            
            alert.textContent = message;
            document.body.appendChild(alert);
            
            setTimeout(() => {
                alert.style.opacity = '0';
                alert.style.transition = 'opacity 0.3s';
                setTimeout(() => alert.remove(), 300);
            }, 5000);
        }
`;
        
        // script タグの直後に追加
        content = content.replace(
            '<script>\n        // Supabaseクライアントはsupabase-config.jsで定義済み',
            '<script>\n        // Supabaseクライアントはsupabase-config.jsで定義済み\n' + alertFunction
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Added showAlert function');
    }
}

// すべての修正を実行
fixDataManagementSyntax();
fixOfferManagement();
addShowAlertFunction();

console.log('All final fixes completed!');