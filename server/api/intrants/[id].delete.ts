import { db } from '~/server/db'
import { intrants } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))

  const [deleted] = await db.delete(intrants).where(eq(intrants.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Intrant introuvable' })
  return { success: true }
})
