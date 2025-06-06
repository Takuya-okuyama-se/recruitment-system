#!/bin/bash

# 統一CSSファイルに更新するスクリプト

echo "すべてのHTMLファイルを統一CSSファイルに更新中..."

# HTMLファイルのリスト
html_files=(
    "aptitude-test-form.html"
    "candidate-detail.html"
    "candidate-form-supabase.html"
    "candidate-form.html"
    "dashboard-supabase.html"
    "dashboard.html"
    "data-management.html"
    "db-viewer.html"
    "evaluation-form-complete.html"
    "evaluation-form.html"
    "index.html"
    "offer-management.html"
    "one-click-start.html"
    "organization-settings.html"
    "shared-navigation.html"
    "stage-detail.html"
    "test-supabase-connection.html"
)

# 各HTMLファイルを更新
for file in "${html_files[@]}"; do
    if [ -f "$file" ]; then
        echo "更新中: $file"
        
        # 既存のCSSリンクを削除（global-styles.css, nav-styles.css, responsive-styles.css）
        sed -i '/<link rel="stylesheet" href="global-styles.css">/d' "$file"
        sed -i '/<link rel="stylesheet" href="nav-styles.css">/d' "$file"
        sed -i '/<link rel="stylesheet" href="responsive-styles.css">/d' "$file"
        
        # 統一CSSファイルへのリンクがまだない場合は追加
        if ! grep -q 'unified-styles.css' "$file"; then
            # </head>タグの前に新しいCSSリンクを挿入
            sed -i '/<\/head>/i\    <link rel="stylesheet" href="unified-styles.css">' "$file"
        fi
    fi
done

echo "すべてのHTMLファイルの更新が完了しました。"