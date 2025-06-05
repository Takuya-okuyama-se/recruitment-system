# Docker セットアップガイド（WSL環境）

## 方法1: Docker Desktop を使用（推奨）

### 1. Windows側でDocker Desktopをインストール
1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)をダウンロード
2. インストーラーを実行
3. 「Use WSL 2 instead of Hyper-V」にチェックを入れる
4. インストール完了後、PCを再起動

### 2. Docker DesktopでWSL統合を有効化
1. Docker Desktopを起動
2. Settings → Resources → WSL Integration
3. 「Enable integration with my default WSL distro」をON
4. 使用しているWSLディストリビューションをON
5. 「Apply & Restart」をクリック

### 3. WSLで確認
```bash
# Dockerが使えるか確認
docker --version
docker-compose --version
```

## 方法2: WSL内に直接インストール

### Dockerをインストール
```bash
# 必要なパッケージをインストール
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# Docker公式のGPGキーを追加
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Dockerリポジトリを追加
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Dockerをインストール
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 現在のユーザーをdockerグループに追加
sudo usermod -aG docker $USER

# WSLを再起動（PowerShellで実行）
# wsl --shutdown
# その後、WSLを再度開く
```

### docker-compose をインストール
```bash
# 最新版のdocker-composeをインストール
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 確認
docker-compose --version
```

## 方法3: 簡易インストール（apt経由）

最も簡単ですが、バージョンが古い可能性があります：

```bash
# docker-composeをインストール
sudo apt update
sudo apt install -y docker-compose

# Dockerサービスを起動
sudo service docker start

# 現在のユーザーをdockerグループに追加
sudo usermod -aG docker $USER

# 一度ログアウトして再ログイン、または以下を実行
newgrp docker
```

## インストール後の確認

```bash
# Dockerの動作確認
docker run hello-world

# プロジェクトディレクトリに移動
cd /mnt/c/Users/takuy/jinji/recruitment-system-tracker

# アプリケーションを起動
docker-compose up -d

# 起動状態を確認
docker-compose ps
```

## トラブルシューティング

### 「permission denied」エラーが出る場合
```bash
# Dockerグループに追加されているか確認
groups

# dockerグループがない場合は再ログイン
exit
# WSLを再度開く
```

### Dockerサービスが起動していない場合
```bash
# Dockerサービスを起動
sudo service docker start

# 自動起動を設定（WSL2の場合）
echo "sudo service docker start" >> ~/.bashrc
```

### Docker Desktopが遅い場合
WSL2の設定ファイルを作成：
```bash
# Windows側で以下のファイルを作成
# C:\Users\takuy\.wslconfig

[wsl2]
memory=4GB
processors=2
```

## 推奨事項
**Docker Desktop（方法1）** を推奨します。理由：
- インストールが簡単
- GUIで管理可能
- WSLとの統合がスムーズ
- 自動アップデート