#\!/bin/bash
# すべてのHTMLファイルで nav 要素に直接背景スタイルが設定されていないか確認
for file in *.html; do
    if grep -q "nav.*style.*background" "$file"; then
        echo "Found inline nav style in: $file"
        grep -n "nav.*style.*background" "$file"
    fi
done
