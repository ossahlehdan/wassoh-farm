import { db } from '~/server/db'
import { recoltes } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.cultureId || !body.quantity || !body.unit || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Culture, quantité, unité et date requis' })
  }

  const [recolte] = await db.insert(recoltes).values({
    cultureId: body.cultureId,
    quantity: body.quantity,
    unit: body.unit,
    quality: body.quality || null,
    date: body.date,
    note: body.note || null,
    createdBy: user.id,
  }).returning()

  return recolte
})
