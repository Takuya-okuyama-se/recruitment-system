# 採用管理システム採用プロセス管理システム

## 概要
採用管理システム株式会社向けの採用プロセス可視化ツールです。採用の各ステージを見える化し、効率的な人材獲得を支援します。

## 主な機能

### 1. 採用フロー管理
- **書類選考** → **一次面接** → **適性検査** → **最終面接** → **内定** の標準フローを可視化
- 各ステージの通過率・所要日数を自動計算
- ボトルネックの特定と改善提案

### 2. 候補者管理
- 応募者情報の一元管理
- 履歴書・職務経歴書のデジタル管理
- 面接評価の記録・共有

### 3. 分析ダッシュボード
- 採用KPIの可視化（応募数、通過率、採用コスト等）
- 部門別・職種別の採用進捗
- 採用チャネル別の効果測定

### 4. コミュニケーション機能
- 候補者への自動メール送信
- 面接官への日程調整通知
- 採用チーム内での情報共有

## 技術スタック
- フロントエンド: React + TypeScript
- バックエンド: Node.js + Express
- データベース: PostgreSQL
- 認証: JWT
- グラフ表示: Chart.js

## 採用管理システム特有の要件
- グローバル展開に対応（多言語対応）
- 研究開発職・技術職の専門性評価項目
- コンプライアンスチェック機能