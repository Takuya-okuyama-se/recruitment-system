#!/bin/bash

echo "=== システム診断と修正 ==="
echo ""

# 1. Dockerサービスの確認
echo "1. Dockerサービスの状態確認..."
if ! command -v docker &> /dev/null; then
    echo "❌ Dockerがインストールされていません"
    exit 1
fi

# 2. 実行中のコンテナ確認
echo ""
echo "2. 実行中のコンテナ:"
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "Dockerコマンドの実行に失敗"

# 3. 停止中のコンテナも含めて確認
echo ""
echo "3. すべてのコンテナ（停止中含む）:"
sudo docker ps -a --format "table {{.Names}}\t{{.Status}}" | grep recruitment || echo "recruitmentコンテナが見つかりません"

# 4. ログ確認
echo ""
echo "4. アプリケーションログ（最新10行）:"
sudo docker logs recruitment_app --tail 10 2>&1 || echo "アプリケーションログを取得できません"

echo ""
echo "5. PostgreSQLログ（最新10行）:"
sudo docker logs recruitment_db --tail 10 2>&1 || echo "PostgreSQLログを取得できません"

# 5. ポート使用状況
echo ""
echo "6. ポート5000の使用状況:"
sudo netstat -tlnp | grep :5000 || sudo lsof -i :5000 || echo "ポート5000は使用されていません"

echo ""
echo "=== 推奨される修正手順 ==="
echo ""
echo "オプション1: コンテナを個別に再起動"
echo "  sudo docker-compose up -d postgres"
echo "  sleep 10"
echo "  sudo docker-compose up -d app"
echo ""
echo "オプション2: すべてを再構築"
echo "  sudo docker-compose down"
echo "  sudo docker-compose build --no-cache"
echo "  sudo docker-compose up -d"
echo ""
echo "オプション3: 完全リセット（データも削除）"
echo "  sudo bash full-restart.sh"