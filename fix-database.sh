#!/bin/bash
echo "データベースを修正しています..."

# PostgreSQLコンテナの状態確認
echo "1. PostgreSQLコンテナの確認..."
sudo docker ps -a | grep postgres

# PostgreSQLコンテナを起動
echo -e "\n2. PostgreSQLを起動..."
sudo docker-compose up -d postgres

# 少し待つ
echo -e "\n3. データベースの初期化を待機中..."
sleep 10

# アプリケーションを再起動
echo -e "\n4. アプリケーションを再起動..."
sudo docker-compose restart app

# 待機
echo -e "\n5. サービスの起動を待機中..."
sleep 10

# 状態確認
echo -e "\n=== 現在の状態 ==="
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# API確認
echo -e "\n=== API動作確認 ==="
curl -s http://localhost:5000 | head -n 5 || echo "APIがまだ起動していません"

echo -e "\n完了！ブラウザでアクセスしてください。"