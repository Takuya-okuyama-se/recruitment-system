#!/bin/bash

# 削除すべきCSSパターン
echo "Removing old navigation CSS from HTML files..."

# 対象ファイル
FILES=(
    "aptitude-test-form.html"
    "offer-management.html"
    "data-management.html"
    "organization-settings.html"
    "db-viewer.html"
    "stage-detail.html"
    "candidate-detail.html"
    "evaluation-form.html"
    "evaluation-form-complete.html"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing $file..."
        
        # 一時ファイルを作成
        temp_file=$(mktemp)
        
        # Navigation responsiveセクションを削除
        sed -E '
            /\/\* Navigation responsive \*\//,/^[[:space:]]*}[[:space:]]*$/ {
                /nav > div > div/,/^[[:space:]]*}[[:space:]]*$/ d
                /nav a[[:space:]]*{/,/^[[:space:]]*}[[:space:]]*$/ d
                /nav span[[:space:]]*{/,/^[[:space:]]*}[[:space:]]*$/ d
                /\/\* Navigation responsive \*\// d
            }
        ' "$file" > "$temp_file"
        
        # 元のファイルを置換
        mv "$temp_file" "$file"
    fi
done

echo "Old navigation CSS removed successfully!"