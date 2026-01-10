// 標準評価の範囲・単位定義
export const ROM_MIN = 0
export const ROM_MAX = 360

export const MMT_MIN = 0
export const MMT_MAX = 5

export const VAS_MIN = 0
export const VAS_MAX = 100

export const NRS_MIN = 0
export const NRS_MAX = 10

export const TUG_MIN = 0
export const TUG_MAX = 300 // 秒（5分まで）

export const TEN_METER_WALK_MIN = 0
export const TEN_METER_WALK_MAX = 300 // 秒

export const SIX_MINUTE_WALK_MIN = 0
export const SIX_MINUTE_WALK_MAX = 1000 // m

export const BARTHEL_INDEX_MIN = 0
export const BARTHEL_INDEX_MAX = 100

export const BERG_BALANCE_SCALE_MIN = 0
export const BERG_BALANCE_SCALE_MAX = 56

// 単位の定義
export const UNITS = {
  DEGREE: 'degree',
  POINT: '点',
  SECOND: '秒',
  METER: 'm',
  COUNT: '回',
  PERCENT: '%',
  NONE: 'none',
} as const

export type Unit = (typeof UNITS)[keyof typeof UNITS]
