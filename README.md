# 恋愛診断&コンサルティングシステム

Typeform + Dify + Next.js 14で構築された恋愛診断システムです。

## 🚀 技術スタック

### フロントエンド
- **React**: UIライブラリ
- **Next.js 14**: フレームワーク（App Router）
- **TypeScript**: 型安全な開発
- **SHADCN UI**: デザインコンポーネント
- **Tailwind CSS**: CSSフレームワーク
- **Framer Motion**: アニメーション

### バックエンド
- **Next.js 14**: API Routes
- **Supabase**: データベース・認証・ストレージ
- **Typeform**: 診断フォーム（Webhook連携）
- **Dify**: AI診断結果生成

### 開発支援
- **Cursor**: AIエディタ
- **Claude**: AIアシスタント

## 📦 セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.local`ファイルを作成し、以下の環境変数を設定：

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Typeform
TYPEFORM_WEBHOOK_SECRET=your_typeform_webhook_secret
TYPEFORM_FORM_ID=your_typeform_form_id

# Dify
DIFY_API_ENDPOINT=your_dify_endpoint
DIFY_API_KEY=your_dify_api_key

# Next.js
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

## 📁 プロジェクト構造

```
/
├── app/                    # Next.js 14 App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ランディングページ
│   ├── diagnosis/         # 診断関連ページ
│   ├── subscribe/         # メール配信登録
│   ├── api/              # API Routes
│   └── globals.css       # グローバルスタイル
├── components/           # 再利用可能コンポーネント
│   ├── ui/              # SHADCN UIコンポーネント
│   ├── forms/           # フォームコンポーネント
│   └── animations/      # Framer Motionアニメーション
├── lib/                 # ユーティリティ・設定
│   ├── supabase.ts      # Supabase設定
│   └── utils.ts         # 共通ユーティリティ
├── types/               # TypeScript型定義
└── docs/                # ドキュメント
```

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# リンター実行
npm run lint

# 型チェック
npm run type-check
```

## 🎯 主要機能

1. **恋愛診断**: Typeformで10問の診断
2. **AI分析**: Difyで恋愛スタイル判定
3. **教育レベル判定**: 高/中/低レベルに分類
4. **結果表示**: カスタマイズされたHTML出力
5. **コンサル申込**: 高レベル向け申込フォーム
6. **メール配信**: 中・低レベル向け教育コンテンツ

## 📊 教育レベル判定基準

### 高レベル（バックエンドサービス案内）
- 自己投資スコア: 20万円以上
- 成長マインドセット: 複数項目選択
- 自己価値: 「自分を大事にしています」選択
- 問題分析: 具体的な記述

### 中レベル（教育コンテンツ提供）
- 自己投資スコア: 10-20万円
- 成長マインドセット: 1-2項目選択
- 課題認識: 解決方法が不明確

### 低レベル（基礎教育コンテンツ）
- 自己投資スコア: 5万円以下
- 自己価値: 相手中心の行動
- 問題認識: 現状認識が曖昧

## 🚀 デプロイ

Vercelでのデプロイを推奨：

1. GitHubリポジトリと連携
2. 環境変数を設定
3. 自動デプロイ

## 📝 ライセンス

MIT License
