export interface Patient {
  id: string
  code: string
  name: string
  age: number
  gender: string
  diagnosis: string
  height?: number // 身長 (cm)
  weight?: number // 体重 (kg)
  medicalHistory?: string // 既往歴（自由入力）
  medications?: string // 服薬（自由入力）
  lastVisitDate?: string
  startDate?: string
  notes?: string
}

// 標準評価項目
export interface StandardEvaluations {
  rom?: number | null // 関節可動域 (degree)
  mmt?: number | null // 筋力 (0-5)
  vas?: number | null // VAS (0-100)
  nrs?: number | null // NRS (0-10)
  tug?: number | null // TUG (秒)
  tenMeterWalk?: number | null // 10m歩行 (秒)
  sixMinuteWalk?: number | null // 6分間歩行 (m)
  barthelIndex?: number | null // Barthel Index (0-100)
  bergBalanceScale?: number | null // Berg Balance Scale (0-56)
}

// カスタム評価項目
export interface CustomEvaluation {
  id: string
  name: string
  value: number | string
  unit: string // 点、秒、m、回、%、none など
  direction: 'higher_is_better' | 'lower_is_better'
  min?: number
  max?: number
  tags?: string[]
  note?: string
}

// 評価レコード（1セッション分）
export interface PatientRecord {
  id: string
  patientId: string
  date: string
  sessionId?: string // 同一日付内で複数セッションを区別（オプショナル）
  standardEvaluations: StandardEvaluations
  customEvaluations: CustomEvaluation[]
  note?: string
}

export interface PatientsResponse {
  patients: Patient[]
}

export interface PatientRecordsResponse {
  records: PatientRecord[]
}

// 記録作成リクエスト
export interface CreateRecordRequest {
  date: string
  sessionId?: string
  standardEvaluations: StandardEvaluations
  customEvaluations: CustomEvaluation[]
  note?: string
}
