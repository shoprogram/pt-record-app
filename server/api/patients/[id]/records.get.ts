import type { PatientRecord } from '~/types/api/patient'

// ダミーデータ: 患者の記録一覧（1日複数レコード対応）
const dummyRecords: Record<string, PatientRecord[]> = {
  '1': [
    {
      id: 'r1',
      patientId: '1',
      date: '2025-01-15',
      sessionId: 'session-1',
      standardEvaluations: {
        rom: 85,
        mmt: 4,
        vas: 60,
        nrs: 6,
        tug: null,
        tenMeterWalk: null,
        sixMinuteWalk: null,
        barthelIndex: 85,
        bergBalanceScale: null,
      },
      customEvaluations: [
        {
          id: 'custom-1',
          name: '膝の可動域',
          value: 120,
          unit: 'degree',
          direction: 'higher_is_better',
          min: 0,
          max: 150,
          tags: ['膝'],
          note: '右膝',
        },
      ],
      note: '可動域が改善してきている。',
    },
    {
      id: 'r2',
      patientId: '1',
      date: '2025-01-15',
      sessionId: 'session-2',
      standardEvaluations: {
        rom: 80,
        mmt: 3,
        vas: 70,
        nrs: 7,
        tug: 15.5,
        tenMeterWalk: 12.3,
        sixMinuteWalk: null,
        barthelIndex: 80,
        bergBalanceScale: 45,
      },
      customEvaluations: [],
      note: '午後の評価。歩行能力が向上。',
    },
    {
      id: 'r3',
      patientId: '1',
      date: '2025-01-10',
      sessionId: 'session-1',
      standardEvaluations: {
        rom: 75,
        mmt: 3,
        vas: 70,
        nrs: 7,
        tug: null,
        tenMeterWalk: null,
        sixMinuteWalk: null,
        barthelIndex: 75,
        bergBalanceScale: null,
      },
      customEvaluations: [],
      note: '痛みがやや強い。',
    },
  ],
  '2': [
    {
      id: 'r4',
      patientId: '2',
      date: '2025-01-14',
      sessionId: 'session-1',
      standardEvaluations: {
        rom: 90,
        mmt: 4,
        vas: 50,
        nrs: 5,
        tug: null,
        tenMeterWalk: null,
        sixMinuteWalk: null,
        barthelIndex: 90,
        bergBalanceScale: null,
      },
      customEvaluations: [],
      note: '肩の可動域が改善。',
    },
  ],
}

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '患者IDが指定されていません',
    })
  }

  const records = dummyRecords[id] || []

  // 日付とセッションIDでソート（新しい順）
  return {
    records: records.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date > b.date ? -1 : 1
      }
      return (a.sessionId || '') > (b.sessionId || '') ? -1 : 1
    }),
  }
})
