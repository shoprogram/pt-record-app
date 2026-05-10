import { defineStore } from 'pinia'
import type { Patient } from '~/types/api/patient'

interface PatientState {
  patientsCache: Map<string, Patient>
  loadingIds: Set<string>
  errors: Map<string, string>
  lastFetchedAt: Map<string, number>
}

export const usePatientStore = defineStore('patient', {
  state: (): PatientState => ({
    patientsCache: new Map(),
    loadingIds: new Set(),
    errors: new Map(),
    lastFetchedAt: new Map(),
  }),

  getters: {
    getPatientById:
      (state) =>
      (id: string): Patient | undefined => {
        return state.patientsCache.get(id)
      },

    isLoadingPatient:
      (state) =>
      (id: string): boolean => {
        return state.loadingIds.has(id)
      },

    getErrorById:
      (state) =>
      (id: string): string | null => {
        return state.errors.get(id) ?? null
      },
  },

  actions: {
    async fetchPatient(id: string, forceRefresh = false): Promise<Patient> {
      // キャッシュがある場合は再取得しない（forceRefreshでない限り）
      const cached = this.patientsCache.get(id)
      const lastFetched = this.lastFetchedAt.get(id)
      if (!forceRefresh && cached && lastFetched) {
        return cached
      }

      this.loadingIds.add(id)
      this.errors.delete(id)

      try {
        const patient = await $fetch<Patient>(`/api/patients/${id}`)

        this.patientsCache.set(id, patient)
        this.lastFetchedAt.set(id, Date.now())

        return patient
      } catch (err: unknown) {
        // Handle different error types
        let errorMessage = '患者情報の取得に失敗しました'

        if (err && typeof err === 'object' && 'statusCode' in err) {
          const statusCode = (err as { statusCode: number }).statusCode
          if (statusCode === 401) {
            errorMessage = '認証が必要です。ログインしてください。'
            // ログインページへのリダイレクトはcomposablesで処理
          } else if (statusCode === 403) {
            errorMessage = 'この患者にアクセスする権限がありません'
          } else if (statusCode === 404) {
            errorMessage = '患者が見つかりません'
          }
        } else if (err instanceof Error) {
          errorMessage = err.message
        }

        this.errors.set(id, errorMessage)
        throw err
      } finally {
        this.loadingIds.delete(id)
      }
    },

    async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
      this.loadingIds.add(id)
      this.errors.delete(id)

      try {
        const updatedPatient = await $fetch<Patient>(`/api/patients/${id}`, {
          method: 'PATCH',
          body: updates,
        })

        // キャッシュを更新
        this.patientsCache.set(id, updatedPatient)
        this.lastFetchedAt.set(id, Date.now())

        return updatedPatient
      } catch (err: unknown) {
        let errorMessage = '患者情報の更新に失敗しました'

        if (err && typeof err === 'object' && 'statusCode' in err) {
          const statusCode = (err as { statusCode: number }).statusCode
          if (statusCode === 401) {
            errorMessage = '認証が必要です'
          } else if (statusCode === 403) {
            errorMessage = 'この患者を更新する権限がありません'
          } else if (statusCode === 404) {
            errorMessage = '患者が見つかりません'
          }
        } else if (err instanceof Error) {
          errorMessage = err.message
        }

        this.errors.set(id, errorMessage)
        throw err
      } finally {
        this.loadingIds.delete(id)
      }
    },

    async refresh(id: string): Promise<void> {
      await this.fetchPatient(id, true)
    },

    clearError(id: string) {
      this.errors.delete(id)
    },

    clearCache(id?: string) {
      if (id) {
        this.patientsCache.delete(id)
        this.lastFetchedAt.delete(id)
        this.errors.delete(id)
      } else {
        this.patientsCache.clear()
        this.lastFetchedAt.clear()
        this.errors.clear()
      }
    },
  },
})
