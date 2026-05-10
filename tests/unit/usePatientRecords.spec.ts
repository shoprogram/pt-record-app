import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { PatientRecordsResponse, CreateRecordRequest } from '~/types'
import { useRecordsStore } from '~/stores/records'

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

// useRecordsStoreをグローバルに公開
vi.stubGlobal('useRecordsStore', useRecordsStore)

describe('usePatientRecords', () => {
  const mockRecords: PatientRecordsResponse = {
    records: [
      {
        id: 'r1',
        patientId: '1',
        date: '2025-01-15',
        sessionId: 'session-1',
        standardEvaluations: {
          vas: 60,
          rom: 85,
          mmt: 4,
        },
        customEvaluations: [],
        note: '可動域が改善してきている。',
      },
      {
        id: 'r2',
        patientId: '1',
        date: '2025-01-10',
        sessionId: 'session-1',
        standardEvaluations: {
          vas: 70,
          rom: 80,
          mmt: 3,
        },
        customEvaluations: [],
        note: '痛みがやや強い。',
      },
    ],
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('患者IDで記録一覧を取得する', async () => {
    // Arrange
    const patientId = '1'
    mockFetch.mockResolvedValue(mockRecords)

    // Act
    const { usePatientRecords } = await import('~/composables/usePatientRecords')
    const { data, error, isLoading } = usePatientRecords(patientId)

    // Assert
    await vi.waitFor(() => {
      expect(data.value).toEqual(mockRecords)
      expect(error.value).toBeNull()
      expect(isLoading.value).toBe(false)
    })
  })

  it('記録を保存できる', async () => {
    // Arrange
    const patientId = '1'
    mockFetch.mockResolvedValue(mockRecords)

    const newRecord: CreateRecordRequest = {
      date: '2025-01-16',
      sessionId: 'session-1',
      standardEvaluations: {
        vas: 50,
        rom: 90,
        mmt: 5,
      },
      customEvaluations: [],
      note: 'さらに改善。',
    }

    // Act
    const { usePatientRecords } = await import('~/composables/usePatientRecords')
    const { createRecord } = usePatientRecords(patientId)

    // Assert
    await vi.waitFor(async () => {
      const result = await createRecord(newRecord)
      expect(result.success).toBe(true)
      expect(result.error).toBeNull()
    })
  })

  it('記録保存時にエラーが発生した場合エラーを返す', async () => {
    // Arrange
    const patientId = '1'
    mockFetch.mockResolvedValueOnce({ records: [] })
    mockFetch.mockRejectedValueOnce(new Error('保存に失敗しました'))

    const recordData: CreateRecordRequest = {
      date: '2025-01-16',
      sessionId: 'session-1',
      standardEvaluations: {
        vas: 50,
      },
      customEvaluations: [],
      note: 'テスト記録',
    }

    // Act
    const { usePatientRecords } = await import('~/composables/usePatientRecords')
    const { createRecord } = usePatientRecords(patientId)

    // Assert
    const result = await createRecord(recordData)
    expect(result.success).toBe(false)
    expect(result.error).toBe('保存に失敗しました')
  })

  it('APIエラー時にエラーメッセージを返す', async () => {
    // Arrange
    const patientId = '1'
    const apiError = new Error('記録が見つかりません')
    mockFetch.mockRejectedValue(apiError)

    // Act
    const { usePatientRecords } = await import('~/composables/usePatientRecords')
    const { data, error, isLoading } = usePatientRecords(patientId)

    // Assert
    await vi.waitFor(() => {
      expect(data.value).toBeNull()
      expect(error.value).toBe('記録が見つかりません')
      expect(isLoading.value).toBe(false)
    })
  })
})
