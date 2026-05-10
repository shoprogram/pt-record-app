import type { PatientRecordDB, CustomEvaluationDB } from '~/types/api/patient'
import { mapPatientRecordFromDB } from '~/types/api/patient'

export default defineEventHandler(async (event) => {
  const { client } = await getAuthenticatedSupabase(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '患者IDが指定されていません',
    })
  }

  // First, verify the patient exists and belongs to the user
  const { data: patient, error: patientError } = await client.from('patients').select('id').eq('id', id).single()

  if (patientError || !patient) {
    throw createError({
      statusCode: 404,
      statusMessage: '患者が見つかりません',
    })
  }

  // Fetch patient records
  const { data: recordsData, error: recordsError } = await client
    .from('patient_records')
    .select('*')
    .eq('patient_id', id)
    .order('date', { ascending: false })
    .order('session_id', { ascending: false })

  if (recordsError) {
    throw createError({
      statusCode: 500,
      statusMessage: '記録の取得に失敗しました',
      data: recordsError,
    })
  }

  const dbRecords = recordsData as PatientRecordDB[]

  // Fetch all custom evaluations for these records
  const recordIds = dbRecords.map((r) => r.id)
  let customEvalsData: CustomEvaluationDB[] = []

  if (recordIds.length > 0) {
    const { data: evalsData, error: evalsError } = await client
      .from('custom_evaluations')
      .select('*')
      .in('patient_record_id', recordIds)

    if (evalsError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'カスタム評価の取得に失敗しました',
        data: evalsError,
      })
    }

    customEvalsData = evalsData as CustomEvaluationDB[]
  }

  // Group custom evaluations by record ID
  const customEvalsByRecordId = customEvalsData.reduce(
    (acc, evaluation) => {
      if (!acc[evaluation.patient_record_id]) {
        acc[evaluation.patient_record_id] = []
      }
      acc[evaluation.patient_record_id]?.push(evaluation)
      return acc
    },
    {} as Record<string, CustomEvaluationDB[]>,
  )

  // Map to API types
  const records = dbRecords.map((dbRecord) =>
    mapPatientRecordFromDB(dbRecord, customEvalsByRecordId[dbRecord.id] || []),
  )

  return {
    records,
  }
})
