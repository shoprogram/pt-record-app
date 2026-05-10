import type { CreatePatientRequest, PatientDB } from '~/types/api/patient'
import { mapPatientFromDB } from '~/types/api/patient'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const { client, user } = await getAuthenticatedSupabase(event)

  const body = await readBody<CreatePatientRequest>(event)

  // バリデーション
  if (!body.code || !body.name || !body.age || !body.gender || !body.diagnosis) {
    throw createError({
      statusCode: 400,
      statusMessage: '必須項目が入力されていません',
    })
  }

  // Check if code already exists for this user
  const { data: existingPatient } = await client.from('patients').select('id').eq('code', body.code).maybeSingle()

  if (existingPatient) {
    throw createError({
      statusCode: 400,
      statusMessage: 'この患者コードは既に使用されています',
    })
  }

  // Insert new patient
  type PatientInsert = Database['public']['Tables']['patients']['Insert']
  
  const insertData: PatientInsert = {
    user_id: user.id,
    code: body.code,
    name: body.name,
    age: body.age,
    gender: body.gender,
    diagnosis: body.diagnosis,
    height: body.height,
    weight: body.weight,
    medical_history: body.medicalHistory,
    medications: body.medications,
    start_date: body.startDate,
    notes: body.notes,
  }

  const { data: newPatient, error } = await client
    .from('patients')
    // @ts-expect-error - Nuxt Supabaseモジュールの型推論の制限により、明示的な型指定が必要
    .insert(insertData)
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: '患者の作成に失敗しました',
      data: error,
    })
  }

  return {
    success: true,
    patient: mapPatientFromDB(newPatient as PatientDB),
  }
})
