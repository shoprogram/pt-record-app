<template>
  <div class="flex min-h-screen bg-bg-light">
    <!-- サイドメニュー -->
    <aside class="w-64 border-r border-border-light bg-white shadow-sm">
      <div class="p-6">
        <h1 class="mb-8 text-xl font-bold text-text-primary">PT記録アプリ</h1>
        <nav class="space-y-2">
          <NuxtLink
            to="/"
            class="block rounded-lg px-4 py-2 text-text-secondary transition-colors hover:bg-blue-50 hover:text-primary"
            active-class="bg-blue-50 text-primary font-medium"
          >
            患者一覧
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- メインコンテンツエリア -->
    <main class="flex flex-1 flex-col">
      <!-- ヘッダー -->
      <header class="flex items-center justify-between border-b border-border-light bg-white px-8 py-4">
        <h2 class="text-2xl font-semibold text-text-primary">
          {{ pageTitle }}
        </h2>
        <div>
          <slot name="header-actions" />
        </div>
      </header>

      <!-- コンテンツ -->
      <div class="flex-1 p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()

  const pageTitle = computed(() => {
    if (route.path === '/') {
      return '患者一覧'
    } else if (route.path.startsWith('/patients/')) {
      return '患者詳細'
    }
    return 'PT記録アプリ'
  })
</script>
