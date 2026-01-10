import type { Patient, UseFetchResult } from '~/types'
import { computed } from 'vue'

export const usePatient = (patientId: string): UseFetchResult<Patient> => {
  const { data, pending, error } = useFetch<Patient>(`/api/patients/${patientId}`)

  const errorMessage = computed<string | null>(() => {
    if (!error.value) return null
    return error.value instanceof Error ? error.value.message : '患者情報の取得に失敗しました'
  })

  const dataAsNull = computed<Patient | null>(() => data.value ?? null)

  return {
    data: dataAsNull,
    error: errorMessage,
    isLoading: pending,
  }
}
