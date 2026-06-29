import { db } from '~/server/db'
import { pepinieres } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.name || !body.siteId || !body.plantsSown || !body.sowDate) {
    throw createError({ statusCode: 400, statusMessage: 'Variété, site, nombre de plants et date de semis requis' })
  }

  const siteId = user.role === 'employee' ? user.siteId : body.siteId

  const [pepiniere] = await db.insert(pepinieres).values({
    name: body.name,
    siteId,
    plantsSown: body.plantsSown,
    plantsViable: body.plantsViable || null,
    sowDate: body.sowDate,
    status: body.status || 'en_cours',
    note: body.note || null,
    createdBy: user.id,
  }).returning()

  return pepiniere
})
