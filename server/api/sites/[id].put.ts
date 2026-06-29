import { db } from '~/server/db'
import { sites } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'Le nom du site est requis' })
  }

  const [updated] = await db
    .update(sites)
    .set({
      name: body.name,
      location: body.location || null,
      area: body.area || null,
      areaUnit: body.areaUnit || 'ha',
    })
    .where(eq(sites.id, id))
    .returning()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Site introuvable' })
  }

  return updated
})
