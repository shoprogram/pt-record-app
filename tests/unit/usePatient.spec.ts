import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { Patient } from '~/types'
import { usePatientStore } from '~/stores/patient'

// useRouterをモック
const mockPush = vi.fn()
vi.stubGlobal('useRouter', () => ({
  push: mockPush,
}))

// onMountedをモック
vi.stubGlobal('onMounted', (callback: () => void) => {
  callback()
})

// $fetchをモック
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// usePatientStoreをグローバルに公開
vi.stubGlobal('usePatientStore', usePatientStore)

describe('usePatient', () => {
  const mockPatient: Patient = {
    id: '1',
    code: 'PT-001',
    name: '患者A',
    age: 45,
    gender: '男性',
    diagnosis: '腰痛',
    startDate: '2024-12-01',
    notes: '慢性的な腰痛。デスクワークが主な原因。',
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('患者IDで患者情報を取得する', async () => {
    // Arrange
    const patientId = '1'
    mockFetch.mockResolvedValue(mockPatient)

    // Act
    const { usePatient } = await import('~/composables/usePatient')
    const { data, error, isLoading } = usePatient(patientId)

    // Assert
    await vi.waitFor(() => {
      expect(data.value).toEqual(mockPatient)
      expect(error.value).toBeNull()
      expect(isLoading.value).toBe(false)
    })
  })

  it('APIエラー時にエラーメッセージを返す', async () => {
    // Arrange
    const patientId = '1'
    const apiError = new Error('患者が見つかりません')
    mockFetch.mockRejectedValue(apiError)

    // Act
    const { usePatient } = await import('~/composables/usePatient')
    const { data, error, isLoading } = usePatient(patientId)

    // Assert
    await vi.waitFor(() => {
      expect(data.value).toBeNull()
      expect(error.value).toBe('患者が見つかりません')
      expect(isLoading.value).toBe(false)
    })
  })

  it('ローディング中はisLoadingがtrueになる', async () => {
    // Arrange
    const patientId = '1'
    let resolveFetch: (value: Patient) => void
    mockFetch.mockReturnValue(
      new Promise<Patient>((resolve) => {
        resolveFetch = resolve
      }),
    )

    // Act
    const { usePatient } = await import('~/composables/usePatient')
    const { isLoading } = usePatient(patientId)

    // Assert - ローディング中
    await vi.waitFor(() => {
      expect(isLoading.value).toBe(true)
    })

    // Cleanup - プロミスを解決
    resolveFetch!(mockPatient)
  })
})
