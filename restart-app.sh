#!/bin/bash
echo "アプリケーションを再起動しています..."
sudo docker-compose restart app
echo "10秒待機中..."
sleep 10
echo "APIの動作確認..."
curl http://localhost:5000/
echo ""
echo "再起動完了！"