import { db } from '~/server/db'
import { transactions } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { transactionSchema } from '~/utils/schemas'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const parsed = transactionSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: parsed.error.flatten(),
    })
  }

  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [updated] = await db
    .update(transactions)
    .set({ ...parsed.data, siteId, updatedAt: new Date() })
    .where(eq(transactions.id, id))
    .returning()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Transaction introuvable' })
  }

  return updated
})
