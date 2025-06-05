# データベースセキュリティガイドライン

## 推奨データベース構成

### 1. エンタープライズ向けデータベース選択

#### **PostgreSQL + エンタープライズセキュリティ拡張**
- **推奨理由**: オープンソースで高セキュリティ、政府機関でも採用実績
- **必須拡張機能**:
  - pgcrypto: データ暗号化
  - pg_audit: 監査ログ
  - Row Level Security (RLS): 行レベルセキュリティ

#### **Amazon RDS for PostgreSQL** (クラウド環境の場合)
- 自動バックアップ
- 暗号化at-rest/in-transit
- VPC内での隔離
- Multi-AZ構成で高可用性

### 2. セキュリティ実装要件

#### データ保護
- **暗号化**
  - データベース全体: AES-256暗号化
  - 個人情報フィールド: 追加の列レベル暗号化
  - 通信: TLS 1.3以上

#### アクセス制御
- **最小権限の原則**
  - アプリケーション用ユーザー: 必要最小限の権限
  - 読み取り専用ユーザー: レポート用
  - 管理者: 多要素認証必須

#### 監査とコンプライアンス
- 全てのデータアクセスログ記録
- 個人情報へのアクセス追跡
- 定期的なセキュリティ監査

### 3. 実装例

```sql
-- 暗号化されたテーブル作成
CREATE TABLE candidates_secure (
    id SERIAL PRIMARY KEY,
    -- 個人識別情報は暗号化
    first_name_encrypted BYTEA NOT NULL,
    last_name_encrypted BYTEA NOT NULL,
    email_encrypted BYTEA NOT NULL,
    phone_encrypted BYTEA,
    -- インデックス用ハッシュ
    email_hash VARCHAR(64) NOT NULL,
    -- 非個人情報
    years_of_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Row Level Security有効化
ALTER TABLE candidates_secure ENABLE ROW LEVEL SECURITY;

-- 部門別アクセスポリシー
CREATE POLICY department_access ON candidates_secure
    FOR ALL
    TO application_user
    USING (
        applied_position_id IN (
            SELECT id FROM job_positions 
            WHERE department_id = current_setting('app.current_department_id')::INTEGER
        )
    );
```

### 4. バックアップとリカバリ
- 日次自動バックアップ（暗号化済み）
- Point-in-Time Recovery設定
- 異なる地域へのレプリケーション

### 5. 推奨構成コスト目安
- **オンプレミス PostgreSQL**: 
  - 初期: ライセンス無料、サーバー費用のみ
  - 運用: 管理者人件費
  
- **Amazon RDS**:
  - db.m5.large (本番環境): 約3万円/月
  - Multi-AZ構成: 約6万円/月
  - バックアップストレージ: 使用量に応じて

- **Azure Database for PostgreSQL**:
  - 同等スペック: 約3.5万円/月