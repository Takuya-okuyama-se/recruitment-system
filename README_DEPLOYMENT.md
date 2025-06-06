# 🚀 採用管理システム - デプロイメントガイド

## 🌐 Vercel デプロイメント設定

### **ブランチ戦略**

```
📦 recruitment-system
├── main        → 本番環境（管理者向け）
└── demo        → デモ環境（クライアント向け）
```

### **環境別URL**

| 環境 | ブランチ | URL | 用途 |
|------|---------|-----|------|
| 🎯 **デモ** | `demo` | `https://recruitment-system-demo.vercel.app` | クライアント向けデモ |
| 🔒 **本番** | `main` | `https://recruitment-system.vercel.app` | 実際の運用 |

## 🔧 Vercel 設定手順

### **1. デモ環境のデプロイ**

**GitHub連携:**
1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "New Project" をクリック
3. GitHubリポジトリを選択: `recruitment-system`
4. 設定：
   - **Project Name**: `recruitment-system-demo`
   - **Framework Preset**: `Other`
   - **Root Directory**: `./`
   - **Build and Output Settings**: デフォルト

**ブランチ設定:**
```bash
Production Branch: demo
```

**環境変数（必要に応じて）:**
```
NODE_ENV=demo
VERCEL_ENV=demo
```

### **2. 本番環境のデプロイ**

**別プロジェクトとして作成:**
1. "New Project" で再度同じリポジトリを選択
2. 設定：
   - **Project Name**: `recruitment-system`
   - **Production Branch**: `main`

## 📋 デプロイ後の確認事項

### **✅ チェックリスト**

- [ ] HTTPS自動適用の確認
- [ ] 認証システムの動作確認
- [ ] デモモードの制限機能確認
- [ ] レスポンシブデザイン確認
- [ ] 全ページの表示確認
- [ ] セッション管理の動作確認

### **🔍 動作テスト**

```bash
# デモ環境テスト
curl -I https://recruitment-system-demo.vercel.app
# Status: 200 OK

# 認証画面確認
# パスワード: demo2024 でログイン可能か確認

# セッション確認
# 30分後に自動ログアウトするか確認
```

## 🌐 URL共有方法

### **📧 クライアント向けメール**

```
件名: 採用管理システム デモ版のご案内

お疲れ様です。

採用管理システムのデモ版をご用意いたしました。
以下のURLからアクセスしてご確認ください。

【デモ版URL】
🌐 https://recruitment-system-demo.vercel.app

【アクセス情報】
🔒 パスワード: demo2024
⏰ セッション時間: 30分（自動ログアウト）
📱 スマートフォン対応

【ご注意事項】
• テストデータのため実際の個人情報は含まれません
• デモ用のため一部機能に制限があります
• セキュリティのため30分で自動ログアウトします

ご質問やご不明な点がございましたら、
お気軽にお声がけください。

よろしくお願いいたします。
```

### **💬 LINE/チャット向けメッセージ**

```
採用管理システムのデモ版です🏢

🌐 https://recruitment-system-demo.vercel.app
🔐 パスワード: demo2024

✨ 機能紹介
👤 候補者管理
📝 面接評価  
📊 適性検査
💼 内定管理
📈 データ分析

⚠️ 30分制限・テストデータのみ
💡 ご質問はお気軽にどうぞ！
```

### **🔗 ソーシャル共有用**

```
🏢 採用管理システム デモ版

効率的な採用プロセスを実現する
Webアプリケーションです

🎯 今すぐデモを体験:
https://recruitment-system-demo.vercel.app

#採用管理 #HRTech #効率化
```

## 🔄 継続的デプロイメント

### **自動デプロイ設定**

```yaml
# .github/workflows/deploy.yml (参考)
name: Deploy to Vercel
on:
  push:
    branches: [demo, main]
  
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### **ブランチ管理**

```bash
# デモ環境更新
git checkout demo
git merge main  # mainからの変更を取り込み
git push origin demo

# 本番環境更新  
git checkout main
git push origin main
```

## 🛡️ セキュリティ設定

### **Vercel Headers（vercel.json設定済み）**

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy`: 制限付きCSP

### **ドメイン設定（オプション）**

```bash
# カスタムドメイン設定例
demo.your-company.com → recruitment-system-demo.vercel.app
recruit.your-company.com → recruitment-system.vercel.app
```

## 📊 Analytics & Monitoring

### **Vercel Analytics**

```javascript
// pages/_app.js に追加（Next.jsの場合）
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### **使用状況監視**

- Vercel Dashboard でアクセス状況確認
- パフォーマンス指標の監視
- エラーログの確認

## 🆘 トラブルシューティング

### **よくある問題**

**1. 認証が動作しない**
```
解決: auth.js と demo-data.js の読み込み順序確認
```

**2. スタイルが適用されない**
```
解決: unified-styles.css の相対パス確認
```

**3. 404エラー**
```
解決: vercel.json のルーティング設定確認
```

### **デバッグ方法**

```javascript
// ブラウザコンソールで確認
console.log('Auth mode:', window.AuthSystem?.getCurrentMode());
console.log('Demo mode:', window.AuthSystem?.isDemoMode());
```

---

**最終更新**: 2024年12月6日  
**バージョン**: 1.0.0  
**担当者**: 開発チーム