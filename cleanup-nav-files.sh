#!/bin/bash

# ナビゲーション関連の修正ファイルをクリーンアップ

echo "🧹 Cleaning up navigation fix files..."

# 修正スクリプトを別フォルダに移動
mkdir -p nav-fix-scripts
mv fix-hamburger-menu.js nav-fix-scripts/ 2>/dev/null
mv verify-nav-structure.js nav-fix-scripts/ 2>/dev/null
mv comprehensive-nav-fix.js nav-fix-scripts/ 2>/dev/null

echo "✅ Moved fix scripts to nav-fix-scripts/"

# 不要になったファイルの削除
rm -f navigation.js 2>/dev/null
echo "✅ Removed old navigation.js"

echo ""
echo "📋 Summary:"
echo "- All HTML files have been fixed"
echo "- Hamburger menu should now work on mobile devices"
echo "- Test page available at: test-hamburger-menu.html"
echo ""
echo "🔍 To test:"
echo "1. Open test-hamburger-menu.html in your browser"
echo "2. Or open any page and resize browser to < 768px width"
echo "3. Check that hamburger menu appears and works"

# 実行権限を付与
chmod +x cleanup-nav-files.sh