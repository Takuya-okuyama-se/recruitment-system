#!/bin/bash

# すべてのHTMLファイルにglobal-styles.cssを追加
for file in *.html; do
    if [ -f "$file" ]; then
        # global-styles.cssがまだリンクされていない場合は追加
        if ! grep -q "global-styles.css" "$file"; then
            echo "Adding global-styles.css to $file..."
            # nav-styles.cssの後に追加
            sed -i 's|<link rel="stylesheet" href="nav-styles.css">|<link rel="stylesheet" href="nav-styles.css">\n    <link rel="stylesheet" href="global-styles.css">|g' "$file"
        fi
    fi
done

echo "Global styles added successfully!"