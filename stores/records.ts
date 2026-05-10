import { defineStore } from 'pinia'
import type { PatientRecord, PatientRecordsResponse, CreateRecordRequest } from '~/types/api/patient'

interface RecordsState {
  recordsCache: Map<string, PatientRecord[]>
  loadingIds: Set<string>
  errors: Map<string, string>
  lastFetchedAt: Map<string, number>
}

export const useRecordsStore = defineStore('records', {
  state: (): RecordsState => ({
    recordsCache: new Map(),
    loadingIds: new Set(),
    errors: new Map(),
    lastFetchedAt: new Map(),
  }),

  getters: {
    getRecordsByPatientId:
      (state) =>
      (patientId: string): PatientRecord[] => {
        return state.recordsCache.get(patientId) ?? []
      },

    isLoadingRecords:
      (state) =>
      (patientId: string): boolean => {
        return state.loadingIds.has(patientId)
      },

    getErrorByPatientId:
      (state) =>
      (patientId: string): string | null => {
        return state.errors.get(patientId) ?? null
      },

    hasRecords:
      (state) =>
      (patientId: string): boolean => {
        const records = state.recordsCache.get(patientId)
        return !!records && records.length > 0
      },
  },

  actions: {
    async fetchRecords(patientId: string, forceRefresh = false): Promise<PatientRecord[]> {
      // キャッシュがある場合は再取得しない（forceRefreshでない限り）
      const cached = this.recordsCache.get(patientId)
      const lastFetched = this.lastFetchedAt.get(patientId)
      if (!forceRefresh && cached && lastFetched) {
        return cached
      }

      this.loadingIds.add(patientId)
      this.errors.delete(patientId)

      try {
        const response = await $fetch<PatientRecordsResponse>(`/api/patients/${patientId}/records`)

        this.recordsCache.set(patientId, response.records)
        this.lastFetchedAt.set(patientId, Date.now())

        return response.records
      } catch (err: unknown) {
        // Handle different error types
        let errorMessage = '記録の取得に失敗しました'

        if (err && typeof err === 'object' && 'statusCode' in err) {
          const statusCode = (err as { statusCode: number }).statusCode
          if (statusCode === 401) {
            errorMessage = '認証が必要です。ログインしてください。'
            // ログインページへのリダイレクトはcomposablesで処理
          } else if (statusCode === 403) {
            errorMessage = 'この患者の記録にアクセスする権限がありません'
          } else if (statusCode === 404) {
            errorMessage = '患者または記録が見つかりません'
          }
        } else if (err instanceof Error) {
          errorMessage = err.message
        }

        this.errors.set(patientId, errorMessage)
        throw err
      } finally {
        this.loadingIds.delete(patientId)
      }
    },

    async createRecord(patientId: string, recordData: CreateRecordRequest): Promise<void> {
      this.loadingIds.add(patientId)
      this.errors.delete(patientId)

      try {
        await $fetch(`/api/patients/${patientId}/records`, {
          method: 'POST',
          body: recordData,
        })

        // 記録を作成したら、キャッシュをリフレッシュ
        await this.fetchRecords(patientId, true)
      } catch (err: unknown) {
        // Handle different error types
        let errorMessage = '記録の保存に失敗しました'

        if (err && typeof err === 'object' && 'statusCode' in err) {
          const statusCode = (err as { statusCode: number }).statusCode
          if (statusCode === 401) {
            errorMessage = '認証が必要です'
          } else if (statusCode === 403) {
            errorMessage = 'この患者の記録を作成する権限がありません'
          } else if (statusCode === 404) {
            errorMessage = '患者が見つかりません'
          }
        } else if (err instanceof Error) {
          errorMessage = err.message
        }

        this.errors.set(patientId, errorMessage)
        throw err
      } finally {
        this.loadingIds.delete(patientId)
      }
    },

    async refresh(patientId: string): Promise<void> {
      await this.fetchRecords(patientId, true)
    },

    clearError(patientId: string) {
      this.errors.delete(patientId)
    },

    clearCache(patientId?: string) {
      if (patientId) {
        this.recordsCache.delete(patientId)
        this.lastFetchedAt.delete(patientId)
        this.errors.delete(patientId)
      } else {
        this.recordsCache.clear()
        this.lastFetchedAt.clear()
        this.errors.clear()
      }
    },
  },
})
