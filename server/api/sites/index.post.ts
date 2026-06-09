import { db } from '~/server/db'
import { sites } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'Le nom du site est requis' })
  }

  const [site] = await db.insert(sites).values({
    name: body.name,
    location: body.location || null,
  }).returning()

  return site
})
