# PT記録アプリ

理学療法士（PT）向けの患者記録管理アプリケーションです。患者情報の管理、評価記録の作成・閲覧、記録の推移グラフ表示などの機能を提供します。

## 特徴

- 🔐 **ユーザー別認可制御**: Supabase Row Level Security (RLS) によるデータベースレベルの認可
- 📊 **評価記録管理**: 標準評価項目とカスタム評価項目をサポート
- 📈 **推移グラフ**: Chart.jsによる記録の視覚化
- 🎨 **モダンUI**: TailwindCSSによる洗練されたデザイン
- 🌐 **多言語対応**: vue-i18nによる国際化（日本語対応）
- ✅ **型安全**: TypeScriptによる堅牢な型チェック

## 技術スタック

- **フレームワーク**: [Nuxt 4](https://nuxt.com/)
- **UI**: [TailwindCSS](https://tailwindcss.com/)
- **データベース**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **認証**: Supabase Auth
- **グラフ**: Chart.js
- **国際化**: @nuxtjs/i18n
- **型**: TypeScript

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトのセットアップ

詳細は [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) を参照してください。

概要：

1. Supabaseプロジェクトを作成
2. マイグレーションを実行（`supabase/migrations/001_initial_schema.sql`）
3. 環境変数を設定

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成：

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=your-anon-key-here
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

## データベース構造

### テーブル

- **patients**: 患者基本情報（user_id で所有者を識別）
- **patient_records**: 評価記録（patient_id 経由で紐付け）
- **custom_evaluations**: カスタム評価項目（patient_record_id 経由で紐付け）

### Row Level Security (RLS)

各テーブルにRLSポリシーが設定されており、ユーザーは自分のデータのみにアクセスできます：

- SELECT: 自分のデータのみ取得可能
- INSERT: 自分のデータのみ作成可能
- UPDATE: 自分のデータのみ更新可能
- DELETE: 自分のデータのみ削除可能

## 開発

### リント

```bash
npm run lint
```

### 型チェック

```bash
npm run type-check
```

### テスト

```bash
# E2Eテスト
npm run test:e2e

# ユニットテスト
npm run test:unit
```

## 認可制御のテスト

実装した認可制御が正しく機能することを確認するには、[docs/AUTHORIZATION_TEST.md](docs/AUTHORIZATION_TEST.md) の手順に従ってください。

## プロジェクト構造

```
pt-record-app/
├── components/          # Vueコンポーネント
│   ├── molecules/      # 中間コンポーネント（テーブル、検索など）
│   └── organisms/      # 複雑なコンポーネント（フォーム、グラフなど）
├── composables/        # Vue Composables（ビジネスロジック）
├── pages/              # ページコンポーネント
├── server/             # サーバーサイドAPI
│   ├── api/           # APIエンドポイント
│   └── utils/         # サーバーユーティリティ
├── types/              # TypeScript型定義
├── i18n/               # 国際化リソース
├── supabase/           # Supabaseマイグレーション
│   └── migrations/    # SQLマイグレーションファイル
├── docs/               # ドキュメント
└── tests/              # テスト
```

## 主な機能

### 1. 認証・認可

- ユーザー登録・ログイン（Supabase Auth）
- Row Level Securityによるデータ分離
- 自動ログアウト（未認証時）

### 2. 患者管理

- 患者一覧表示・検索
- 患者詳細情報の表示
- 新規患者登録

### 3. 記録管理

- 標準評価項目の記録（ROM、MMT、VAS、NRSなど）
- カスタム評価項目の追加
- 記録の推移グラフ表示
- 過去記録の一覧表示

## 本番環境へのデプロイ

### 環境変数

本番環境では以下の環境変数を設定してください：

```bash
SUPABASE_URL=your-production-url
SUPABASE_KEY=your-production-anon-key
```

### ビルド

```bash
npm run build
```

### プレビュー

```bash
npm run preview
```

詳細は [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) を参照してください。

## ドキュメント

- [Supabaseセットアップガイド](docs/SUPABASE_SETUP.md)
- [認可制御のテスト手順](docs/AUTHORIZATION_TEST.md)
- [要件定義](specification/REQUIREMENTS.md)
- [ビジネスロジック](specification/BUSINESS_LOGIC.md)
- [コーディング規約](specification/CODING_RULES.md)

## ライセンス

MIT

## サポート

問題が発生した場合は、以下を確認してください：

1. [SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) のトラブルシューティング
2. Supabase Dashboardのログ
3. ブラウザの開発者ツール（Console）
