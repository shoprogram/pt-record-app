import type { Patient, UseFetchResult } from '~/types'
import { computed } from 'vue'

export const usePatient = (patientId: string): UseFetchResult<Patient> => {
  const router = useRouter()
  const patientStore = usePatientStore()

  // 患者データを取得
  onMounted(async () => {
    try {
      await patientStore.fetchPatient(patientId)
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

  const dataAsNull = computed<Patient | null>(() => {
    return patientStore.getPatientById(patientId) ?? null
  })

  const errorMessage = computed<string | null>(() => {
    return patientStore.getErrorById(patientId)
  })

  const isLoading = computed(() => {
    return patientStore.isLoadingPatient(patientId)
  })

  return {
    data: dataAsNull,
    error: errorMessage,
    isLoading,
  }
}
