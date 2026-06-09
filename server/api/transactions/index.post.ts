import { db } from '~/server/db'
import { transactions } from '~/server/db/schema'
import { transactionSchema } from '~/utils/schemas'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)
  const parsed = transactionSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: parsed.error.flatten(),
    })
  }

  // Employee can only create for their site
  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [created] = await db
    .insert(transactions)
    .values({
      ...parsed.data,
      siteId,
      userId: user.id,
    })
    .returning()

  return created
})
