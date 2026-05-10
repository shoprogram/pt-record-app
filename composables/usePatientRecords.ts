import type { PatientRecordsResponse, CreateRecordRequest } from '~/types'
import { computed } from 'vue'

export const usePatientRecords = (patientId: string) => {
  const router = useRouter()
  const recordsStore = useRecordsStore()

  // 記録データを取得
  onMounted(async () => {
    try {
      await recordsStore.fetchRecords(patientId)
    } catch (err) {
      // 401エラーの場合はログインページへリダイレクト
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const statusCode = (err as { statusCode: number }).statusCode
        if (statusCode === 401) {
          await router.push('/login')
        }
      }
    }
  })

  const createRecord = async (record: CreateRecordRequest): Promise<{ success: boolean; error: string | null }> => {
    try {
      await recordsStore.createRecord(patientId, record)
      return { success: true, error: null }
    } catch (err: unknown) {
      // Handle different error types
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const statusCode = (err as { statusCode: number }).statusCode
        if (statusCode === 401) {
          await router.push('/login')
          return { success: false, error: '認証が必要です' }
        } else if (statusCode === 403) {
          return { success: false, error: 'この患者の記録を作成する権限がありません' }
        } else if (statusCode === 404) {
          return { success: false, error: '患者が見つかりません' }
        }
      }

      const errorMessage = err instanceof Error ? err.message : '記録の保存に失敗しました'
      return { success: false, error: errorMessage }
    }
  }

  const fetchRecords = async () => {
    try {
      await recordsStore.refresh(patientId)
    } catch (err) {
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const statusCode = (err as { statusCode: number }).statusCode
        if (statusCode === 401) {
          await router.push('/login')
        }
      }
    }
  }

  const normalizedData = computed<PatientRecordsResponse | null>(() => {
    const records = recordsStore.getRecordsByPatientId(patientId)
    return records.length > 0 || recordsStore.hasRecords(patientId) ? { records } : null
  })

  const errorMessage = computed<string | null>(() => {
    return recordsStore.getErrorByPatientId(patientId)
  })

  const isLoading = computed(() => {
    return recordsStore.isLoadingRecords(patientId)
  })

  return {
    data: normalizedData,
    error: errorMessage,
    isLoading,
    fetchRecords,
    createRecord,
  }
}
