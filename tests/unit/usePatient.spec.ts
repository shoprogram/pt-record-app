import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import type { Patient } from '~/types'

// useFetchをグローバルにモック
const mockUseFetch = vi.fn()
// @ts-expect-error - グローバル変数として定義
globalThis.useFetch = (...args: unknown[]) => mockUseFetch(...args)

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
    vi.clearAllMocks()
  })

  it('患者IDで患者情報を取得する', async () => {
    // Arrange
    const patientId = '1'
    mockUseFetch.mockReturnValue({
      data: ref(mockPatient),
      pending: ref(false),
      error: ref(null),
    })

    // Act
    const { usePatient } = await import('~/composables/usePatient')
    const { data, error, isLoading } = usePatient(patientId)

    // Assert
    expect(data.value).toEqual(mockPatient)
    expect(error.value).toBeNull()
    expect(isLoading.value).toBe(false)
  })

  it('APIエラー時にエラーメッセージを返す', async () => {
    // Arrange
    const patientId = '1'
    const apiError = new Error('患者が見つかりません')
    mockUseFetch.mockReturnValue({
      data: ref(null),
      pending: ref(false),
      error: ref(apiError),
    })

    // Act
    const { usePatient } = await import('~/composables/usePatient')
    const { data, error, isLoading } = usePatient(patientId)

    // Assert
    expect(data.value).toBeNull()
    expect(error.value).toBe('患者が見つかりません')
    expect(isLoading.value).toBe(false)
  })

  it('ローディング中はisLoadingがtrueになる', async () => {
    // Arrange
    const patientId = '1'
    mockUseFetch.mockReturnValue({
      data: ref(null),
      pending: ref(true),
      error: ref(null),
    })

    // Act
    const { usePatient } = await import('~/composables/usePatient')
    const { isLoading } = usePatient(patientId)

    // Assert
    expect(isLoading.value).toBe(true)
  })
})
