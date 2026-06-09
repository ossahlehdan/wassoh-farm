import { db } from '~/server/db'
import { transactions } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  const [deleted] = await db
    .delete(transactions)
    .where(eq(transactions.id, id))
    .returning()

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Transaction introuvable' })
  }

  return { success: true }
})
