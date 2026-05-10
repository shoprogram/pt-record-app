# E2Eテスト失敗の原因と解決方法

## 問題の分析結果

### 修正済みの問題 ✅
1. **認証セットアップの欠如** → 修正済み（auth.setup.ts作成）
2. **フォーム入力の問題** → 修正済み（Vueのv-modelを正しくトリガー）

### 現在の問題 ❌

スクリーンショットから確認できた内容：
- ✅ ログインフォームが正しく表示されている
- ✅ メールアドレス(`test@example.com`)が正しく入力されている
- ✅ パスワード(`testpassword123`)が正しく入力されている
- ❌ ログインボタンをクリックしても、トップページ(`/`)にリダイレクトされない
- ❌ ログインページ(`/login`)に留まっている

**結論: テストユーザーがSupabaseに存在しないか、パスワードが一致していません。**

## 解決方法

### 方法1: 新しいテスト用ユーザーを作成する（推奨）

1. ブラウザで http://localhost:3000/signup にアクセス
2. 以下の情報でユーザー登録：
   ```
   メールアドレス: test@example.com
   パスワード: testpassword123
   ```
3. 登録完了後、ログアウト
4. テストを再実行：
   ```bash
   npm run test:e2e
   ```

### 方法2: 既存のユーザーでテストする

既に別のテストユーザーが存在する場合、環境変数で指定：

```bash
# ターミナルで実行
export TEST_USER_EMAIL="existing-user@example.com"
export TEST_USER_PASSWORD="existing-password"
npm run test:e2e
```

または、`.env.test`ファイルを作成：

```bash
# .env.test
TEST_USER_EMAIL=existing-user@example.com
TEST_USER_PASSWORD=existing-password
```

### 方法3: 手動ログインでテストする

テストを実行する前に、指定のメールアドレスとパスワードで手動ログインできることを確認：

1. http://localhost:3000/login にアクセス
2. `test@example.com` / `testpassword123` でログインを試す
3. ログインできない場合：
   - ユーザーが存在しない → 方法1で作成
   - パスワードが違う → Supabaseダッシュボードでリセット

### Supabaseダッシュボードで確認

1. [Supabase Dashboard](https://app.supabase.com) にアクセス
2. プロジェクトを選択
3. 「Authentication」→「Users」
4. `test@example.com` というユーザーが存在するか確認
5. 存在しない場合は、手動で作成するか、方法1を実行

## テストデータの準備

テストユーザーでログイン後、以下の5人の患者データを作成してください：

| 患者コード | 名前   | 年齢 | 性別 | 診断名              |
|----------|-------|-----|------|-------------------|
| PT-001   | 患者A  | 65  | 男性 | 腰椎椎間板ヘルニア    |
| PT-002   | 患者B  | 55  | 女性 | 変形性膝関節症       |
| PT-003   | 患者C  | 70  | 男性 | 脳梗塞後遺症         |
| PT-004   | 患者D  | 60  | 女性 | 腰部脊柱管狭窄症     |
| PT-005   | 患者E  | 75  | 男性 | 大腿骨頸部骨折       |

**注意**: テストでは患者ID=1にアクセスするため、最初に作成した患者のIDが1であることを確認してください。

## トラブルシューティング

### ログインが成功しない場合

1. **手動ログインを試す**
   ```bash
   # ブラウザで http://localhost:3000/login にアクセス
   # test@example.com / testpassword123 でログイン
   ```

2. **Supabaseの接続を確認**
   ```bash
   # .envファイルを確認
   cat .env | grep SUPABASE
   ```

3. **デバッグ情報を確認**
   ```bash
   # スクリーンショットを確認
   open test-results/login-before-click.png
   open test-results/login-after-click.png
   
   # HTMLを確認
   open test-results/login-page.html
   ```

### エラーメッセージが表示される場合

ログイン画面でエラーメッセージが表示される場合：
- "Invalid login credentials" → パスワードが間違っている
- "Email not confirmed" → メール確認が必要（開発環境では無効化推奨）
- その他のエラー → Supabaseの設定を確認

## 次のステップ

1. ✅ テストユーザーを作成
2. ✅ 5人の患者データを作成  
3. ✅ テストを実行: `npm run test:e2e`
4. ✅ すべてのテストがパスすることを確認

## 参考資料

- [tests/e2e/README.md](../tests/e2e/README.md) - E2Eテスト実行ガイド
- [docs/SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabaseセットアップガイド
- [Playwright Documentation](https://playwright.dev/) - Playwrightの公式ドキュメント
