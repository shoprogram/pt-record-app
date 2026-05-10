import type { PatientDB } from '~/types/api/patient'
import { mapPatientFromDB } from '~/types/api/patient'

export default defineEventHandler(async (event) => {
  const { client } = await getAuthenticatedSupabase(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '患者IDが指定されていません',
    })
  }

  const { data, error } = await client.from('patients').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      throw createError({
        statusCode: 404,
        statusMessage: '患者が見つかりません',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: '患者情報の取得に失敗しました',
      data: error,
    })
  }

  // Map DB type to API type
  return mapPatientFromDB(data as PatientDB)
})
