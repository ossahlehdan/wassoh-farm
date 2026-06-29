import { db } from '~/server/db'
import { intrants } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.name || !body.unit || !body.category) {
    throw createError({ statusCode: 400, statusMessage: 'Nom, unité et catégorie requis' })
  }

  const [intrant] = await db.insert(intrants).values({
    name: body.name,
    unit: body.unit,
    category: body.category,
  }).returning()

  return intrant
})
