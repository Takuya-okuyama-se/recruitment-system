#!/bin/bash

# ブラウザでページを開くスクリプト

echo "=== 採用管理システム採用管理システムのページを開きます ==="
echo ""

# WSL環境でWindowsのブラウザを開く
case "$1" in
    "dashboard" | "d")
        echo "📊 ダッシュボードを開いています..."
        cmd.exe /c start http://localhost:5000/dashboard.html
        ;;
    "candidate" | "c")
        echo "👥 候補者管理を開いています..."
        cmd.exe /c start http://localhost:5000/candidate-form.html
        ;;
    "db" | "database")
        echo "🗄️ データベースビューアーを開いています..."
        cmd.exe /c start http://localhost:5000/db-viewer.html
        ;;
    "evaluation" | "e")
        echo "📝 評価フォームを開いています..."
        cmd.exe /c start http://localhost:5000/evaluation-form.html
        ;;
    "aptitude" | "a")
        echo "📋 適性検査フォームを開いています..."
        cmd.exe /c start http://localhost:5000/aptitude-test-form.html
        ;;
    "offer" | "o")
        echo "💼 内定管理を開いています..."
        cmd.exe /c start http://localhost:5000/offer-management.html
        ;;
    "pgadmin" | "pg")
        echo "🔧 pgAdminを開いています..."
        cmd.exe /c start http://localhost:5051
        ;;
    "all")
        echo "🚀 すべてのページを開いています..."
        cmd.exe /c start http://localhost:5000/dashboard.html
        sleep 1
        cmd.exe /c start http://localhost:5000/candidate-form.html
        sleep 1
        cmd.exe /c start http://localhost:5000/db-viewer.html
        ;;
    *)
        echo "使用方法: ./open-pages.sh [オプション]"
        echo ""
        echo "オプション:"
        echo "  dashboard, d    - ダッシュボード"
        echo "  candidate, c    - 候補者管理"
        echo "  db, database    - データベースビューアー"
        echo "  evaluation, e   - 評価フォーム"
        echo "  aptitude, a     - 適性検査フォーム"
        echo "  offer, o        - 内定管理"
        echo "  pgadmin, pg     - pgAdmin"
        echo "  all             - すべてのメインページ"
        echo ""
        echo "例:"
        echo "  ./open-pages.sh dashboard"
        echo "  ./open-pages.sh d"
        echo "  ./open-pages.sh all"
        ;;
esac