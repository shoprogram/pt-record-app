import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@nuxtjs/supabase', '@pinia/nuxt'],
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  i18n: {
    locales: [
      {
        code: 'ja',
        iso: 'ja-JP',
        file: 'ja.json',
      },
    ],
    langDir: 'locales/',
    defaultLocale: 'ja',
    strategy: 'no_prefix',
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/',
      exclude: ['/signup'],
      // E2Eテスト: リダイレクトを無効化
      cookieRedirect: false,
    },
  },
})
