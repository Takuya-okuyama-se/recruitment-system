-- セキュアな採用管理システム データベーススキーマ

-- アプリケーション用ロールの作成
-- 注意: 本番環境では環境変数 APP_DB_PASSWORD の値を使用してください
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'application_user') THEN
        CREATE ROLE application_user WITH LOGIN PASSWORD 'CHANGE_THIS_APP_PASSWORD';
    END IF;
END
$$;

-- 暗号化拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 監査ログテーブル
CREATE TABLE audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    session_id VARCHAR(100)
);

-- ユーザー認証テーブル
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'hr_manager', 'interviewer', 'viewer')),
    department_id INTEGER,
    is_active BOOLEAN DEFAULT true,
    mfa_secret VARCHAR(255),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- セッション管理
CREATE TABLE user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 暗号化された候補者情報
CREATE TABLE candidates_secure (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    -- 暗号化された個人情報
    personal_data_encrypted BYTEA NOT NULL, -- JSON形式で名前、メール、電話を暗号化
    email_hash VARCHAR(64) NOT NULL, -- 検索用ハッシュ
    
    -- 暗号化不要な業務データ
    current_company VARCHAR(200),
    years_of_experience INTEGER,
    education TEXT,
    languages TEXT,
    applied_position_id INTEGER,
    source VARCHAR(50),
    
    -- メタデータ
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP -- 論理削除
);

-- アクセス制御テーブル
CREATE TABLE data_access_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    permission_type VARCHAR(20) NOT NULL CHECK (permission_type IN ('read', 'write', 'delete')),
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- 暗号化キー管理
CREATE TABLE encryption_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    key_version INTEGER NOT NULL,
    encrypted_key BYTEA NOT NULL, -- マスターキーで暗号化
    algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rotated_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- データアクセスログ
CREATE TABLE data_access_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    accessed_table VARCHAR(100) NOT NULL,
    accessed_id UUID,
    access_type VARCHAR(20) NOT NULL,
    accessed_fields TEXT[],
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    success BOOLEAN DEFAULT true,
    error_message TEXT
);

-- 面接官割り当てテーブル
CREATE TABLE interview_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    candidate_id UUID REFERENCES candidates_secure(id),
    interviewer_id UUID REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interview_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'assigned'
);

-- アプリケーションユーザーへの権限付与
GRANT USAGE ON SCHEMA public TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO application_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO application_user;

-- RLSポリシーの設定
ALTER TABLE candidates_secure ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_access_logs ENABLE ROW LEVEL SECURITY;

-- HR管理者は全データアクセス可能
CREATE POLICY hr_full_access ON candidates_secure
    FOR ALL
    TO application_user
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = current_setting('app.current_user_id')::UUID
            AND role IN ('admin', 'hr_manager')
            AND is_active = true
        )
    );

-- 面接官は担当候補者のみアクセス可能
CREATE POLICY interviewer_limited_access ON candidates_secure
    FOR SELECT
    TO application_user
    USING (
        EXISTS (
            SELECT 1 FROM interview_assignments ia
            JOIN users u ON u.id = ia.interviewer_id
            WHERE ia.candidate_id = candidates_secure.id
            AND u.id = current_setting('app.current_user_id')::UUID
            AND u.role = 'interviewer'
            AND u.is_active = true
        )
    );

-- 監査トリガー関数
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        operation,
        user_id,
        old_data,
        new_data,
        ip_address,
        session_id
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        current_setting('app.current_user_id', true),
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) END,
        current_setting('app.client_ip', true)::INET,
        current_setting('app.session_id', true)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 主要テーブルに監査トリガーを設定
CREATE TRIGGER candidates_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON candidates_secure
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- インデックス作成（暗号化を考慮）
CREATE INDEX idx_candidates_email_hash ON candidates_secure(email_hash);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_data_access_logs_user_timestamp ON data_access_logs(user_id, timestamp);
CREATE INDEX idx_interview_assignments_candidate ON interview_assignments(candidate_id);
CREATE INDEX idx_interview_assignments_interviewer ON interview_assignments(interviewer_id);

-- セキュリティビュー（個人情報を復号化せずに使用）
CREATE VIEW candidates_summary AS
SELECT 
    id,
    current_company,
    years_of_experience,
    applied_position_id,
    source,
    created_at
FROM candidates_secure
WHERE deleted_at IS NULL;