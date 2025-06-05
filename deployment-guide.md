# 採用管理システム - 納品方法ガイド

## クライアントが簡単にアクセスできる納品方法

### 🌟 推奨方法（難易度順）

## 1. **クラウドホスティング（最も簡単）** ⭐⭐⭐⭐⭐

### A. Render.com（無料・簡単）
```yaml
# render.yaml
services:
  - type: web
    name: recruitment-system
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: recruitment-db
          property: connectionString

databases:
  - name: recruitment-db
    databaseName: recruitment_system
    user: postgres
```

**クライアントへの納品**：
- URL例: `https://recruitment-system.onrender.com`
- クリックするだけでアクセス可能

### B. Heroku（有料だが安定）
```json
{
  "name": "recruitment-system-tracker",
  "description": "採用管理システム",
  "stack": "container",
  "addons": ["heroku-postgresql:hobby-dev"]
}
```

### C. Railway（シンプル）
- GitHubリポジトリを接続するだけ
- 自動でデプロイ
- URL例: `https://recruitment-system.up.railway.app`

## 2. **ワンクリックインストーラー（中級）** ⭐⭐⭐⭐

### Windows用インストーラー作成
```batch
@echo off
echo 採用管理システムをインストールしています...

:: Docker Desktopの確認
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Docker Desktopをインストールしています...
    curl -L -o docker-desktop.exe "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
    start /wait docker-desktop.exe install --quiet
)

:: システムの起動
echo システムを起動しています...
cd %~dp0
docker-compose up -d

:: ブラウザで開く
timeout /t 10
start http://localhost:5000/dashboard.html

echo.
echo ✅ インストール完了！
echo ブラウザが自動的に開きます。
echo.
echo アクセスURL: http://localhost:5000/dashboard.html
echo.
pause
```

## 3. **デスクトップアプリ化（Electron）** ⭐⭐⭐

```javascript
// main.js
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

let mainWindow
let dockerProcess

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: '採用管理システム'
  })

  // Dockerコンテナを起動
  dockerProcess = spawn('docker-compose', ['up'], {
    cwd: __dirname
  })

  // 少し待ってからページを読み込む
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:5000/dashboard.html')
  }, 5000)
}

app.whenReady().then(createWindow)
```

**配布方法**：
- `採用管理システム.exe` として配布
- ダブルクリックで起動

## 4. **ポータブル版（USB）** ⭐⭐⭐

```
recruitment-system-portable/
├── start.bat              # ダブルクリックで起動
├── stop.bat              # 終了用
├── docker-compose.yml
├── data/                 # データ永続化
└── app/                  # アプリケーションファイル
```

## 5. **VPS + 簡単アクセス** ⭐⭐

### さくらVPSやConoHaを使用
1. VPSを契約（月額1000円程度）
2. 自動セットアップスクリプトを実行
3. クライアントには以下を提供：
   - URL: `https://recruitment-demo.com`
   - ログインID/パスワード

## 🎯 最も簡単な納品手順（Render.com使用）

### 1. 準備（開発者側）
```bash
# GitHubにプッシュ
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/your-account/recruitment-system.git
git push -u origin main
```

### 2. Render.comでデプロイ
1. https://render.com にアクセス
2. 「New +」→「Web Service」
3. GitHubリポジトリを選択
4. 自動デプロイ

### 3. クライアントへの納品
```
【採用管理システム】

アクセスURL：
https://recruitment-system.onrender.com

ログイン情報：
管理者ID: admin@company.com
パスワード: SunStar2024!

推奨ブラウザ：
- Google Chrome（最新版）
- Microsoft Edge（最新版）

サポート：
メール: support@your-company.com
電話: 03-1234-5678
```

## 📦 納品パッケージ構成

```
納品フォルダ/
├── README.pdf           # 使い方ガイド（図解入り）
├── quick-start.html     # ワンクリックアクセス
├── shortcuts/
│   ├── 採用管理システム.url     # デスクトップショートカット
│   └── install-icon.bat        # アイコン設定
└── support/
    ├── FAQ.pdf
    └── contact.txt
```

## 🚀 quick-start.html の例

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>採用管理システム - スタート</title>
    <style>
        body {
            font-family: 'メイリオ', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
            margin: 0;
        }
        .container {
            text-align: center;
            background: white;
            padding: 50px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #FF6B35;
            margin-bottom: 30px;
        }
        .start-button {
            display: inline-block;
            padding: 20px 60px;
            font-size: 24px;
            background: #FF6B35;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.3s;
        }
        .start-button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 20px rgba(255,107,53,0.4);
        }
        .info {
            margin-top: 30px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 採用管理システム</h1>
        <a href="https://recruitment-system.onrender.com" class="start-button">
            システムを開始
        </a>
        <div class="info">
            <p>ボタンをクリックするとシステムが開きます</p>
            <p>推奨ブラウザ: Google Chrome</p>
        </div>
    </div>
</body>
</html>
```

## 📝 クライアント向け説明書テンプレート

```markdown
# 採用管理システム ご利用ガイド

## 1. システムへのアクセス

### 方法1: ブックマークから
1. お送りしたメールの「システムURL」をクリック
2. ブラウザでブックマーク（お気に入り）に追加

### 方法2: デスクトップショートカット
1. 納品フォルダ内の「採用管理システム.url」を
   デスクトップにドラッグ＆ドロップ

## 2. 初回ログイン
- メールアドレス: admin@company.com
- パスワード: （別途お知らせ）

## 3. 基本的な使い方
[図解入りの説明...]
```

## 💡 推奨事項

### クライアントのITスキルレベル別推奨方法

1. **初心者** → クラウドホスティング（URL提供）
2. **一般** → デスクトップアプリ or ワンクリックインストーラー
3. **社内IT部門あり** → VPS or オンプレミス

### セキュリティ考慮事項
- HTTPS化は必須
- 初期パスワードは必ず変更してもらう
- 定期的なバックアップ設定
- アクセス制限（IPホワイトリスト等）

## 🎁 納品時のチェックリスト

- [ ] システムURL
- [ ] ログイン情報（別送）
- [ ] 使い方マニュアル（PDF）
- [ ] デスクトップショートカット
- [ ] サポート連絡先
- [ ] FAQ資料
- [ ] 動画マニュアル（オプション）