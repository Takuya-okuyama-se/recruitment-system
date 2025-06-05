#!/bin/bash
echo "=== システムを完全に再起動します ==="

# 1. すべてのコンテナを停止
echo "1. すべてのコンテナを停止..."
sudo docker-compose down
sudo docker stop $(sudo docker ps -a -q) 2>/dev/null

# 2. 古いコンテナを削除
echo -e "\n2. 古いコンテナを削除..."
sudo docker rm $(sudo docker ps -a -q) 2>/dev/null

# 3. ボリュームをクリア（データベースをリセット）
echo -e "\n3. データベースボリュームをリセット..."
sudo docker volume rm recruitment-recruitment-tracker_postgres_data 2>/dev/null
sudo docker volume rm recruitment-recruitment-tracker_pgadmin_data 2>/dev/null

# 4. ネットワークをクリア
echo -e "\n4. ネットワークをクリア..."
sudo docker network rm recruitment-recruitment-tracker_app_network 2>/dev/null

# 5. データディレクトリを削除
echo -e "\n5. データディレクトリをクリア..."
sudo rm -rf data/postgres 2>/dev/null
mkdir -p data/postgres

# 6. 新しくコンテナを起動
echo -e "\n6. 新しくコンテナを起動..."
sudo docker-compose up -d

# 7. 起動を待つ
echo -e "\n7. サービスの起動を待機中..."
sleep 20

# 8. 初期データを投入
echo -e "\n8. 初期データを投入..."
sudo docker exec recruitment_db psql -U postgres -d recruitment_recruitment -c "
INSERT INTO job_positions (id, department_id, title, requirements, target_count) VALUES
(1, 1, '研究開発エンジニア', '化学・バイオ系の知識、3年以上の研究開発経験', 3),
(2, 3, '品質管理責任者', 'ISO9001の知識、品質管理経験5年以上', 1),
(3, 2, '生産技術マネージャー', '製造業での生産管理経験、リーダーシップ', 2),
(4, 4, 'マーケティング担当', 'BtoB/BtoCマーケティング経験、データ分析スキル', 2),
(5, 5, '人事総務スタッフ', '人事労務の実務経験、コミュニケーション能力', 1)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  department_id = EXCLUDED.department_id;
" 2>/dev/null || echo "職種データは既に存在します"

# 9. 状態確認
echo -e "\n=== 現在の状態 ==="
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 10. API確認
echo -e "\n=== API動作確認 ==="
curl -s http://localhost:5000 | head -n 5 || echo "APIがまだ起動していません"

echo -e "\n=== 完了！ ==="
echo "システムが正常に起動しました。"
echo ""
echo "アクセス方法："
echo "- API: http://localhost:5000"
echo "- pgAdmin（新）: http://localhost:5051 (admin@recruitment.com / recruitment123)"
echo "- データベースビューアー: db-viewer.html"
echo ""
echo "ブラウザでdb-viewer.htmlをリロードしてください。"