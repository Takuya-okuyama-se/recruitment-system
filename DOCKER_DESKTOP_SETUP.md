# Docker Desktop セットアップ手順（Windows + WSL2）

## ステップ1: Docker Desktop のダウンロードとインストール

### 1. ダウンロード
1. ブラウザで https://www.docker.com/products/docker-desktop/ にアクセス
2. 「Download for Windows」ボタンをクリック
3. `Docker Desktop Installer.exe` がダウンロードされます

### 2. インストール
1. ダウンロードした `Docker Desktop Installer.exe` をダブルクリック
2. インストール画面で以下を確認：
   - ✅ **Use WSL 2 instead of Hyper-V (recommended)** にチェック
   - ✅ **Add shortcut to desktop** にチェック（任意）
3. 「OK」をクリックしてインストール開始
4. インストール完了後、**「Close and restart」** をクリック
5. **PCを再起動** します（重要）

## ステップ2: Docker Desktop の初期設定

### 1. Docker Desktop を起動
1. Windowsスタートメニューから「Docker Desktop」を起動
2. 利用規約に同意（Accept）
3. 初回起動時のチュートリアルはスキップしてOK

### 2. WSL2 統合を有効化
1. Docker Desktop の右上の歯車アイコン（Settings）をクリック
2. 左メニューから **「Resources」** → **「WSL Integration」** を選択
3. 以下を設定：
   - ✅ **Enable integration with my default WSL distro** をON
   - ✅ あなたのWSLディストリビューション（Ubuntu等）のトグルをON
4. **「Apply & Restart」** をクリック

### 3. 設定の確認（Settings → General）
- ✅ Start Docker Desktop when you log in（自動起動）
- ✅ Use the WSL 2 based engine（WSL2エンジン使用）

## ステップ3: WSL側での確認

### 1. WSLターミナルを開く
```bash
# WSL (Ubuntu) を起動
# Windowsターミナル or コマンドプロンプトで
wsl
```

### 2. Docker の動作確認
```bash
# Dockerバージョン確認
docker --version
# 出力例: Docker version 24.0.7, build afdd53b

# docker-compose バージョン確認
docker-compose --version
# 出力例: Docker Compose version v2.23.3

# 動作テスト
docker run hello-world
```

## ステップ4: プロジェクトの起動

```bash
# プロジェクトディレクトリに移動
cd /mnt/c/Users/takuy/jinji/recruitment-system-tracker

# Dockerコンテナを起動
docker-compose up -d

# 起動確認
docker ps
```

## よくあるトラブルと解決方法

### 1. 「Docker Desktop - WSL distro terminated abruptly」エラー
**解決方法:**
```powershell
# PowerShellを管理者として実行
wsl --update
wsl --shutdown
# Docker Desktopを再起動
```

### 2. 「Cannot connect to the Docker daemon」エラー
**解決方法:**
1. Docker Desktopが起動しているか確認（タスクトレイにアイコンがあるか）
2. Docker Desktopを再起動
3. WSLターミナルを新しく開き直す

### 3. WSL2が有効になっていない
**解決方法:**
```powershell
# PowerShellを管理者として実行
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
wsl --set-default-version 2
```
その後、PCを再起動

### 4. メモリ使用量が多い場合
**解決方法:**
Windowsユーザーフォルダに `.wslconfig` ファイルを作成：
```
# C:\Users\takuy\.wslconfig
[wsl2]
memory=4GB
processors=2
swap=2GB
```

## 確認ポイント

✅ Docker Desktopのタスクトレイアイコンが緑色（実行中）
✅ WSLで `docker ps` コマンドが実行できる
✅ `docker-compose up -d` でエラーが出ない

## 次のステップ

インストールが完了したら：
```bash
# プロジェクトを起動
cd /mnt/c/Users/takuy/jinji/recruitment-system-tracker
docker-compose up -d

# ブラウザでアクセス
# http://localhost:5000 - アプリケーション
# http://localhost:5050 - pgAdmin（データベース管理）
```

正常に起動すれば、採用管理システムが使用可能になります！