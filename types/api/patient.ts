// Database types (includes user_id for internal use)
export interface PatientDB {
  id: string
  user_id: string
  code: string
  name: string
  age: number
  gender: string
  diagnosis: string
  height?: number
  weight?: number
  medical_history?: string
  medications?: string
  last_visit_date?: string
  start_date?: string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface PatientRecordDB {
  id: string
  patient_id: string
  user_id: string
  date: string
  session_id?: string
  standard_evaluations: Record<string, number | null>
  note?: string
  created_at?: string
  updated_at?: string
}

export interface CustomEvaluationDB {
  id: string
  patient_record_id: string
  name: string
  value: string
  unit: string
  direction: 'higher_is_better' | 'lower_is_better'
  min_value?: number
  max_value?: number
  tags?: string[]
  note?: string
  created_at?: string
}

// API types (without user_id, for client consumption)
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

// 患者作成リクエスト
export interface CreatePatientRequest {
  code: string
  name: string
  age: number
  gender: string
  diagnosis: string
  height?: number
  weight?: number
  medicalHistory?: string
  medications?: string
  startDate?: string
  notes?: string
}

// Mapper functions to convert between DB and API types
export const mapPatientFromDB = (dbPatient: PatientDB): Patient => ({
  id: dbPatient.id,
  code: dbPatient.code,
  name: dbPatient.name,
  age: dbPatient.age,
  gender: dbPatient.gender,
  diagnosis: dbPatient.diagnosis,
  height: dbPatient.height,
  weight: dbPatient.weight,
  medicalHistory: dbPatient.medical_history,
  medications: dbPatient.medications,
  lastVisitDate: dbPatient.last_visit_date,
  startDate: dbPatient.start_date,
  notes: dbPatient.notes,
})

export const mapPatientRecordFromDB = (
  dbRecord: PatientRecordDB,
  customEvals: CustomEvaluationDB[],
): PatientRecord => ({
  id: dbRecord.id,
  patientId: dbRecord.patient_id,
  date: dbRecord.date,
  sessionId: dbRecord.session_id,
  standardEvaluations: dbRecord.standard_evaluations as StandardEvaluations,
  customEvaluations: customEvals.map(mapCustomEvaluationFromDB),
  note: dbRecord.note,
})

export const mapCustomEvaluationFromDB = (dbEval: CustomEvaluationDB): CustomEvaluation => ({
  id: dbEval.id,
  name: dbEval.name,
  value: dbEval.value,
  unit: dbEval.unit,
  direction: dbEval.direction,
  min: dbEval.min_value,
  max: dbEval.max_value,
  tags: dbEval.tags,
  note: dbEval.note,
})
