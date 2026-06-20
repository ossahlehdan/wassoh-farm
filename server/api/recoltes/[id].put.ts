import { db } from '~/server/db'
import { recoltes } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const [updated] = await db
    .update(recoltes)
    .set({
      cultureId: body.cultureId,
      quantity: body.quantity,
      unit: body.unit,
      quality: body.quality || null,
      date: body.date,
      note: body.note || null,
    })
    .where(eq(recoltes.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Récolte introuvable' })
  return updated
})
