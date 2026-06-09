import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.name || !body.unit) {
    throw createError({ statusCode: 400, statusMessage: 'Nom et unité requis' })
  }

  const [product] = await db.insert(products).values({
    name: body.name,
    unit: body.unit,
  }).returning()

  return product
})
