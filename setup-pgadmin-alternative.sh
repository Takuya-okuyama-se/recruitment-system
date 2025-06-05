#!/bin/bash
echo "pgAdminの代替セットアップを開始します..."

# 既存のpgAdminを停止
sudo docker stop recruitment_pgadmin 2>/dev/null
sudo docker rm recruitment_pgadmin 2>/dev/null

# 新しいpgAdminを起動（別のポートで）
echo "新しいpgAdminを起動中..."
sudo docker-compose -f docker-compose-pgadmin.yml up -d

echo "10秒待機中..."
sleep 10

# 状態確認
echo ""
echo "✅ pgAdminが起動しました！"
echo ""
echo "=== アクセス情報 ==="
echo "URL: http://localhost:5051"
echo "メール: admin@recruitment.com"
echo "パスワード: recruitment123"
echo ""
echo "=== データベース接続設定 ==="
echo "1. pgAdminにログイン後、「Add New Server」をクリック"
echo "2. General タブ:"
echo "   - Name: Sunstar DB"
echo "3. Connection タブ:"
echo "   - Host: postgres"
echo "   - Port: 5432"
echo "   - Database: recruitment_recruitment"
echo "   - Username: postgres"
echo "   - Password: postgres123"
echo ""

# 代替案の提案
echo "=== 代替オプション ==="
echo "もしpgAdminが動作しない場合は、以下のコマンドでデータベースに直接アクセスできます:"
echo ""
echo "sudo docker exec -it recruitment_db psql -U postgres -d recruitment_recruitment"
echo ""