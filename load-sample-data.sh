#!/bin/bash

echo "=== サンプルデータを投入します ==="
echo ""

# データベースが起動しているか確認
echo "1. データベースの状態確認..."
if ! sudo docker exec recruitment_db psql -U postgres -d recruitment_recruitment -c '\dt' > /dev/null 2>&1; then
    echo "❌ データベースが起動していません"
    echo "以下のコマンドでシステムを起動してください："
    echo "sudo docker-compose up -d"
    exit 1
fi

echo "✅ データベースは正常に動作しています"
echo ""

# サンプルデータを投入
echo "2. サンプルデータを投入中..."
sudo docker exec -i recruitment_db psql -U postgres -d recruitment_recruitment < database/sample-data.sql 2>&1 | grep -E "(INSERT|ERROR)" | head -20

echo ""
echo "3. 投入結果の確認..."

# 候補者数を確認
CANDIDATE_COUNT=$(sudo docker exec recruitment_db psql -U postgres -d recruitment_recruitment -t -c "SELECT COUNT(*) FROM candidates;" | xargs)
echo "✅ 候補者数: ${CANDIDATE_COUNT}名"

# プロセス数を確認
PROCESS_COUNT=$(sudo docker exec recruitment_db psql -U postgres -d recruitment_recruitment -t -c "SELECT COUNT(*) FROM recruitment_processes;" | xargs)
echo "✅ 採用プロセス数: ${PROCESS_COUNT}件"

# 評価数を確認
EVAL_COUNT=$(sudo docker exec recruitment_db psql -U postgres -d recruitment_recruitment -t -c "SELECT COUNT(*) FROM interview_evaluations;" | xargs)
echo "✅ 面接評価数: ${EVAL_COUNT}件"

echo ""
echo "=== 完了！ ==="
echo ""
echo "データ管理画面でデータを確認できます："
echo "http://localhost:5000/data-management.html"
echo ""
echo "ブラウザで開く："
echo "cmd.exe /c start http://localhost:5000/data-management.html"