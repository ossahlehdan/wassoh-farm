import { db } from '~/server/db'
import { depenses } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [updated] = await db
    .update(depenses)
    .set({
      amount: body.amount,
      label: body.label,
      category: body.category,
      note: body.note || null,
      date: body.date,
      siteId,
    })
    .where(eq(depenses.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Dépense introuvable' })
  return updated
})
