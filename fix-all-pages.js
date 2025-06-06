const fs = require('fs');
const path = require('path');

// evaluation-form.htmlの修正
function fixEvaluationForm() {
    const filePath = path.join(__dirname, 'evaluation-form.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // interviewer_idを削除（NULLを許可）
    content = content.replace(
        'data.interviewer_id = 1; // 仮のユーザーID',
        '// data.interviewer_id = 1; // interviewer_idは省略（NULL許可）'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed evaluation-form.html');
}

// data-management.htmlの修正
function fixDataManagement() {
    const filePath = path.join(__dirname, 'data-management.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Supabase呼び出しの修正
    content = content.replace(
        'const candidatesRes = await window.SUPABASE_CLIENT.from("candidates").select("*");\n                const candidatesData = await candidatesRes.json();',
        'const { data: candidates, error } = await window.SUPABASE_CLIENT.from("candidates").select("*");\n                if (error) throw error;'
    );
    
    content = content.replace(
        'candidatesData.candidates ? candidatesData.candidates.length : \'0\'',
        'candidates ? candidates.length : \'0\''
    );
    
    content = content.replace(
        'candidatesData.candidates ? \n                    candidatesData.candidates.filter(c => c.stage_status === \'in_progress\').length : 0',
        'candidates ? candidates.length : 0'
    );
    
    // 古いfetch APIをSupabaseに置換
    content = content.replace(
        /const res = await fetch\(`\/api\/recruitment\/by-department`\);[\s\S]*?const departments = await res\.json\(\);/g,
        `const { data: departments, error } = await window.SUPABASE_CLIENT
                    .from('departments')
                    .select(\`
                        *,
                        positions(id, target_count),
                        candidates:positions(candidates(id))
                    \`);
                if (error) throw error;`
    );
    
    content = content.replace(
        /const res = await fetch\(`\/api\/recruitment\/overview`\);[\s\S]*?const data = await res\.json\(\);/g,
        `const { data: stages, error } = await window.SUPABASE_CLIENT
                    .from('recruitment_stages')
                    .select('*');
                if (error) throw error;`
    );
    
    // サンプルデータ、クリア、時間更新の処理を無効化
    content = content.replace(
        /const response = await fetch\(`\/api\/data\/[^`]+`[^}]+\}/g,
        'showAlert(\'info\', \'この機能はSupabase版では利用できません\');\nreturn;'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed data-management.html');
}

// organization-settings.htmlの修正
function fixOrganizationSettings() {
    const filePath = path.join(__dirname, 'organization-settings.html');
    let content = fs.readFileSync(filePath, 'utf8');
    
    // loadStats関数の修正
    content = content.replace(
        /const deptRes = await fetch\(`\/api\/recruitment\/by-department`\);[\s\S]*?const deptData = await deptRes\.json\(\);/g,
        `const { data: departments, error } = await window.SUPABASE_CLIENT
                    .from('departments')
                    .select('*, positions(id, target_count)');
                if (error) throw error;`
    );
    
    content = content.replace('deptData.length', 'departments.length');
    content = content.replace(/deptData/g, 'departments');
    
    // loadDepartments関数の修正
    content = content.replace(
        /const response = await fetch\(`\/api\/organization\/departments`\);[\s\S]*?displayDepartments\(\);/,
        `const { data, error } = await window.SUPABASE_CLIENT
                    .from('departments')
                    .select('*')
                    .order('name');
                
                if (error) throw error;
                departments = data || [];
                displayDepartments();`
    );
    
    // loadPositions関数の修正
    content = content.replace(
        /const response = await fetch\(`\/api\/organization\/positions`\);[\s\S]*?displayPositions\(\);/,
        `const { data, error } = await window.SUPABASE_CLIENT
                    .from('positions')
                    .select('*, departments(name)')
                    .order('title');
                
                if (error) throw error;
                positions = data || [];
                displayPositions();`
    );
    
    // 保存・削除処理の修正
    content = content.replace(
        /const response = await fetch\(url, \{[\s\S]*?\}\);[\s\S]*?if \(!response\.ok\)[\s\S]*?\}/g,
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
                }`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed organization-settings.html');
}

// すべての修正を実行
fixEvaluationForm();
fixDataManagement();
fixOrganizationSettings();

console.log('All fixes applied!');