#!/bin/bash
echo "=== システム状態確認 ==="
echo ""

echo "1. 実行中のコンテナ:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "2. APIサーバーの確認:"
curl -s http://localhost:5000 | jq . || echo "APIサーバーに接続できません"
echo ""

echo "3. データベースの確認:"
sudo docker exec recruitment_db psql -U postgres -d recruitment_recruitment -c "SELECT COUNT(*) as candidates_count FROM candidates;" 2>/dev/null || echo "データベースに接続できません"
echo ""

echo "4. ネットワークの確認:"
sudo docker network ls | grep recruitment
echo ""

echo "=== 推奨アクション ==="
echo "もしAPIサーバーが停止している場合:"
echo "sudo docker-compose restart app"
echo ""
echo "すべてを再起動する場合:"
echo "sudo docker-compose restart"