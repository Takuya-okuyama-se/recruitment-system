#!/bin/bash

# すべてのHTMLファイルにnav-hamburger.jsを追加
for file in *.html; do
    if [ -f "$file" ]; then
        # nav-hamburger.jsがまだ追加されていない場合
        if ! grep -q "nav-hamburger.js" "$file"; then
            echo "Adding nav-hamburger.js to $file..."
            # navigation.jsの前に追加（navigation.jsがある場合）
            if grep -q "navigation.js" "$file"; then
                sed -i 's|<script src="navigation.js"></script>|<script src="nav-hamburger.js"></script>\n    <script src="navigation.js"></script>|g' "$file"
            else
                # </body>タグの前に追加
                sed -i 's|</body>|    <script src="nav-hamburger.js"></script>\n</body>|g' "$file"
            fi
        fi
    fi
done

echo "Nav hamburger script added successfully!"