import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, watch } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import type { PatientsResponse } from '~/types'
import { usePatientsStore } from '~/stores/patients'

// useRouterをモック
const mockPush = vi.fn()
vi.stubGlobal('useRouter', () => ({
  push: mockPush,
}))

// onMountedをモック
vi.stubGlobal('onMounted', (callback: () => void) => {
  callback()
})

// watchをグローバルに公開
vi.stubGlobal('watch', watch)

// $fetchをモック
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// usePatientsStoreをグローバルに公開
vi.stubGlobal('usePatientsStore', usePatientsStore)

describe('usePatients', () => {
  const mockPatients: PatientsResponse = {
    patients: [
      {
        id: '1',
        code: 'PT-001',
        name: '患者A',
        age: 45,
        gender: '男性',
        diagnosis: '腰痛',
        lastVisitDate: '2025-01-15',
      },
      {
        id: '2',
        code: 'PT-002',
        name: '患者B',
        age: 32,
        gender: '女性',
        diagnosis: '肩こり',
        lastVisitDate: '2025-01-14',
      },
    ],
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('検索クエリが空の場合、すべての患者を取得する', async () => {
    // Arrange
    const searchQuery = ref('')
    mockFetch.mockResolvedValue(mockPatients)

    // Act
    const { usePatients } = await import('~/composables/usePatients')
    const { data, error, isLoading } = usePatients(searchQuery)

    // Assert
    await vi.waitFor(() => {
      expect(data.value).toEqual(mockPatients)
      expect(error.value).toBeNull()
      expect(isLoading.value).toBe(false)
    })
  })

  it('検索クエリで患者をフィルタリングする', async () => {
    // Arrange
    const searchQuery = ref('患者A')
    mockFetch.mockResolvedValue(mockPatients)

    // Act
    const { usePatients } = await import('~/composables/usePatients')
    const { data } = usePatients(searchQuery)

    // Assert
    await vi.waitFor(() => {
      expect(data.value?.patients).toHaveLength(1)
      expect(data.value?.patients[0]?.name).toBe('患者A')
    })
  })

  it('APIエラー時にエラーメッセージを返す', async () => {
    // Arrange
    const searchQuery = ref('')
    const apiError = new Error('ネットワークエラー')
    mockFetch.mockRejectedValue(apiError)

    // Act
    const { usePatients } = await import('~/composables/usePatients')
    const { data, error, isLoading } = usePatients(searchQuery)

    // Assert
    await vi.waitFor(() => {
      expect(data.value).toBeNull()
      expect(error.value).toBe('ネットワークエラー')
      expect(isLoading.value).toBe(false)
    })
  })

  it('ローディング中はisLoadingがtrueになる', async () => {
    // Arrange
    const searchQuery = ref('')
    let resolveFetch: (value: PatientsResponse) => void
    mockFetch.mockReturnValue(
      new Promise<PatientsResponse>((resolve) => {
        resolveFetch = resolve
      }),
    )

    // Act
    const { usePatients } = await import('~/composables/usePatients')
    const { isLoading } = usePatients(searchQuery)

    // Assert - ローディング中
    await vi.waitFor(() => {
      expect(isLoading.value).toBe(true)
    })

    // Cleanup - プロミスを解決
    resolveFetch!(mockPatients)
  })
})
