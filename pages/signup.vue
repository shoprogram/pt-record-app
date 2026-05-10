<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="w-full max-w-md space-y-8">
      <div class="rounded-2xl bg-white p-8 shadow-xl">
        <!-- ヘッダー -->
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-3xl font-bold text-gray-900">
            {{ $t('signup.title') }}
          </h1>
          <p class="text-gray-600">
            {{ $t('signup.subtitle') }}
          </p>
        </div>

        <!-- サインアップフォーム -->
        <form @submit.prevent="handleSignup" class="space-y-6">
          <!-- メールアドレス -->
          <div>
            <label for="email" class="mb-2 block text-sm font-medium text-gray-700">
              {{ $t('signup.email') }}
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              :placeholder="$t('signup.emailPlaceholder')"
            />
          </div>

          <!-- パスワード -->
          <div>
            <label for="password" class="mb-2 block text-sm font-medium text-gray-700">
              {{ $t('signup.password') }}
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              :placeholder="$t('signup.passwordPlaceholder')"
            />
          </div>

          <!-- パスワード確認 -->
          <div>
            <label for="confirmPassword" class="mb-2 block text-sm font-medium text-gray-700">
              {{ $t('signup.confirmPassword') }}
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              :placeholder="$t('signup.confirmPasswordPlaceholder')"
            />
          </div>

          <!-- エラーメッセージ -->
          <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-4">
            <div class="flex items-start">
              <svg class="mr-2 mt-0.5 h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <p class="text-sm font-medium text-red-800">{{ $t('signup.error') }}</p>
                <p class="mt-1 text-sm text-red-600">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- サインアップボタン -->
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg v-if="loading" class="-ml-1 mr-3 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span v-if="loading">{{ $t('signup.signingUp') }}</span>
            <span v-else>{{ $t('signup.signupButton') }}</span>
          </button>
        </form>

        <!-- ログインリンク -->
        <div class="mt-6 text-center">
          <span class="text-sm text-gray-600">{{ $t('signup.hasAccount') }}</span>
          <NuxtLink to="/login" class="ml-1 text-sm font-medium text-indigo-600 hover:text-indigo-500">
            {{ $t('signup.loginLink') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: false,
  })

  const { signUp } = useAuth()
  const router = useRouter()
  const { t: $t } = useI18n()

  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const error = ref('')

  const handleSignup = async () => {
    error.value = ''

    // パスワード一致チェック
    if (password.value !== confirmPassword.value) {
      error.value = $t('signup.passwordMismatch')
      return
    }

    loading.value = true

    try {
      await signUp(email.value, password.value)
      // サインアップ成功後、自動的にログインされているので患者一覧ページへリダイレクト
      await router.push('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Signup error:', e)
      error.value = e.message || $t('signup.error')
    } finally {
      loading.value = false
    }
  }
</script>
