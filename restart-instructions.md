# システム再起動手順

現在、データベース接続エラーが発生しています。以下の手順で修正してください：

## 手動で実行するコマンド

ターミナルで以下のコマンドを順番に実行してください：

### 1. システムの完全停止
```bash
cd /mnt/c/Users/takuy/jinji/recruitment-system-tracker
sudo docker-compose down
sudo docker stop $(sudo docker ps -a -q)
```

### 2. 古いコンテナとボリュームの削除
```bash
sudo docker rm $(sudo docker ps -a -q)
sudo docker volume rm recruitment-system-tracker_postgres_data
sudo docker volume rm recruitment-system-tracker_pgadmin_data
```

### 3. データディレクトリのクリア
```bash
sudo rm -rf data/postgres
mkdir -p data/postgres
```

### 4. システムの再起動
```bash
sudo docker-compose up -d
```

### 5. 起動待機（20秒）
```bash
sleep 20
```

### 6. 初期データの投入
```bash
sudo docker exec sunstar_db psql -U postgres -d sunstar_recruitment -c "
INSERT INTO job_positions (id, department_id, title, requirements, target_count) VALUES
(1, 1, '研究開発エンジニア', '化学・バイオ系の知識、3年以上の研究開発経験', 3),
(2, 3, '品質管理責任者', 'ISO9001の知識、品質管理経験5年以上', 1),
(3, 2, '生産技術マネージャー', '製造業での生産管理経験、リーダーシップ', 2),
(4, 4, 'マーケティング担当', 'BtoB/BtoCマーケティング経験、データ分析スキル', 2),
(5, 5, '人事総務スタッフ', '人事労務の実務経験、コミュニケーション能力', 1)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  department_id = EXCLUDED.department_id;"
```

### 7. 状態確認
```bash
sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## 正常起動後のアクセス方法

- **メインダッシュボード**: http://localhost:5000/dashboard.html
- **データベースビューアー**: http://localhost:5000/db-viewer.html
- **候補者管理**: http://localhost:5000/candidate-form.html
- **pgAdmin**: http://localhost:5051
  - メール: admin@company.com
  - パスワード: sunstar123

## トラブルシューティング

### PostgreSQLが起動しない場合
```bash
# ログを確認
sudo docker logs sunstar_db

# 手動で起動
sudo docker-compose up -d postgres
sleep 10
sudo docker-compose up -d app
```

### APIサーバーが起動しない場合
```bash
# ログを確認
sudo docker logs sunstar_app

# 再起動
sudo docker-compose restart app
```

### すべてのログを確認
```bash
sudo docker-compose logs
```

## 注意事項

- すべてのコマンドは `sudo` が必要です
- データベースの初期化には時間がかかるため、起動後20秒程度待ってください
- エラーが続く場合は、完全にDockerを再起動してください：
  ```bash
  sudo systemctl restart docker
  ```