#!/bin/bash
echo "pgAdminを再起動しています..."

# 既存のpgAdminコンテナを停止・削除
sudo docker stop recruitment_pgadmin
sudo docker rm recruitment_pgadmin

# pgAdminのボリュームをクリア（権限問題を解決）
sudo docker volume rm recruitment-recruitment-tracker_pgadmin_data 2>/dev/null

# pgAdminのみ再起動
sudo docker-compose up -d pgadmin

echo "10秒待機中..."
sleep 10

# 状態確認
echo "pgAdminの状態:"
sudo docker ps | grep pgadmin

echo ""
echo "pgAdminが起動しました！"
echo "アクセス: http://localhost:5050"
echo "メール: admin@recruitment.local"
echo "パスワード: admin123"
echo ""
echo "データベース接続情報:"
echo "- ホスト: postgres"
echo "- ポート: 5432"
echo "- データベース: recruitment_recruitment"
echo "- ユーザー: postgres"
echo "- パスワード: postgres123"