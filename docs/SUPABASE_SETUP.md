# Supabaseセットアップガイド

このガイドでは、PT記録アプリでSupabaseを使用するための初期セットアップ手順を説明します。

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://app.supabase.com) にアクセスしてアカウントを作成（既にある場合はログイン）
2. 「New Project」をクリック
3. プロジェクト情報を入力：
   - **Name**: `pt-record-app`（任意の名前）
   - **Database Password**: 強力なパスワードを設定（保存しておく）
   - **Region**: `Northeast Asia (Tokyo)` を推奨
4. 「Create new project」をクリック
5. プロジェクトの作成完了を待つ（数分かかります）

## 2. 認証設定

### Email認証の有効化

1. Supabase Dashboardで「Authentication」→「Providers」に移動
2. 「Email」プロバイダーが有効になっていることを確認
3. 開発環境では以下の設定を推奨：
   - **Confirm email**: OFF（開発時はメール確認を無効化）
   - **Secure email change**: ON
   - **Secure password change**: ON

### リダイレクトURLの設定

1. 「Authentication」→「URL Configuration」に移動
2. 「Site URL」を設定：
   - 開発環境: `http://localhost:3000`
   - 本番環境: あなたのドメイン
3. 「Redirect URLs」に以下を追加：
   - `http://localhost:3000/**`（開発環境）
   - 本番環境のURL（デプロイ時）

## 3. データベースマイグレーションの実行

### 方法A: Supabase Dashboard（推奨・簡単）

1. Supabase Dashboardで「SQL Editor」に移動
2. 「New query」をクリック
3. `supabase/migrations/001_initial_schema.sql` ファイルの内容をコピー
4. SQL Editorにペースト
5. 「Run」をクリック
6. エラーがないことを確認

### 方法B: Supabase CLI

```bash
# Supabase CLIのインストール（初回のみ）
npm install -g supabase

# プロジェクトをリンク
supabase link --project-ref your-project-ref

# マイグレーションを実行
supabase db push
```

## 4. 環境変数の設定

### プロジェクト情報の取得

1. Supabase Dashboardで「Settings」→「API」に移動
2. 以下の情報をコピー：
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### .envファイルの作成

プロジェクトルートに `.env` ファイルを作成し、以下を記述：

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **重要**:

- `SUPABASE_KEY`には**anon public**キーを使用してください
- **service_role**キーは使用しないでください（セキュリティリスク）
- `.env`ファイルは`.gitignore`に含まれており、Gitにコミットされません

## 5. データベース構造の確認

マイグレーション実行後、以下のテーブルが作成されます：

### テーブル一覧

1. **patients**: 患者基本情報
2. **patient_records**: 評価記録
3. **custom_evaluations**: カスタム評価項目

### RLSポリシーの確認

1. Supabase Dashboardで「Table Editor」に移動
2. 各テーブルを選択
3. 右上の「RLS」トグルが**ON**になっていることを確認
4. 「View Policies」をクリックしてポリシーが作成されていることを確認

## 6. アプリケーションの起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスして、以下を確認：

1. `/signup` で新規ユーザー登録ができる
2. ログイン後、患者一覧ページが表示される
3. 新規患者登録ができる

## 7. 動作確認

### 基本機能のテスト

1. **ユーザー登録**: 新規アカウントを作成
2. **患者作成**: 「新規患者登録」ボタンから患者を登録
3. **患者詳細**: 患者をクリックして詳細ページを表示
4. **記録作成**: 「今日の記録」フォームで記録を保存
5. **ログアウト**: サイドメニューからログアウト

### 認可制御のテスト

詳細は [`docs/AUTHORIZATION_TEST.md`](./AUTHORIZATION_TEST.md) を参照してください。

## トラブルシューティング

### エラー: "認証が必要です"

**原因**: 環境変数が正しく設定されていない

**解決方法**:

1. `.env`ファイルが存在するか確認
2. `SUPABASE_URL`と`SUPABASE_KEY`が正しいか確認
3. 開発サーバーを再起動

### エラー: "Database types configured at..."

**原因**: Supabaseが型定義ファイルを探している（警告のみ）

**解決方法**:

- この警告は無視して問題ありません
- または `types/database.types.ts` を作成（オプション）

### マイグレーションエラー

**原因**: SQLに構文エラーがある、または既にテーブルが存在する

**解決方法**:

1. エラーメッセージを確認
2. Table Editorでテーブルを削除
3. マイグレーションを再実行

### 401エラーが発生する

**原因**: Supabaseとの接続に失敗している

**解決方法**:

1. `SUPABASE_URL`が正しいか確認
2. `SUPABASE_KEY`に**anon public**キーを使用しているか確認
3. Supabaseプロジェクトが一時停止していないか確認

### RLSエラーが発生する

**原因**: Row Level Securityが正しく設定されていない

**解決方法**:

1. Table EditorでRLSが有効になっているか確認
2. Policiesが作成されているか確認
3. マイグレーションを再実行

## 本番環境へのデプロイ

### 環境変数の設定

本番環境では、以下の環境変数を設定してください：

```bash
SUPABASE_URL=your-production-supabase-url
SUPABASE_KEY=your-production-anon-key
```

### セキュリティチェックリスト

- [ ] RLSが全テーブルで有効になっている
- [ ] anon keyのみを使用（service_role keyは使用しない）
- [ ] 環境変数がセキュアに管理されている
- [ ] リダイレクトURLに本番URLが追加されている
- [ ] Email確認を有効化（本番環境）
- [ ] データベースパスワードが強力

## その他のリソース

- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Row Level Security (RLS) ガイド](https://supabase.com/docs/guides/auth/row-level-security)
- [Nuxt Supabaseモジュール](https://supabase.nuxtjs.org/)

## サポート

問題が解決しない場合は、以下を確認してください：

1. Supabase Dashboardのログ（Logs & Reports）
2. ブラウザの開発者ツール（Console）
3. サーバーのターミナル出力

エラーメッセージをメモして、必要に応じてSupabaseコミュニティやドキュメントを参照してください。
