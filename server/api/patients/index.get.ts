import type { PatientDB } from '~/types/api/patient'
import { mapPatientFromDB } from '~/types/api/patient'

export default defineEventHandler(async (event) => {
  const { client } = await getAuthenticatedSupabase(event)
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search : undefined

  let queryBuilder = client.from('patients').select('*').order('code', { ascending: true })

  // Search filtering
  if (search) {
    const searchLower = search.toLowerCase()
    queryBuilder = queryBuilder.or(
      `code.ilike.%${searchLower}%,name.ilike.%${searchLower}%,diagnosis.ilike.%${searchLower}%`,
    )
  }

  const { data, error } = await queryBuilder

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: '患者一覧の取得に失敗しました',
      data: error,
    })
  }

  // Map DB types to API types
  const patients = (data as PatientDB[]).map(mapPatientFromDB)

  return {
    patients,
  }
})
