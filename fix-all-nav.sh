#!/bin/bash

# 正しいナビゲーションHTML
NAV_HTML='<nav>
    <div style="max-width: 1400px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 10px;">
        <a href="dashboard.html" class="nav-link">📊 ダッシュボード</a>
        <a href="candidate-form.html" class="nav-link">👤 候補者登録</a>
        <a href="evaluation-form.html" class="nav-link">📝 面接評価</a>
        <a href="aptitude-test-form.html" class="nav-link">📊 適性検査</a>
        <a href="offer-management.html" class="nav-link">💼 内定管理</a>
        <a href="data-management.html" class="nav-link">📈 データ管理</a>
        <a href="organization-settings.html" class="nav-link">⚙️ 組織設定</a>
        <a href="db-viewer.html" class="nav-link">🗄️ DBビューア</a>
    </div>
</nav>'

# 修正対象のファイル
FILES=(
    "aptitude-test-form.html"
    "offer-management.html"
    "data-management.html"
    "organization-settings.html"
    "db-viewer.html"
    "stage-detail.html"
    "index.html"
    "candidate-detail.html"
    "candidate-form-supabase.html"
    "dashboard-supabase.html"
    "evaluation-form-complete.html"
    "test-supabase-connection.html"
)

# 各ファイルのナビゲーションを修正
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing navigation in $file..."
        
        # 一時ファイルを作成
        temp_file=$(mktemp)
        
        # <nav>から</nav>までを新しいナビゲーションで置換
        awk -v nav="$NAV_HTML" '
            /<nav>/ {
                in_nav = 1
                print nav
                next
            }
            /<\/nav>/ && in_nav {
                in_nav = 0
                next
            }
            !in_nav {
                print
            }
        ' "$file" > "$temp_file"
        
        # 元のファイルを置換
        mv "$temp_file" "$file"
    fi
done

echo "Navigation fixed in all files!"