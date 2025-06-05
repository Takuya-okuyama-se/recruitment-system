#!/bin/bash

echo "=== ナビゲーションボタンを更新します ==="

# dashboard.htmlのナビゲーションを更新
echo "1. dashboard.htmlを更新中..."

# sedコマンドで置換（バックアップを作成）
sed -i.bak '/<a href="offer-management.html".*内定管理<\/a>/a\
            <a href="organization-settings.html" class="btn">🏢 組織設定</a>\
            <a href="data-management.html" class="btn">📊 データ管理</a>' dashboard.html

echo "✅ dashboard.htmlのナビゲーションを更新しました"

# 他のHTMLファイルにもナビゲーションリンクを追加
for file in candidate-form.html evaluation-form.html aptitude-test-form.html offer-management.html db-viewer.html; do
    if [ -f "$file" ]; then
        echo "2. $file を確認中..."
        # ナビゲーションがある場合は更新
        if grep -q "nav-buttons" "$file"; then
            echo "   ナビゲーションを更新..."
            # 実際の更新処理をここに追加
        fi
    fi
done

echo ""
echo "=== 完了！ ==="
echo ""
echo "新しいページへのアクセス："
echo "🏢 組織設定: http://localhost:5000/organization-settings.html"
echo "📊 データ管理: http://localhost:5000/data-management.html"