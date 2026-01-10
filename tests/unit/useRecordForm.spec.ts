import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useRecordForm } from '~/composables/useRecordForm'
import { ROM_MAX, MMT_MAX, VAS_MAX, NRS_MAX } from '~/constants/evaluation'

describe('useRecordForm', () => {
  beforeEach(() => {
    // 日付を固定するためのモック
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('初期状態', () => {
    it('フォームが初期値で初期化される', () => {
      // Arrange
      const { form } = useRecordForm()

      // Assert
      expect(form.date).toBe('2025-01-15')
      expect(form.standardEvaluations.rom).toBeNull()
      expect(form.standardEvaluations.mmt).toBeNull()
      expect(form.standardEvaluations.vas).toBeNull()
      expect(form.standardEvaluations.nrs).toBeNull()
      expect(form.customEvaluations).toEqual([])
      expect(form.note).toBe('')
    })
  })

  describe('resetForm', () => {
    it('フォームがリセットされる', () => {
      // Arrange
      const { form, resetForm } = useRecordForm()
      form.date = '2025-01-20'
      form.standardEvaluations.rom = 90
      form.standardEvaluations.vas = 50
      form.customEvaluations.push({
        id: 'test',
        name: 'テスト評価',
        value: 100,
        unit: '点',
        direction: 'higher_is_better',
      })
      form.note = 'テストメモ'

      // Act
      resetForm()

      // Assert
      expect(form.date).toBe('2025-01-15')
      expect(form.standardEvaluations.rom).toBeNull()
      expect(form.standardEvaluations.vas).toBeNull()
      expect(form.customEvaluations).toEqual([])
      expect(form.note).toBe('')
    })
  })

  describe('addCustomEvaluation', () => {
    it('カスタム評価が追加される', () => {
      // Arrange
      const { form, addCustomEvaluation } = useRecordForm()

      // Act
      addCustomEvaluation()

      // Assert
      expect(form.customEvaluations.length).toBe(1)
      expect(form.customEvaluations[0]?.name).toBe('')
      expect(form.customEvaluations[0]?.value).toBe('')
      expect(form.customEvaluations[0]?.unit).toBe('none')
      expect(form.customEvaluations[0]?.direction).toBe('higher_is_better')
    })
  })

  describe('removeCustomEvaluation', () => {
    it('カスタム評価が削除される', () => {
      // Arrange
      const { form, addCustomEvaluation, removeCustomEvaluation } = useRecordForm()
      addCustomEvaluation()
      const customId = form.customEvaluations[0]?.id ?? ''

      // Act
      removeCustomEvaluation(customId)

      // Assert
      expect(form.customEvaluations.length).toBe(0)
    })
  })

  describe('validateForm', () => {
    it('有効な値ではバリデーションエラーが返らない', () => {
      // Arrange
      const { form, validateForm } = useRecordForm()
      form.date = '2025-01-15'
      form.standardEvaluations.rom = 90
      form.standardEvaluations.mmt = 4
      form.standardEvaluations.vas = 50
      form.standardEvaluations.nrs = 5

      // Act
      const result = validateForm()

      // Assert
      expect(result).toBeNull()
    })

    it('日付が空の場合エラーが返る', () => {
      // Arrange
      const { form, validateForm } = useRecordForm()
      form.date = ''

      // Act
      const result = validateForm()

      // Assert
      expect(result).toBe('日付は必須です')
    })

    it('ROMが範囲外の場合エラーが返る', () => {
      // Arrange
      const { form, validateForm } = useRecordForm()
      form.date = '2025-01-15'
      form.standardEvaluations.rom = ROM_MAX + 1

      // Act
      const result = validateForm()

      // Assert
      expect(result).toContain('ROMは')
    })

    it('MMTが範囲外の場合エラーが返る', () => {
      // Arrange
      const { form, validateForm } = useRecordForm()
      form.date = '2025-01-15'
      form.standardEvaluations.mmt = MMT_MAX + 1

      // Act
      const result = validateForm()

      // Assert
      expect(result).toContain('MMTは')
    })

    it('VASが範囲外の場合エラーが返る', () => {
      // Arrange
      const { form, validateForm } = useRecordForm()
      form.date = '2025-01-15'
      form.standardEvaluations.vas = VAS_MAX + 1

      // Act
      const result = validateForm()

      // Assert
      expect(result).toContain('VASは')
    })

    it('NRSが範囲外の場合エラーが返る', () => {
      // Arrange
      const { form, validateForm } = useRecordForm()
      form.date = '2025-01-15'
      form.standardEvaluations.nrs = NRS_MAX + 1

      // Act
      const result = validateForm()

      // Assert
      expect(result).toContain('NRSは')
    })

    it('カスタム評価の名前が空の場合エラーが返る', () => {
      // Arrange
      const { form, validateForm, addCustomEvaluation } = useRecordForm()
      form.date = '2025-01-15'
      addCustomEvaluation()
      form.customEvaluations[0]!.name = ''

      // Act
      const result = validateForm()

      // Assert
      expect(result).toBe('カスタム評価の評価名は必須です')
    })

    it('カスタム評価の値が空の場合エラーが返る', () => {
      // Arrange
      const { form, validateForm, addCustomEvaluation } = useRecordForm()
      form.date = '2025-01-15'
      addCustomEvaluation()
      form.customEvaluations[0]!.name = 'テスト評価'
      form.customEvaluations[0]!.value = ''

      // Act
      const result = validateForm()

      // Assert
      expect(result).toContain('スコア値は必須です')
    })
  })
})
