import { defineStore } from 'pinia'
import type { Patient, PatientsResponse, CreatePatientRequest } from '~/types/api/patient'

interface PatientsState {
  patients: Patient[]
  searchQuery: string
  isLoading: boolean
  error: string | null
  lastFetchedAt: number | null
}

export const usePatientsStore = defineStore('patients', {
  state: (): PatientsState => ({
    patients: [],
    searchQuery: '',
    isLoading: false,
    error: null,
    lastFetchedAt: null,
  }),

  getters: {
    filteredPatients: (state): Patient[] => {
      if (!state.searchQuery) {
        return state.patients
      }

      const query = state.searchQuery.toLowerCase()
      return state.patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.code.toLowerCase().includes(query) ||
          patient.diagnosis.toLowerCase().includes(query),
      )
    },

    hasData: (state): boolean => state.patients.length > 0,
  },

  actions: {
    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    async fetchPatients(forceRefresh = false): Promise<void> {
      // キャッシュがある場合は再取得しない（forceRefreshでない限り）
      if (!forceRefresh && this.patients.length > 0 && this.lastFetchedAt) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const query = this.searchQuery ? { search: this.searchQuery } : {}
        const response = await $fetch<PatientsResponse>('/api/patients', {
          query,
        })

        this.patients = response.patients
        this.lastFetchedAt = Date.now()
      } catch (err: unknown) {
        // Handle different error types
        if (err && typeof err === 'object' && 'statusCode' in err) {
          const statusCode = (err as { statusCode: number }).statusCode
          if (statusCode === 401) {
            this.error = '認証が必要です。ログインしてください。'
            // ログインページへのリダイレクトはcomposablesで処理
            throw err
          } else if (statusCode === 403) {
            this.error = 'アクセス権限がありません'
          } else if (statusCode === 404) {
            this.error = 'データが見つかりません'
          } else {
            this.error = '患者一覧の取得に失敗しました'
          }
        } else {
          const errorMessage = err instanceof Error ? err.message : '患者一覧の取得に失敗しました'
          this.error = errorMessage
        }
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createPatient(patientData: CreatePatientRequest): Promise<Patient> {
      this.isLoading = true
      this.error = null

      try {
        const newPatient = await $fetch<Patient>('/api/patients', {
          method: 'POST',
          body: patientData,
        })

        // 新しい患者をリストの先頭に追加
        this.patients.unshift(newPatient)
        return newPatient
      } catch (err: unknown) {
        // Handle different error types
        if (err && typeof err === 'object' && 'statusCode' in err) {
          const statusCode = (err as { statusCode: number }).statusCode
          if (statusCode === 401) {
            this.error = '認証が必要です'
            throw err
          } else if (statusCode === 403) {
            this.error = '患者を作成する権限がありません'
          } else if (statusCode === 409) {
            this.error = 'この患者コードは既に使用されています'
          } else {
            this.error = '患者の作成に失敗しました'
          }
        } else {
          const errorMessage = err instanceof Error ? err.message : '患者の作成に失敗しました'
          this.error = errorMessage
        }
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async refresh(): Promise<void> {
      await this.fetchPatients(true)
    },

    clearError() {
      this.error = null
    },

    clearCache() {
      this.patients = []
      this.lastFetchedAt = null
    },
  },
})
