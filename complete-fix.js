const fs = require('fs');
const path = require('path');

// data-management.htmlの完全修正
function fixDataManagement() {
    const filePath = path.join(__dirname, 'data-management.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // candidatesDataの参照を修正
    content = content.replace(/candidatesData\.candidates/g, 'candidates');
    
    // showAlert関数を追加
    if (!content.includes('function showAlert')) {
        content = content.replace(
            '// ページ読み込み時にデータ統計を取得',
            `// アラート表示
        function showAlert(type, message) {
            const alert = document.createElement('div');
            alert.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 5px; z-index: 1000;';
            alert.style.backgroundColor = type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1';
            alert.style.color = type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460';
            alert.style.border = '1px solid ' + (type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb');
            alert.textContent = message;
            document.body.appendChild(alert);
            setTimeout(() => alert.remove(), 5000);
        }
        
        // ページ読み込み時にデータ統計を取得`
        );
    }
    
    // 部門進捗の表示を修正
    content = content.replace(
        'dept.department',
        'dept.name'
    );
    
    // 統計計算を修正
    content = content.replace(
        'const totalTarget = departments.reduce((sum, dept) => sum + (dept.target_hires || 0), 0);',
        'const totalTarget = departments.reduce((sum, dept) => sum + (dept.positions?.reduce((s, p) => s + (p.target_count || 0), 0) || 0), 0);'
    );
    
    // dataの参照を修正
    content = content.replace(
        'if (data.durations && data.durations.length > 0)',
        'if (stages && stages.length > 0)'
    );
    
    // 構文エラーを修正
    content = content.replace(/return;\s*\}\);/g, 'return;\n            }');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed data-management.html');
}

// organization-settings.htmlの完全修正
function fixOrganizationSettings() {
    const filePath = path.join(__dirname, 'organization-settings.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 統計情報の計算を修正
    content = content.replace(
        'const totalPositions = departments.reduce((sum, dept) => sum + (dept.open_positions || 0), 0);',
        'const totalPositions = departments.reduce((sum, dept) => sum + (dept.positions?.length || 0), 0);'
    );
    
    // 職種保存の修正（positionsテーブルに保存）
    content = content.replace(
        `if (id) {
                    const { error } = await window.SUPABASE_CLIENT
                        .from('departments')
                        .update(data)
                        .eq('id', id);
                    if (error) throw error;
                } else {
                    const { error } = await window.SUPABASE_CLIENT
                        .from('departments')
                        .insert([data]);
                    if (error) throw error;
                }`,
        `if (id) {
                    const { error } = await window.SUPABASE_CLIENT
                        .from('positions')
                        .update(data)
                        .eq('id', id);
                    if (error) throw error;
                } else {
                    const { error } = await window.SUPABASE_CLIENT
                        .from('positions')
                        .insert([data]);
                    if (error) throw error;
                }`
    );
    
    // 削除処理の修正
    content = content.replace(
        /const response = await fetch\(`\/api\/organization\/departments\/\$\{id\}`[^}]+\}/g,
        `const { error } = await window.SUPABASE_CLIENT
                    .from('departments')
                    .delete()
                    .eq('id', id);
                if (error) throw error;`
    );
    
    content = content.replace(
        /const response = await fetch\(`\/api\/organization\/positions\/\$\{id\}`[^}]+\}/g,
        `const { error } = await window.SUPABASE_CLIENT
                    .from('positions')
                    .delete()
                    .eq('id', id);
                if (error) throw error;`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed organization-settings.html');
}

// Supabaseスキーマの外部キー制約を修正するSQL
function createFixSchema() {
    const sql = `
-- evaluationsテーブルのinterviewer_id制約を修正
ALTER TABLE evaluations 
ALTER COLUMN interviewer_id DROP NOT NULL;

-- サンプルユーザーを作成（必要な場合）
INSERT INTO users (email, name, role) 
VALUES ('system@example.com', 'システム', 'admin')
ON CONFLICT (email) DO NOTHING;
`;
    
    fs.writeFileSync(path.join(__dirname, 'database/fix-constraints.sql'), sql, 'utf8');
    console.log('Created fix-constraints.sql');
}

// すべての修正を実行
fixDataManagement();
fixOrganizationSettings();
createFixSchema();

console.log('All fixes completed!');