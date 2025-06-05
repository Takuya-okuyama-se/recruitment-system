# クイックスタートガイド（初期費用ゼロ）

## 必要なもの（全て無料）
- Docker Desktop
- Git
- テキストエディタ（VS Code推奨）

## 5分でセットアップ

### 1. プロジェクトの準備
```bash
# このフォルダに移動
cd recruitment-system-tracker

# 必要なフォルダを作成
mkdir -p data/postgres src/client/node_modules
```

### 2. 環境起動
```bash
# Dockerコンテナを起動（初回は少し時間がかかります）
docker-compose up -d

# 起動確認
docker ps
```

### 3. アクセス確認
- アプリケーション: http://localhost:5000
- フロントエンド: http://localhost:3000
- データベース管理: http://localhost:5050
  - メール: admin@company.local
  - パスワード: admin123

## 無料で使えるデータベースオプション

### 開発時（ローカル）
現在の設定で完全無料で動作します。

### 本番環境への移行時の選択肢

#### 1. Supabase（推奨）
- **無料枠**: 500MBストレージ、無制限API呼び出し
- **セキュリティ**: Row Level Security標準搭載
- **設定簡単**: PostgreSQL互換

#### 2. ElephantSQL
- **無料枠**: 20MB（小規模なら十分）
- **自動バックアップ**: 毎日実行

#### 3. Neon
- **無料枠**: 3GBストレージ
- **サーバーレス**: 自動スケーリング

## セキュリティの段階的強化

### 今すぐできること（設定済み）
✅ パスワードハッシュ化（bcrypt）
✅ 環境変数での設定管理
✅ 基本的なCORS設定

### 1週間以内に追加
- [ ] JWT認証の有効化
- [ ] レート制限の設定
- [ ] 入力値検証の追加

### 本番展開前に必須
- [ ] HTTPS化（Let's Encrypt）
- [ ] 2要素認証
- [ ] 監査ログ

## トラブルシューティング

### Dockerが起動しない
```bash
# コンテナを停止して再起動
docker-compose down
docker-compose up -d
```

### データベース接続エラー
```bash
# PostgreSQLの状態確認
docker logs recruitment_db
```

### ポートが使用中
```bash
# 別のポートに変更（docker-compose.yml編集）
ports:
  - "5433:5432"  # 5432が使用中なら5433に変更
```

## 次のステップ

1. **基本動作確認**
   - 採用フローの可視化画面を確認
   - サンプルデータの投入

2. **カスタマイズ**
   - 部門マスタの追加
   - 採用ステージの調整

3. **セキュリティ強化**
   - SECURITY_GUIDE.mdを参照

お困りの際は、issueを作成してください。