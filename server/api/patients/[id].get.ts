import type { Patient } from '~/types/api/patient'

// ダミーデータ: 患者詳細
const dummyPatientDetails: Record<string, Patient> = {
  1: {
    id: '1',
    code: 'PT-001',
    name: '患者A',
    age: 45,
    gender: '男性',
    diagnosis: '腰痛',
    height: 170,
    weight: 70,
    medicalHistory: '高血圧、糖尿病。内服薬：降圧薬、血糖降下薬。',
    startDate: '2024-12-01',
    notes: '慢性的な腰痛。デスクワークが主な原因。',
  },
  2: {
    id: '2',
    code: 'PT-002',
    name: '患者B',
    age: 32,
    gender: '女性',
    diagnosis: '肩こり',
    startDate: '2024-11-15',
    notes: '長時間のPC作業による肩こり。',
  },
  3: {
    id: '3',
    code: 'PT-003',
    name: '患者C',
    age: 58,
    gender: '男性',
    diagnosis: '膝痛',
    startDate: '2024-10-20',
    notes: '階段の昇降時に痛みが発生。',
  },
  4: {
    id: '4',
    code: 'PT-004',
    name: '患者D',
    age: 28,
    gender: '女性',
    diagnosis: '首痛',
    startDate: '2025-01-05',
    notes: 'スマートフォンの長時間使用が原因。',
  },
  5: {
    id: '5',
    code: 'PT-005',
    name: '患者E',
    age: 65,
    gender: '男性',
    diagnosis: '腰痛',
    startDate: '2024-09-10',
    notes: '加齢による腰痛。定期的なリハビリが必要。',
  },
}

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '患者IDが指定されていません',
    })
  }

  const patient = dummyPatientDetails[id]

  if (!patient) {
    throw createError({
      statusCode: 404,
      statusMessage: '患者が見つかりません',
    })
  }

  return patient
})
