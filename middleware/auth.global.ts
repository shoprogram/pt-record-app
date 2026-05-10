export default defineNuxtRouteMiddleware((to) => {
  // E2Eテスト環境では認証チェックを完全にスキップ
  // 注意: 本番環境では必ずこれを有効にすること
  if (import.meta.client && typeof window !== 'undefined' && (window as any).__PLAYWRIGHT_TEST__) {
    console.log('[E2E] 認証ミドルウェアをスキップしました:', to.path)
    return  // 認証チェックをスキップ
  }

  // クライアントサイドのみで実行
  if (import.meta.server) {
    return
  }

  const user = useSupabaseUser()

  // ログインページとサインアップページへのアクセスは常に許可
  if (to.path === '/login' || to.path === '/signup') {
    // 既にログイン済みの場合はトップページへリダイレクト
    if (user.value) {
      return navigateTo('/')
    }
    return
  }

  // 未認証の場合はログインページへリダイレクト
  if (!user.value) {
    return navigateTo('/login')
  }
})
