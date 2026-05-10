import type { CreateRecordRequest } from '~/types/api/patient'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const { client, user } = await getAuthenticatedSupabase(event)
  const patientId = getRouterParam(event, 'id')

  if (!patientId) {
    throw createError({
      statusCode: 400,
      statusMessage: '患者IDが指定されていません',
    })
  }

  // Verify the patient exists and belongs to the user
  const { data: patient, error: patientError } = await client
    .from('patients')
    .select('id, user_id')
    .eq('id', patientId)
    .single()

  if (patientError || !patient) {
    throw createError({
      statusCode: 404,
      statusMessage: '患者が見つかりません',
    })
  }

  type PatientRow = Database['public']['Tables']['patients']['Row']
  const typedPatient = patient as unknown as PatientRow

  if (typedPatient.user_id !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'この患者の記録を作成する権限がありません',
    })
  }

  const body = await readBody<CreateRecordRequest>(event)

  // バリデーション
  if (!body.date) {
    throw createError({
      statusCode: 400,
      statusMessage: '日付は必須です',
    })
  }

  // Insert patient record
  type PatientRecordInsert = Database['public']['Tables']['patient_records']['Insert']
  type PatientRecordRow = Database['public']['Tables']['patient_records']['Row']
  
  const recordData: PatientRecordInsert = {
    patient_id: patientId,
    user_id: user.id,
    date: body.date,
    session_id: body.sessionId || `session-${Date.now()}`,
    standard_evaluations: body.standardEvaluations as unknown as Database['public']['Tables']['patient_records']['Insert']['standard_evaluations'],
    note: body.note || '',
  }

  const { data: newRecord, error: recordError } = await client
    .from('patient_records')
    // @ts-expect-error - Nuxt Supabaseモジュールの型推論の制限により、明示的な型指定が必要
    .insert(recordData)
    .select()
    .single()

  if (recordError || !newRecord) {
    throw createError({
      statusCode: 500,
      statusMessage: '記録の作成に失敗しました',
      data: recordError,
    })
  }

  const typedNewRecord = newRecord as unknown as PatientRecordRow

  // Insert custom evaluations if any
  if (body.customEvaluations && body.customEvaluations.length > 0) {
    type CustomEvaluationInsert = Database['public']['Tables']['custom_evaluations']['Insert']
    
    const customEvalsToInsert: CustomEvaluationInsert[] = body.customEvaluations.map((evaluation) => ({
      patient_record_id: typedNewRecord.id,
      name: evaluation.name,
      value: String(evaluation.value),
      unit: evaluation.unit,
      direction: evaluation.direction,
      min_value: evaluation.min,
      max_value: evaluation.max,
      tags: evaluation.tags || [],
      note: evaluation.note,
    }))

    // @ts-expect-error - Nuxt Supabaseモジュールの型推論の制限により、明示的な型指定が必要
    const { error: evalsError } = await client.from('custom_evaluations').insert(customEvalsToInsert)

    if (evalsError) {
      // Rollback is automatic due to RLS, but we should still report the error
      throw createError({
        statusCode: 500,
        statusMessage: 'カスタム評価の作成に失敗しました',
        data: evalsError,
      })
    }
  }

  // Update last_visit_date on patient
  type PatientUpdate = Database['public']['Tables']['patients']['Update']
  
  const updateData: PatientUpdate = { last_visit_date: body.date }
  
  // @ts-expect-error - Nuxt Supabaseモジュールの型推論の制限により、明示的な型指定が必要
  await client.from('patients').update(updateData).eq('id', patientId)

  return {
    success: true,
    record: {
      id: typedNewRecord.id,
      patientId,
      date: typedNewRecord.date,
      sessionId: typedNewRecord.session_id,
      standardEvaluations: typedNewRecord.standard_evaluations,
      customEvaluations: body.customEvaluations || [],
      note: typedNewRecord.note,
    },
  }
})
