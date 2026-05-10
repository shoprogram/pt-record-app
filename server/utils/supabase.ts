import { serverSupabaseClient } from '#supabase/server'
import type { H3Event } from 'h3'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export const getAuthenticatedSupabase = async (
  event: H3Event,
): Promise<{ client: SupabaseClient<Database>; user: User }> => {
  const client = await serverSupabaseClient<Database>(event)
  const {
    data: { user },
    error,
  } = await client.auth.getUser()

  if (error || !user) {
    throw createError({
      statusCode: 401,
      statusMessage: '認証が必要です',
    })
  }

  return { client, user }
}
