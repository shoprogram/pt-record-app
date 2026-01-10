import type { CreateRecordRequest, CustomEvaluation } from '~/types'
import { reactive } from 'vue'
import {
  ROM_MIN,
  ROM_MAX,
  MMT_MIN,
  MMT_MAX,
  VAS_MIN,
  VAS_MAX,
  NRS_MIN,
  NRS_MAX,
  TUG_MIN,
  TUG_MAX,
  TEN_METER_WALK_MIN,
  TEN_METER_WALK_MAX,
  SIX_MINUTE_WALK_MIN,
  SIX_MINUTE_WALK_MAX,
  BARTHEL_INDEX_MIN,
  BARTHEL_INDEX_MAX,
  BERG_BALANCE_SCALE_MIN,
  BERG_BALANCE_SCALE_MAX,
} from '~/constants/evaluation'

export const useRecordForm = () => {
  const form = reactive<CreateRecordRequest>({
    date: new Date().toISOString().split('T')[0]!,
    sessionId: undefined,
    standardEvaluations: {
      rom: null,
      mmt: null,
      vas: null,
      nrs: null,
      tug: null,
      tenMeterWalk: null,
      sixMinuteWalk: null,
      barthelIndex: null,
      bergBalanceScale: null,
    },
    customEvaluations: [],
    note: '',
  })

  const resetForm = () => {
    form.date = new Date().toISOString().split('T')[0]!
    form.sessionId = undefined
    form.standardEvaluations = {
      rom: null,
      mmt: null,
      vas: null,
      nrs: null,
      tug: null,
      tenMeterWalk: null,
      sixMinuteWalk: null,
      barthelIndex: null,
      bergBalanceScale: null,
    }
    form.customEvaluations = []
    form.note = ''
  }

  const addCustomEvaluation = () => {
    const newCustom: CustomEvaluation = {
      id: `custom-${Date.now()}`,
      name: '',
      value: '',
      unit: 'none',
      direction: 'higher_is_better',
    }
    form.customEvaluations.push(newCustom)
  }

  const removeCustomEvaluation = (id: string) => {
    const index = form.customEvaluations.findIndex((e) => e.id === id)
    if (index !== -1) {
      form.customEvaluations.splice(index, 1)
    }
  }

  const validateForm = (): string | null => {
    if (!form.date) {
      return '日付は必須です'
    }

    // 標準評価のバリデーション
    const std = form.standardEvaluations
    if (std.rom !== null && std.rom !== undefined && (std.rom < ROM_MIN || std.rom > ROM_MAX)) {
      return `ROMは${ROM_MIN}から${ROM_MAX}の間で入力してください`
    }
    if (std.mmt !== null && std.mmt !== undefined && (std.mmt < MMT_MIN || std.mmt > MMT_MAX)) {
      return `MMTは${MMT_MIN}から${MMT_MAX}の間で入力してください`
    }
    if (std.vas !== null && std.vas !== undefined && (std.vas < VAS_MIN || std.vas > VAS_MAX)) {
      return `VASは${VAS_MIN}から${VAS_MAX}の間で入力してください`
    }
    if (std.nrs !== null && std.nrs !== undefined && (std.nrs < NRS_MIN || std.nrs > NRS_MAX)) {
      return `NRSは${NRS_MIN}から${NRS_MAX}の間で入力してください`
    }
    if (std.tug !== null && std.tug !== undefined && (std.tug < TUG_MIN || std.tug > TUG_MAX)) {
      return `TUGは${TUG_MIN}から${TUG_MAX}の間で入力してください`
    }
    if (
      std.tenMeterWalk !== null &&
      std.tenMeterWalk !== undefined &&
      (std.tenMeterWalk < TEN_METER_WALK_MIN || std.tenMeterWalk > TEN_METER_WALK_MAX)
    ) {
      return `10m歩行は${TEN_METER_WALK_MIN}から${TEN_METER_WALK_MAX}の間で入力してください`
    }
    if (
      std.sixMinuteWalk !== null &&
      std.sixMinuteWalk !== undefined &&
      (std.sixMinuteWalk < SIX_MINUTE_WALK_MIN || std.sixMinuteWalk > SIX_MINUTE_WALK_MAX)
    ) {
      return `6分間歩行は${SIX_MINUTE_WALK_MIN}から${SIX_MINUTE_WALK_MAX}の間で入力してください`
    }
    if (
      std.barthelIndex !== null &&
      std.barthelIndex !== undefined &&
      (std.barthelIndex < BARTHEL_INDEX_MIN || std.barthelIndex > BARTHEL_INDEX_MAX)
    ) {
      return `Barthel Indexは${BARTHEL_INDEX_MIN}から${BARTHEL_INDEX_MAX}の間で入力してください`
    }
    if (
      std.bergBalanceScale !== null &&
      std.bergBalanceScale !== undefined &&
      (std.bergBalanceScale < BERG_BALANCE_SCALE_MIN || std.bergBalanceScale > BERG_BALANCE_SCALE_MAX)
    ) {
      return `Berg Balance Scaleは${BERG_BALANCE_SCALE_MIN}から${BERG_BALANCE_SCALE_MAX}の間で入力してください`
    }

    // カスタム評価のバリデーション
    for (const custom of form.customEvaluations) {
      if (!custom.name) {
        return 'カスタム評価の評価名は必須です'
      }
      if (custom.value === '' || custom.value === null || custom.value === undefined) {
        return `カスタム評価「${custom.name}」のスコア値は必須です`
      }
      if (custom.min !== undefined && custom.max !== undefined) {
        const numValue = typeof custom.value === 'string' ? parseFloat(custom.value) : custom.value
        if (typeof numValue === 'number' && (numValue < custom.min || numValue > custom.max)) {
          return `カスタム評価「${custom.name}」の値は${custom.min}から${custom.max}の間で入力してください`
        }
      }
    }

    return null
  }

  return {
    form,
    resetForm,
    addCustomEvaluation,
    removeCustomEvaluation,
    validateForm,
  }
}
