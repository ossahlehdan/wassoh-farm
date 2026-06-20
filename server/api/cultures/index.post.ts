import { db } from '~/server/db'
import { cultures } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.name || !body.siteId || !body.startDate) {
    throw createError({ statusCode: 400, statusMessage: 'Nom, site et date de semis requis' })
  }

  const [culture] = await db.insert(cultures).values({
    name: body.name,
    siteId: body.siteId,
    area: body.area || null,
    areaUnit: body.areaUnit || 'ha',
    startDate: body.startDate,
    status: body.status || 'en_cours',
    note: body.note || null,
    createdBy: user.id,
  }).returning()

  return culture
})
