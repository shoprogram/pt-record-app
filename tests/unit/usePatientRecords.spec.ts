import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import type { PatientRecordsResponse, CreateRecordRequest } from '~/types'

// useFetchと$fetchをグローバルにモック
const mockUseFetch = vi.fn()
const mockFetch = vi.fn()
// @ts-expect-error - グローバル変数として定義
globalThis.useFetch = (...args: unknown[]) => mockUseFetch(...args)
// @ts-expect-error - グローバル変数として定義
globalThis.$fetch = (...args: unknown[]) => mockFetch(...args)

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
    vi.clearAllMocks()
  })

  it('患者IDで記録一覧を取得する', async () => {
    // Arrange
    const patientId = '1'
    const refreshMock = vi.fn()
    mockUseFetch.mockReturnValue({
      data: ref(mockRecords),
      pending: ref(false),
      error: ref(null),
      refresh: refreshMock,
    })

    // Act
    const { usePatientRecords } = await import('~/composables/usePatientRecords')
    const { data, error, isLoading } = usePatientRecords(patientId)

    // Assert
    expect(data.value).toEqual(mockRecords)
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  it('記録を保存できる', async () => {
    // Arrange
    const patientId = '1'
    const refreshMock = vi.fn()
    mockUseFetch.mockReturnValue({
      data: ref(mockRecords),
      pending: ref(false),
      error: ref(null),
      refresh: refreshMock,
    })
    mockFetch.mockResolvedValue({ success: true })

    const newRecord: CreateRecordRequest = {
      date: '2025-01-16',
      sessionId: 'session-1',
      standardEvaluations: {
        vas: 50,
        rom: 90,
        mmt: 4,
      },
      customEvaluations: [],
      note: '状態が良好',
    }

    // Act
    const { usePatientRecords } = await import('~/composables/usePatientRecords')
    const { createRecord } = usePatientRecords(patientId)
    const result = await createRecord(newRecord)

    // Assert
    expect(result.success).toBe(true)
    expect(result.error).toBeNull()
    expect(mockFetch).toHaveBeenCalledWith(`/api/patients/${patientId}/records`, {
      method: 'POST',
      body: newRecord,
    })
    expect(refreshMock).toHaveBeenCalled()
  })

  it('記録保存時にエラーが発生した場合エラーを返す', async () => {
    // Arrange
    const patientId = '1'
    const refreshMock = vi.fn()
    mockUseFetch.mockReturnValue({
      data: ref(mockRecords),
      pending: ref(false),
      error: ref(null),
      refresh: refreshMock,
    })
    const apiError = new Error('保存に失敗しました')
    mockFetch.mockRejectedValue(apiError)

    const newRecord: CreateRecordRequest = {
      date: '2025-01-16',
      sessionId: 'session-1',
      standardEvaluations: {
        vas: 50,
        rom: 90,
        mmt: 4,
      },
      customEvaluations: [],
    }

    // Act
    const { usePatientRecords } = await import('~/composables/usePatientRecords')
    const { createRecord } = usePatientRecords(patientId)
    const result = await createRecord(newRecord)

    // Assert
    expect(result.success).toBe(false)
    expect(result.error).toBe('保存に失敗しました')
    expect(refreshMock).not.toHaveBeenCalled()
  })

  it('APIエラー時にエラーメッセージを返す', async () => {
    // Arrange
    const patientId = '1'
    const apiError = new Error('記録の取得に失敗しました')
    mockUseFetch.mockReturnValue({
      data: ref(null),
      pending: ref(false),
      error: ref(apiError),
      refresh: vi.fn(),
    })

    // Act
    const { usePatientRecords } = await import('~/composables/usePatientRecords')
    const { data, error, isLoading } = usePatientRecords(patientId)

    // Assert
    expect(data.value).toBeNull()
    expect(error.value).toBe('記録の取得に失敗しました')
    expect(isLoading.value).toBe(false)
  })
})
