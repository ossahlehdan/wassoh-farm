import { db } from '~/server/db'
import { transactions } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  const [transaction] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id))

  if (!transaction) {
    throw createError({ statusCode: 404, statusMessage: 'Transaction introuvable' })
  }

  return transaction
})
