import type { CreateRecordRequest } from '~/types/api/patient'

// 記録の保存
export default defineEventHandler(async (event) => {
  const patientId = getRouterParam(event, 'id')

  if (!patientId) {
    throw createError({
      statusCode: 400,
      statusMessage: '患者IDが指定されていません',
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

  // ダミーデータとして保存（実際にはDBに保存）
  const newRecord = {
    id: `r${Date.now()}`,
    patientId,
    date: body.date,
    sessionId: body.sessionId || `session-${Date.now()}`,
    standardEvaluations: body.standardEvaluations || {},
    customEvaluations: body.customEvaluations || [],
    note: body.note || '',
  }

  return {
    success: true,
    record: newRecord,
  }
})
