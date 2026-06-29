import { db } from '~/server/db'
import { pepinieres } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!body.name || !body.siteId || !body.boxesSown || !body.sowDate) {
    throw createError({ statusCode: 400, statusMessage: 'Variété, site, nombre de boîtes et date de semis requis' })
  }

  const siteId = user.role === 'employee' ? user.siteId : body.siteId

  const [updated] = await db
    .update(pepinieres)
    .set({
      name: body.name,
      siteId,
      boxesSown: body.boxesSown,
      boxesViable: body.boxesViable || null,
      sowDate: body.sowDate,
      status: body.status || 'en_cours',
      note: body.note || null,
    })
    .where(eq(pepinieres.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Pépinière introuvable' })
  return updated
})
