import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const authStore = useAuthStore()
  const user = useSupabaseUser()

  // Supabaseのユーザー状態をstoreに同期
  watch(
    user,
    (newUser) => {
      authStore.setUser(newUser as User | null)
    },
    { immediate: true },
  )

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const error = computed(() => authStore.error)
  const isLoading = computed(() => authStore.isLoading)

  const signInWithPassword = async (email: string, password: string) => {
    await authStore.signInWithPassword(email, password)
  }

  const signUp = async (email: string, password: string) => {
    await authStore.signUp(email, password)
  }

  const signOut = async () => {
    await authStore.signOut()
  }

  const clearError = () => {
    authStore.clearError()
  }

  return {
    user: computed(() => authStore.currentUser),
    isAuthenticated,
    error,
    isLoading,
    signInWithPassword,
    signUp,
    signOut,
    clearError,
  }
}
