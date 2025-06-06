# 採用管理システム - 納品ガイド

## 1. システムの起動方法

### Windows環境
```bash
# 1. コマンドプロンプトまたはPowerShellを開く
# 2. プロジェクトフォルダに移動
cd C:\path\to\recruitment-system

# 3. システムを起動
easy-install.bat
```

### Mac/Linux環境
```bash
# 1. ターミナルを開く
# 2. プロジェクトフォルダに移動
cd /path/to/recruitment-system

# 3. 実行権限を付与（初回のみ）
chmod +x easy-install.sh

# 4. システムを起動
./easy-install.sh
```

## 2. アクセス方法

システム起動後、以下のURLでアクセス：
- **ローカル環境**: http://localhost:5000/dashboard.html
- **同一ネットワーク内の他の端末から**: http://[サーバーのIPアドレス]:5000/dashboard.html

## 3. 必要な環境

- **Docker Desktop** (Windows/Mac)
- **Docker & Docker Compose** (Linux)
- **推奨ブラウザ**: Chrome, Edge, Safari, Firefox の最新版

## 4. 本番環境への展開

### オプション1: クラウドサービス（推奨）

#### Render.comでの展開
1. https://render.com でアカウント作成
2. GitHubリポジトリと連携
3. 新しいWebサービスを作成
4. 環境変数を設定：
   ```
   DATABASE_URL=your_database_url
   NODE_ENV=production
   PORT=5000
   ```

#### Herokuでの展開
1. https://heroku.com でアカウント作成
2. Heroku CLIをインストール
3. 以下のコマンドを実行：
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:hobby-dev
   git push heroku main
   ```

### オプション2: VPS（仮想専用サーバー）

1. **サーバーの準備**
   - Ubuntu 20.04以上を推奨
   - 最小要件: 1GB RAM, 20GB ストレージ

2. **Dockerのインストール**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

3. **プロジェクトの配置**
   ```bash
   git clone https://github.com/your-repo/recruitment-system.git
   cd recruitment-system
   ```

4. **本番用設定**
   ```bash
   # .envファイルを作成
   cp .env.example .env
   # 本番用の設定を編集
   nano .env
   ```

5. **起動**
   ```bash
   docker-compose -f docker-compose.secure.yml up -d
   ```

### オプション3: 社内サーバー

1. **要件**
   - Windows Server 2019以上 または Linux
   - Docker対応
   - 固定IPアドレス
   - SSL証明書（HTTPS用）

2. **セキュリティ設定**
   - ファイアウォール: ポート443（HTTPS）のみ開放
   - リバースプロキシ（Nginx）の設定
   - SSL証明書の設定

## 5. データのバックアップ

### 自動バックアップスクリプト
```bash
# バックアップの作成
docker exec recruitment-db pg_dump -U postgres recruitment_db > backup_$(date +%Y%m%d).sql

# バックアップの復元
docker exec -i recruitment-db psql -U postgres recruitment_db < backup_20240607.sql
```

## 6. メンテナンス

### ログの確認
```bash
# アプリケーションログ
docker logs recruitment-app

# データベースログ
docker logs recruitment-db
```

### システムの再起動
```bash
# Windows
restart-app.bat

# Mac/Linux
./restart-app.sh
```

## 7. トラブルシューティング

### ポート5000が使用中の場合
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [プロセスID] /F

# Mac/Linux
lsof -i :5000
kill -9 [プロセスID]
```

### データベース接続エラー
1. Docker Desktopが起動していることを確認
2. `docker ps`でコンテナの状態を確認
3. `docker-compose restart`で再起動

## 8. サポート

問題が発生した場合は、以下の情報と共にご連絡ください：
- エラーメッセージのスクリーンショット
- `docker logs`の出力
- 使用環境（OS、ブラウザ）

## 9. セキュリティ推奨事項

1. **定期的なバックアップ**
2. **SSL証明書の使用**（本番環境）
3. **強力なパスワードの設定**
4. **アクセス制限**（IPホワイトリスト等）
5. **定期的なセキュリティアップデート**