#!/bin/bash

echo "=== PostgreSQL修正と再起動 ==="
echo ""

# 1. すべてのコンテナを停止
echo "1. すべてのコンテナを停止..."
sudo docker-compose down

# 2. 古いボリュームを削除（エラーを完全にクリア）
echo ""
echo "2. 古いデータベースボリュームを削除..."
sudo docker volume rm recruitment-recruitment-tracker_postgres_data 2>/dev/null

# 3. PostgreSQLコンテナを起動
echo ""
echo "3. PostgreSQLを起動..."
sudo docker-compose up -d postgres

# 4. 初期化を待機
echo ""
echo "4. データベースの初期化を待機（20秒）..."
sleep 20

# 5. データベースの状態確認
echo ""
echo "5. データベースの状態確認..."
sudo docker exec recruitment_db psql -U postgres -d recruitment_recruitment -c "\dt" 2>&1 | head -20

# 6. アプリケーションを起動
echo ""
echo "6. アプリケーションを起動..."
sudo docker-compose up -d app

# 7. 起動を待機
echo ""
echo "7. アプリケーションの起動を待機（10秒）..."
sleep 10

# 8. 最終確認
echo ""
echo "=== システム状態 ==="
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== API動作確認 ==="
curl -s http://localhost:5000 | jq . || echo "APIがまだ起動していません"

echo ""
echo "=== アクセス方法 ==="
echo "📊 ダッシュボード: http://localhost:5000/dashboard.html"
echo "👥 候補者管理: http://localhost:5000/candidate-form.html"
echo "🗄️ データベース: http://localhost:5000/db-viewer.html"
echo ""
echo "ブラウザで開く："
echo "cmd.exe /c start http://localhost:5000/dashboard.html"