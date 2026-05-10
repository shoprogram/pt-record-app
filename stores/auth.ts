import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    currentUser: (state): User | null => state.user,
  },

  actions: {
    setUser(user: User | null) {
      this.user = user
    },

    setError(error: string | null) {
      this.error = error
    },

    async signInWithPassword(email: string, password: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          this.error = error.message
          throw error
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'ログインに失敗しました'
        this.error = errorMessage
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async signUp(email: string, password: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          this.error = error.message
          throw error
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'サインアップに失敗しました'
        this.error = errorMessage
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async signOut(): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const supabase = useSupabaseClient()
        const { error } = await supabase.auth.signOut()

        if (error) {
          this.error = error.message
          throw error
        }

        this.user = null
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'ログアウトに失敗しました'
        this.error = errorMessage
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})
