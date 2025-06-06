# 採用管理システム 納品物一覧

## 📦 納品内容

### 1. システムファイル一式
- `recruitment-system/` フォルダ全体
- 全ソースコード、設定ファイル含む

### 2. ドキュメント
- `README.md` - システム概要
- `DEPLOYMENT_GUIDE.md` - 展開・運用ガイド
- `SECURITY_GUIDE.md` - セキュリティガイド
- `database/schema.sql` - データベース設計書

### 3. 起動用スクリプト
- `easy-install.bat` (Windows用)
- `easy-install.sh` (Mac/Linux用)
- `open-dashboard.bat/sh` - ダッシュボード起動

## 🚀 クイックスタート

### 最も簡単な起動方法
1. Dockerをインストール
2. `easy-install.bat` (Windows) または `./easy-install.sh` (Mac/Linux) を実行
3. ブラウザで http://localhost:5000/dashboard.html にアクセス

## 📱 モバイル対応について

### ハンバーガーメニュー
- **表示条件**: 画面幅768px以下
- **位置**: 画面右上に白い背景の四角形ボタン
- **動作**: クリックでナビゲーションメニューが開閉

### 確認方法
1. ブラウザウィンドウを768px以下に縮小
2. または開発者ツール（F12）でモバイルビューを選択

## 🔧 カスタマイズ可能な項目

### 1. 会社ロゴ・ブランディング
- `unified-styles.css` でカラースキームを変更
- 各HTMLファイルのタイトルを変更

### 2. データベース項目
- `database/schema.sql` を編集して項目追加
- 対応するHTMLフォームを更新

### 3. 通知機能
- メール通知の追加（要SMTP設定）
- Slack連携の追加（要API設定）

## 📊 主要機能一覧

1. **ダッシュボード** (`dashboard.html`)
   - 採用ファネル表示
   - 部署別進捗
   - 最近の活動

2. **候補者管理** (`candidate-form.html`)
   - 候補者情報登録
   - ステータス管理
   - 履歴書アップロード

3. **面接評価** (`evaluation-form.html`)
   - 評価入力
   - コメント記録
   - 評価履歴

4. **適性検査** (`aptitude-test-form.html`)
   - テスト結果入力
   - スコア管理

5. **内定管理** (`offer-management.html`)
   - 内定条件設定
   - 承諾状況追跡

## 🛡️ セキュリティ

### 本番環境での必須設定
1. HTTPSの有効化
2. データベースパスワードの変更
3. 環境変数での機密情報管理
4. 定期バックアップの設定

## 📞 サポート

### よくある質問
1. **Q: ポート5000が使用中**
   - A: 他のアプリケーションを停止するか、docker-compose.ymlでポート変更

2. **Q: データベース接続エラー**
   - A: Docker Desktopが起動していることを確認

3. **Q: ハンバーガーメニューが表示されない**
   - A: ブラウザキャッシュをクリア（Ctrl+Shift+R）

### 技術仕様
- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **バックエンド**: Node.js, Express
- **データベース**: PostgreSQL
- **コンテナ**: Docker
- **対応ブラウザ**: Chrome, Edge, Safari, Firefox（最新版）

## 📝 ライセンス
本システムはクライアント様専用にカスタマイズされています。
第三者への譲渡・販売はご遠慮ください。

---
納品日: 2024年6月7日
バージョン: 1.0.0