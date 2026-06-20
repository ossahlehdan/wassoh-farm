import { db } from '~/server/db'
import { intrants } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const [updated] = await db
    .update(intrants)
    .set({ name: body.name, unit: body.unit, category: body.category })
    .where(eq(intrants.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Intrant introuvable' })
  return updated
})
