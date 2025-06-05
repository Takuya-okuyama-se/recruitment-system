#!/bin/bash

echo "=== クイック修正スクリプト ==="
echo ""

# 最も可能性の高い問題を順番に修正

echo "1. body-parserの依存関係を確認..."
if ! grep -q "body-parser" package.json; then
    echo "❌ body-parserが不足しています。package.jsonを更新します..."
    # package.jsonを手動で更新する必要があります
fi

echo ""
echo "2. アプリケーションを再起動..."
sudo docker-compose down
sudo docker-compose up -d postgres

echo ""
echo "3. PostgreSQLの起動を待機（15秒）..."
sleep 15

echo ""
echo "4. アプリケーションコンテナを起動..."
sudo docker-compose up -d app

echo ""
echo "5. アプリケーションの起動を待機（10秒）..."
sleep 10

echo ""
echo "6. 動作確認..."
echo "API確認:"
curl -v http://localhost:5000 2>&1 | grep -E "(HTTP|Connected|Failed)"

echo ""
echo "7. コンテナログ確認:"
sudo docker logs recruitment_app --tail 20

echo ""
echo "=== 診断結果 ==="
echo ""
echo "もしまだ動作しない場合は、以下を確認してください："
echo ""
echo "1. ファイアウォール/セキュリティソフトがポート5000をブロックしていないか"
echo "2. 他のプロセスがポート5000を使用していないか:"
echo "   sudo lsof -i :5000"
echo ""
echo "3. node_modulesを再インストール:"
echo "   sudo docker-compose exec app npm install"
echo ""
echo "4. 手動でサーバーを起動してエラーを確認:"
echo "   sudo docker-compose exec app node src/server/index.js"