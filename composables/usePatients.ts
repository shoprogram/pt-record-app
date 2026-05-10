import type { PatientsResponse, UseFetchResult } from '~/types'
import { computed, type Ref } from 'vue'

export const usePatients = (searchQuery: Ref<string>): UseFetchResult<PatientsResponse> => {
  const router = useRouter()
  const patientsStore = usePatientsStore()

  // 検索クエリをstoreに同期
  watch(
    searchQuery,
    (newQuery) => {
      patientsStore.setSearchQuery(newQuery)
    },
    { immediate: true },
  )

  // 患者データを取得
  onMounted(async () => {
    try {
      await patientsStore.fetchPatients()
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

  // 検索クエリが変更されたら再取得
  watch(searchQuery, async () => {
    try {
      await patientsStore.fetchPatients(true)
    } catch (err) {
      // エラーハンドリングはstoreで処理済み
      if (err && typeof err === 'object' && 'statusCode' in err) {
        const statusCode = (err as { statusCode: number }).statusCode
        if (statusCode === 401) {
          await router.push('/login')
        }
      }
    }
  })

  const normalizedData = computed<PatientsResponse | null>(() => {
    const patients = patientsStore.filteredPatients
    return patients.length > 0 || patientsStore.hasData ? { patients } : null
  })

  const errorMessage = computed<string | null>(() => {
    return patientsStore.error
  })

  const isLoading = computed(() => {
    return patientsStore.isLoading
  })

  return {
    data: normalizedData,
    error: errorMessage,
    isLoading,
  }
}
