import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import type { PatientsResponse } from '~/types'

// useFetchをグローバルにモック
const mockUseFetch = vi.fn()
// @ts-expect-error - グローバル変数として定義
globalThis.useFetch = (...args: unknown[]) => mockUseFetch(...args)

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
    vi.clearAllMocks()
  })

  it('検索クエリが空の場合、すべての患者を取得する', async () => {
    // Arrange
    const searchQuery = ref('')
    mockUseFetch.mockReturnValue({
      data: ref(mockPatients),
      pending: ref(false),
      error: ref(null),
    })

    // Act
    const { usePatients } = await import('~/composables/usePatients')
    const { data, error, isLoading } = usePatients(searchQuery)

    // Assert
    expect(data.value).toEqual(mockPatients)
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  it('検索クエリで患者をフィルタリングする', async () => {
    // Arrange
    const searchQuery = ref('患者A')
    const firstPatient = mockPatients.patients[0]
    if (!firstPatient) throw new Error('Test data not found')

    const filteredPatients: PatientsResponse = {
      patients: [firstPatient],
    }
    mockUseFetch.mockReturnValue({
      data: ref(filteredPatients),
      pending: ref(false),
      error: ref(null),
    })

    // Act
    const { usePatients } = await import('~/composables/usePatients')
    const { data, error, isLoading } = usePatients(searchQuery)

    // Assert
    expect(data.value?.patients).toHaveLength(1)
    expect(data.value?.patients[0]?.name).toBe('患者A')
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  it('APIエラー時にエラーメッセージを返す', async () => {
    // Arrange
    const searchQuery = ref('')
    const apiError = new Error('ネットワークエラー')
    mockUseFetch.mockReturnValue({
      data: ref(null),
      pending: ref(false),
      error: ref(apiError),
    })

    // Act
    const { usePatients } = await import('~/composables/usePatients')
    const { data, error, isLoading } = usePatients(searchQuery)

    // Assert
    expect(data.value).toBeNull()
    expect(error.value).toBe('ネットワークエラー')
    expect(isLoading.value).toBe(false)
  })

  it('ローディング中はisLoadingがtrueになる', async () => {
    // Arrange
    const searchQuery = ref('')
    mockUseFetch.mockReturnValue({
      data: ref(null),
      pending: ref(true),
      error: ref(null),
    })

    // Act
    const { usePatients } = await import('~/composables/usePatients')
    const { isLoading } = usePatients(searchQuery)

    // Assert
    expect(isLoading.value).toBe(true)
  })
})
