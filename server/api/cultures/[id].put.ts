import { db } from '~/server/db'
import { cultures } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!body.name || !body.siteId || !body.startDate) {
    throw createError({ statusCode: 400, statusMessage: 'Nom, site et date de semis requis' })
  }

  const siteId = user.role === 'employee' ? user.siteId : body.siteId

  const [updated] = await db
    .update(cultures)
    .set({
      name: body.name,
      siteId,
      area: body.area || null,
      areaUnit: body.areaUnit || 'ha',
      startDate: body.startDate,
      status: body.status || 'en_cours',
      note: body.note || null,
    })
    .where(eq(cultures.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Culture introuvable' })
  return updated
})
