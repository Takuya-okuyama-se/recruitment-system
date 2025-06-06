# 🔒 採用管理システム - セキュリティガイド

## 📋 実装されたセキュリティ機能

### 🔐 認証システム
- **管理者モード**: 強力なパスワード認証 (`Recruit2024@Admin#`)
- **デモモード**: 簡易パスワード認証 (`demo2024`)
- **セッション管理**: 自動ログアウト機能付き

### ⏰ セッション管理
- **管理者**: 2時間の有効期限
- **デモ版**: 30分の有効期限
- **自動ログアウト**: 30分間非アクティブで強制ログアウト
- **セッション監視**: リアルタイムでセッション状態を監視

### 🎯 デモモード制限
- **データ保護**: テストデータのみ使用、実際の個人情報なし
- **機能制限**: 削除・変更機能を無効化
- **視覚的表示**: デモバナーで明確に識別
- **自動リセット**: セッション終了時にクリーンアップ

## 🚀 デモ版の安全な共有方法

### 🌐 アクセス方法

#### **方法1: 直接リンク**
```
https://your-domain.com/demo.html
↓
https://your-domain.com/dashboard.html?demo
```

#### **方法2: パラメータ付きURL**
```
https://your-domain.com/dashboard.html?demo
パスワード: demo2024
```

### 📧 クライアントへの共有テンプレート

```
件名: 採用管理システム デモ版のご案内

お疲れ様です。
採用管理システムのデモ版をご用意いたしました。

【デモ版アクセス情報】
URL: https://your-domain.com/demo.html
パスワード: demo2024
有効期限: セッション開始から30分

【ご注意事項】
・テストデータのため実際の個人情報は含まれません
・デモ用のため一部機能に制限があります
・30分で自動ログアウトします

ご不明な点がございましたらお気軽にお声がけください。
```

## 🛡️ セキュリティ設定

### 🔄 パスワード変更方法

**auth.js** の設定を変更：
```javascript
const CONFIG = {
    ADMIN_PASSWORD: "新しい管理者パスワード",
    DEMO_PASSWORD: "新しいデモパスワード",
    // ...
};
```

### ⚙️ セッション時間調整

```javascript
// セッション時間（ミリ秒）
ADMIN_SESSION_DURATION: 4 * 60 * 60 * 1000, // 4時間に変更
DEMO_SESSION_DURATION: 60 * 60 * 1000,      // 1時間に変更
```

### 🌐 IP制限の追加（推奨）

```javascript
// auth.js に追加
const ALLOWED_IPS = ['192.168.1.100', '10.0.0.50'];

function checkIPAccess() {
    // IPチェック機能を実装
    fetch('/api/get-client-ip')
        .then(response => response.json())
        .then(data => {
            if (!ALLOWED_IPS.includes(data.ip)) {
                throw new Error('IP not allowed');
            }
        });
}
```

## 🚨 現在のリスクと推奨対策

### ⚠️ 高リスク項目

1. **オープンアクセス**: URLを知っている人は誰でもアクセス可能
2. **パスワード固定**: ハードコードされたパスワード
3. **HTTPS未対応**: 通信の暗号化が必要
4. **ログ機能なし**: アクセス履歴の追跡ができない

### ✅ 推奨追加対策

#### **即座に実装すべき対策**
- [ ] HTTPS化の実施
- [ ] パスワード変更の定期実施
- [ ] アクセスログの実装
- [ ] IP制限の設定

#### **本格運用時の対策**
- [ ] OAuth認証の導入
- [ ] 多要素認証（MFA）
- [ ] データベース暗号化
- [ ] 監査ログシステム
- [ ] 脆弱性スキャン
- [ ] バックアップ・復旧計画

## 📊 アクセス監視

### 🔍 ログ確認方法

ブラウザの開発者ツールでコンソールログを確認：
```
🔐 Session saved: demo mode
🎯 Demo mode enabled
🔐 Auth system ready (demo mode)
```

### 📈 セッション状況確認

ローカルストレージを確認：
```javascript
// ブラウザコンソールで実行
console.log(localStorage.getItem('recruitment_session'));
console.log(localStorage.getItem('recruitment_mode'));
```

## 🆘 緊急時の対応

### 🚨 不正アクセス発覚時

1. **即座にパスワード変更**
2. **全セッション無効化**: `localStorage.clear()` を全ユーザーに実行
3. **アクセスログ確認**
4. **IP制限の強化**

### 🔄 システムリセット

```javascript
// 全ユーザーのセッションクリア
localStorage.removeItem('recruitment_session');
localStorage.removeItem('recruitment_mode');
```

## 📞 サポート情報

- **セキュリティに関する質問**: 開発チームまでご連絡ください
- **不具合報告**: GitHubのIssuesページをご利用ください
- **緊急時連絡**: [緊急連絡先を記載]

---

**最終更新**: 2024年12月6日  
**バージョン**: 1.0.0  
**作成者**: Claude Code