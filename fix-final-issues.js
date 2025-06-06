const fs = require('fs');
const path = require('path');

// data-management.htmlの修正
function fixDataManagement() {
    const filePath = path.join(__dirname, 'data-management.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 重複したcatchブロックを削除
    content = content.replace(
        `try {
                // サンプルデータSQLを実行
                showAlert('info', 'この機能はSupabase版では利用できません');
                return;
            } catch (error) {
                console.error(error);
            } catch (error) {
                console.error('エラー:', error);
            }`,
        `try {
                // サンプルデータSQLを実行
                showAlert('info', 'この機能はSupabase版では利用できません');
                hideLoading();
                return;
            } catch (error) {
                console.error('エラー:', error);
                hideLoading();
            }`
    );
    
    // 他の関数も同様に修正
    content = content.replace(
        /showAlert\('info', 'この機能はSupabase版では利用できません'\);\nreturn;\n\s*\} catch/g,
        `showAlert('info', 'この機能はSupabase版では利用できません');
                hideLoading();
                return;
            } catch`
    );
    
    // 不要なコードブロックを削除
    content = content.replace(
        /\n\s*if \(!response\.ok\) \{[\s\S]*?\}\s*showAlert\('success'[\s\S]*?\}\s*catch \(error\) \{/g,
        '\n            } catch (error) {'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed data-management.html');
}

// organization-settings.htmlの修正
function fixOrganizationSettings() {
    const filePath = path.join(__dirname, 'organization-settings.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 部門保存の修正（departmentsテーブルに保存するよう修正）
    content = content.replace(
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
                }
                
                showAlert('success', '部門を保存しました');`,
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
                }
                
                showAlert('success', '部門を保存しました');`
    );
    
    // 職種保存の確認（正しいテーブルを使用しているか）
    const positionSaveSection = content.match(/document\.getElementById\('positionForm'\)\.addEventListener[\s\S]*?}\);/);
    if (positionSaveSection) {
        const hasCorrectTable = positionSaveSection[0].includes("from('positions')");
        if (!hasCorrectTable) {
            console.log('Need to fix position save table');
        }
    }
    
    // 削除処理の残りのコードを削除
    content = content.replace(
        /if \(error\) throw error;\);\s*\n\s*if \(!response\.ok\) \{[\s\S]*?\}\s*showAlert/g,
        'if (error) throw error;\n                \n                showAlert'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed organization-settings.html');
}

// 実行
fixDataManagement();
fixOrganizationSettings();

console.log('All issues fixed!');