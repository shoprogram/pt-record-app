import type { PatientsResponse, UseFetchResult } from '~/types'
import { computed, type Ref } from 'vue'

export const usePatients = (searchQuery: Ref<string>): UseFetchResult<PatientsResponse> => {
  const query = computed(() => ({
    search: searchQuery.value || undefined,
  }))

  const { data, pending, error } = useFetch<PatientsResponse>('/api/patients', {
    query,
    watch: [searchQuery],
  })

  const errorMessage = computed<string | null>(() => {
    if (!error.value) return null
    return error.value instanceof Error ? error.value.message : '患者一覧の取得に失敗しました'
  })

  const normalizedData = computed<PatientsResponse | null>(() => {
    return data.value ?? null
  })

  return {
    data: normalizedData,
    error: errorMessage,
    isLoading: pending,
  }
}
