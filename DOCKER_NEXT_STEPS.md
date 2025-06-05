# Docker セットアップ - 次のステップ

## 現在の状況
WSL環境でdocker-composeコマンドが見つからない状態です。

## 選択可能なプラン

### 🟢 プランA: Docker Desktop（推奨・最も簡単）

#### 手順
1. **Windows側でDocker Desktopをインストール**
   - https://www.docker.com/products/docker-desktop/
   - ダウンロードして実行（約5分）
   - WSL2統合を有効化
   - PC再起動

2. **WSLで確認**
   ```bash
   # Docker Desktopインストール後
   docker --version
   docker-compose --version
   ```

3. **アプリ起動**
   ```bash
   cd /mnt/c/Users/takuy/jinji/recruitment-system-tracker
   docker-compose up -d
   ```

#### メリット
- ✅ 最も簡単（GUI操作）
- ✅ 自動でWSL統合
- ✅ 無料で商用利用可能（小規模チーム）
- ✅ アップデートが簡単

---

### 🟡 プランB: WSL内に直接インストール（中級者向け）

#### 手順
1. **必要最小限のインストール**
   ```bash
   # docker-composeのみインストール
   sudo apt update
   sudo apt install docker-compose -y

   # Dockerサービス起動
   sudo service docker start
   
   # 権限設定
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **動作確認**
   ```bash
   docker-compose --version
   docker ps
   ```

3. **アプリ起動**
   ```bash
   cd /mnt/c/Users/takuy/jinji/recruitment-system-tracker
   docker-compose up -d
   ```

#### メリット
- ✅ 軽量（GUIなし）
- ✅ 完全にWSL内で完結
- ❌ 手動設定が必要

---

### 🔴 プランC: 最新版を手動インストール（上級者向け）

#### 手順
公式リポジトリから最新版をインストール（詳細はDOCKER_SETUP.mdを参照）

#### メリット
- ✅ 最新機能が使える
- ❌ 設定が複雑
- ❌ トラブルシューティングが必要な場合あり

---

## 🎯 推奨する次のアクション

### 今すぐ実行（5分で完了）

**プランBの簡易版を試す：**
```bash
# 1. 最小限のインストール
sudo apt update && sudo apt install docker-compose -y

# 2. Dockerサービス開始
sudo service docker start

# 3. 権限追加
sudo usermod -aG docker $USER

# 4. 新しいグループで再ログイン
su - $USER

# 5. プロジェクトディレクトリへ移動
cd /mnt/c/Users/takuy/jinji/recruitment-system-tracker

# 6. アプリケーション起動
docker-compose up -d

# 7. 起動確認
docker ps
```

### 起動後の確認

成功したら以下のURLでアクセス可能：
- **採用管理システム**: http://localhost:5000
- **データベース管理**: http://localhost:5050
  - Email: admin@company.local
  - Password: admin123

---

## ⚠️ トラブルシューティング

### "Cannot connect to Docker daemon"エラーの場合
```bash
# Dockerサービスを再起動
sudo service docker restart

# 状態確認
sudo service docker status
```

### "Permission denied"エラーの場合
```bash
# dockerグループに追加されているか確認
groups

# 追加されていない場合
sudo usermod -aG docker $USER
# その後、ターミナルを再起動
```

### ポートが使用中の場合
```bash
# 使用中のポートを確認
sudo lsof -i :5000
sudo lsof -i :5432
sudo lsof -i :5050

# 必要に応じてdocker-compose.ymlのポート番号を変更
```

---

## 📝 まとめ

1. **最速で試したい** → プランBの簡易版（上記コマンド）
2. **長期的に使いたい** → プランA（Docker Desktop）
3. **最新機能が必要** → プランC（手動インストール）

どのプランを選んでも、最終的に同じ採用管理システムが動作します！