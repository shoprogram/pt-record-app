import { test as setup, expect } from '@playwright/test'
import fs from 'fs'

const authFile = 'playwright/.auth/user.json'

/** Supabase `/auth/v1/token?grant_type=password` の JSON 応答（ログ・セッション設定に必要な項目のみ） */
type SupabasePasswordTokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  user: { id: string }
}

setup('authenticate', async ({ page, context, request }) => {
  console.log('🔐 テスト用ユーザーで認証中...')

  const testEmail = process.env.TEST_USER_EMAIL || 'test@example.com'
  const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword123'

  console.log(`   メールアドレス: ${testEmail}`)

  // Supabase Auth APIを直接使用してトークンを取得
  const supabaseUrl = process.env.SUPABASE_URL || 'https://lgyvrzlpcrznausfdjwk.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_IVv5ltfDmK9ONwzr549XlQ_s_4fQxQO'

  console.log('   🔑 Supabase Auth APIで認証トークン取得中...')
  
  const authResponse = await request.post(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
    },
    data: {
      email: testEmail,
      password: testPassword,
    },
  })

  if (!authResponse.ok()) {
    const errorBody = await authResponse.text()
    throw new Error(
      `❌ Supabase認証に失敗しました\n` +
        `ステータス: ${authResponse.status()}\n` +
        `エラー: ${errorBody}\n\n` +
        `確認事項:\n` +
        `1. テストユーザー (${testEmail}) が存在するか\n` +
        `2. パスワードが正しいか (${testPassword.slice(0, 3)}...)\n` +
        `3. ブラウザで http://localhost:3000/login から手動ログインできるか\n` +
        `4. Supabase URL/Keyが正しいか`
    )
  }

  const authData = (await authResponse.json()) as SupabasePasswordTokenResponse
  console.log('   ✅ Supabase認証成功')
  console.log(`   👤 ユーザーID: ${authData.user.id}`)

  const accessToken = authData.access_token
  const refreshToken = authData.refresh_token
  const expiresAt = Math.floor(Date.now() / 1000) + authData.expires_in

  // LocalStorageにセッションデータを設定 + Playwrightフラグを設定
  await page.goto('/')
  
  await page.evaluate(
    ({ accessToken, refreshToken, user, expiresAt }) => {
      // E2Eテストフラグを設定（ミドルウェアをスキップするため）
      ;(window as any).__PLAYWRIGHT_TEST__ = true
      
      const session = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 3600,
        expires_at: expiresAt,
        token_type: 'bearer',
        user: user,
      }
      
      // LocalStorageにセッションを設定
      localStorage.setItem(
        'sb-lgyvrzlpcrznausfdjwk-auth-token',
        JSON.stringify(session)
      )
      
      // Supabaseクライアントのセッションも設定（重要！）
      const supabaseClient = (window as any).$nuxt?.$supabase
      if (supabaseClient && supabaseClient.auth) {
        supabaseClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })
      }
      
      console.log('✅ LocalStorageとSupabaseセッションを設定しました')
    },
    { accessToken, refreshToken, user: authData.user, expiresAt }
  )

  console.log('   🔄 E2Eテストモードで認証セッションを設定しました')

  // 少し待ってから確認（Supabaseクライアントがセッションを処理するまで）
  await page.waitForTimeout(1000)

  // Cookieも設定（念のため）
  await context.addCookies([
    {
      name: 'sb-lgyvrzlpcrznausfdjwk-auth-token',
      value: JSON.stringify([accessToken, refreshToken]),
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
      expires: expiresAt,
    },
  ])

  console.log('   🍪 認証Cookieも設定しました')

  // ページをリロードして認証状態を反映
  await page.reload()
  await page.waitForLoadState('networkidle')

  // 患者一覧ページが表示されることを確認
  console.log('   🏥 患者一覧ページの表示を確認中...')
  
  try {
    await expect(page.getByPlaceholder('患者コード、名前、診断名で検索...')).toBeVisible({ timeout: 10000 })
    console.log('✅ 認証成功 - 患者一覧ページが表示されました')
  } catch {
    const currentUrl = page.url()
    
    // デバッグ情報を収集
    const cookies = await context.cookies()
    await page.screenshot({ path: 'test-results/auth-failed.png', fullPage: true })
    
    // LocalStorageの内容を確認
    const localStorageData = await page.evaluate(() => {
      return {
        authToken: localStorage.getItem('sb-lgyvrzlpcrznausfdjwk-auth-token'),
        keys: Object.keys(localStorage),
      }
    })
    
    throw new Error(
      `❌ 認証後も患者一覧ページが表示されません\n` +
        `   現在のURL: ${currentUrl}\n\n` +
        `デバッグ情報:\n` +
        `- Cookie数: ${cookies.length}\n` +
        `- LocalStorage キー: ${localStorageData.keys.join(', ')}\n` +
        `- Auth Token設定済み: ${localStorageData.authToken ? 'はい' : 'いいえ'}\n` +
        `- スクリーンショット: test-results/auth-failed.png\n\n` +
        `次のステップ:\n` +
        `1. ブラウザで手動ログインして動作を確認\n` +
        `2. 開発者ツールでLocalStorageとCookieを確認\n` +
        `3. ミドルウェア (middleware/auth.global.ts) を確認`
    )
  }

  // 認証状態を保存（他のテストで再利用）
  if (!fs.existsSync('playwright/.auth')) {
    fs.mkdirSync('playwright/.auth', { recursive: true })
  }
  await context.storageState({ path: authFile })
  console.log('✅ 認証状態を保存しました（他のテストで再利用可能）')
})
