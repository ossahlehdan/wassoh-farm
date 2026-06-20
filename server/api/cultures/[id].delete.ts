import { db } from '~/server/db'
import { cultures } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))

  const [deleted] = await db.delete(cultures).where(eq(cultures.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Culture introuvable' })
  return { success: true }
})
