import type { PatientRecordsResponse, CreateRecordRequest } from '~/types'
import { computed } from 'vue'

export const usePatientRecords = (patientId: string) => {
  const { data, pending, error, refresh } = useFetch<PatientRecordsResponse>(`/api/patients/${patientId}/records`)

  const createRecord = async (record: CreateRecordRequest): Promise<{ success: boolean; error: string | null }> => {
    try {
      await $fetch(`/api/patients/${patientId}/records`, {
        method: 'POST',
        body: record,
      })
      await refresh()
      return { success: true, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '記録の保存に失敗しました'
      return { success: false, error: errorMessage }
    }
  }

  const errorMessage = computed<string | null>(() => {
    if (!error.value) return null
    return error.value instanceof Error ? error.value.message : '記録の取得に失敗しました'
  })

  const normalizedData = computed<PatientRecordsResponse | null>(() => {
    return data.value ?? null
  })

  return {
    data: normalizedData,
    error: errorMessage,
    isLoading: pending,
    fetchRecords: refresh,
    createRecord,
  }
}
