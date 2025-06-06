# ゼロ知識構成 - 開発者がデータを見れない設定方法

## 🔒 最も安全な方法：クライアント完全管理

### 概要
開発者は一切データにアクセスできない構成

### 設定手順

#### 1. クライアントがSupabaseアカウントを作成
```
クライアント側で実施：
1. https://app.supabase.com でアカウント作成
2. 新規プロジェクト作成
3. 開発者には以下のみ共有：
   - Project URL（公開情報）
   - anon key（公開可能）
   ※ パスワードやservice keyは共有しない
```

#### 2. 開発者がスキーマ作成SQLを提供
```sql
-- このSQLファイルをクライアントに送付
-- クライアントが自分で実行する
CREATE TABLE candidates (...);
CREATE TABLE positions (...);
-- 以下略
```

#### 3. 環境変数の設定
```javascript
// クライアントが自分で設定
const SUPABASE_URL = 'クライアントのURL';
const SUPABASE_ANON_KEY = 'クライアントのキー';
```

#### 4. Vercelへのデプロイ
```
2つの選択肢：

A. クライアントのVercelアカウント（推奨）
   - クライアントがVercelアカウント作成
   - GitHubリポジトリをフォーク
   - 自分でデプロイ

B. 開発者のVercelアカウント
   - 環境変数はクライアントが設定
   - ドメインはクライアントが管理
```

---

## 🛡️ セミ・ゼロ知識構成

### 概要
開発者は限定的なアクセスのみ（トラブルシューティング用）

### 実装方法

#### 1. 役割ベースのアクセス制御（RBAC）
```sql
-- 読み取り専用ロールを作成
CREATE ROLE support_role WITH LOGIN PASSWORD 'separate_password';
GRANT SELECT ON candidates, positions TO support_role;
-- INSERT, UPDATE, DELETE権限は付与しない
```

#### 2. ビューによるデータマスキング
```sql
-- 個人情報をマスクしたビューを作成
CREATE VIEW masked_candidates AS
SELECT 
  id,
  SUBSTRING(name, 1, 1) || '***' as name,
  SUBSTRING(email, 1, 3) || '***@***' as email,
  '***-****-****' as phone,
  position_id,
  status,
  created_at
FROM candidates;

-- サポート用にはビューのみアクセス許可
GRANT SELECT ON masked_candidates TO support_role;
```

#### 3. 監査ログの実装
```javascript
// すべてのアクセスを記録
async function logAccess(action, table, userId) {
  await supabase.from('audit_logs').insert({
    action,
    table_name: table,
    user_id: userId,
    ip_address: request.ip,
    timestamp: new Date()
  });
}
```

---

## 🎯 クライアント向け説明資料

### プライバシー保護の3つのレベル

```
レベル1：完全分離 ⭐⭐⭐⭐⭐
├─ あなたのデータは誰も見れません
├─ 完全なプライバシー保護
└─ 技術知識が必要

レベル2：監査付き管理 ⭐⭐⭐⭐
├─ 開発者は限定的アクセスのみ
├─ すべてのアクセスログを記録
└─ バランスの取れた選択

レベル3：信頼ベース ⭐⭐⭐
├─ NDA（機密保持契約）で保護
├─ 最も簡単に始められる
└─ 中小企業で一般的
```

---

## 💡 現実的な提案

### 段階的アプローチ
```
Phase 1（開始時）
└─ NDA + 管理代行でスタート

Phase 2（3-6ヶ月後）
└─ クライアントに技術者が入社
└─ 引き継ぎ準備

Phase 3（完了）
└─ 完全移管
└─ サポート契約に移行
```

### 料金体系の例
```
🅰️ 完全分離プラン
初期設定サポート: 100,000円
月額サポート: なし（or 問い合わせベース）

🅱️ 管理代行プラン
初期設定: 30,000円
月額: 8,000円
※ NDA締結必須

🅾️ 移行サポートプラン
初期（管理代行）: 月額8,000円
移行作業: 50,000円
移行後サポート: 月額3,000円
```

---

## 📝 チェックリスト

### クライアントに確認すること
- [ ] 社内のセキュリティポリシー
- [ ] 個人情報の取り扱い規定
- [ ] IT担当者の有無
- [ ] 将来的な内製化の予定
- [ ] 予算感

### 提供する書類
- [ ] NDA（機密保持契約書）
- [ ] セキュリティ説明書
- [ ] 各プランの比較表
- [ ] 料金表
- [ ] 移行計画書（該当する場合）

これで、クライアントのセキュリティ要件に
応じた最適な提案ができます。