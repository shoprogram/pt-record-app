# E2Eテスト実行ガイド

## 前提条件

E2Eテストを実行する前に、テスト用のユーザーアカウントとデータをSupabaseに準備する必要があります。

## テストユーザーの作成

### 1. アプリケーションを起動

```bash
npm run dev
```

### 2. ブラウザで新規ユーザーを作成

1. `http://localhost:3000/signup` にアクセス
2. 以下の情報でユーザーを作成：
   - メールアドレス: `test@example.com`
   - パスワード: `testpassword123`

または、環境変数で別の認証情報を指定することもできます：

```bash
export TEST_USER_EMAIL="your-test@example.com"
export TEST_USER_PASSWORD="your-test-password"
```

### 3. テストデータの準備

ログイン後、以下のテストデータを作成してください：

#### 患者データ（5人）

| 患者コード | 名前   | 年齢 | 性別 | 診断名     |
|----------|-------|-----|------|-----------|
| PT-001   | 患者A  | 65  | 男性 | 腰椎椎間板ヘルニア |
| PT-002   | 患者B  | 55  | 女性 | 変形性膝関節症 |
| PT-003   | 患者C  | 70  | 男性 | 脳梗塞後遺症 |
| PT-004   | 患者D  | 60  | 女性 | 腰部脊柱管狭窄症 |
| PT-005   | 患者E  | 75  | 男性 | 大腿骨頸部骨折 |

**注意**: テストでは患者ID=1にアクセスするため、最初に作成した患者のIDが1であることを確認してください。

## テストの実行

### すべてのテストを実行

```bash
npm run test:e2e
```

### UIモードで実行（デバッグに便利）

```bash
npm run test:e2e:ui
```

### 特定のテストファイルのみ実行

```bash
npx playwright test tests/e2e/patient-flow.spec.ts
```

## トラブルシューティング

### 認証エラーが発生する場合

1. `playwright/.auth/user.json` を削除
2. テストユーザーでログインできることを手動で確認
3. テストを再実行（セットアップが自動で実行されます）

### 患者が見つからないエラー

1. データベースにテストデータが存在するか確認
2. 患者一覧画面で5人の患者が表示されることを確認
3. 最初の患者のIDが1であることを確認（Supabase Dashboardで確認可能）

### タイムアウトエラー

1. アプリケーションが正常に起動しているか確認
2. `http://localhost:3000` にアクセスできるか確認
3. ネットワークが遅い場合は、`playwright.config.ts`のタイムアウト設定を増やす

## CI/CD環境での実行

CI環境では、以下の環境変数を設定してください：

```bash
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
```

また、テストデータはマイグレーションまたはシードスクリプトで自動作成することを推奨します。
