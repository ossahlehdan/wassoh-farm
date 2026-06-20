import { db } from '~/server/db'
import { recoltes } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))

  const [deleted] = await db.delete(recoltes).where(eq(recoltes.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Récolte introuvable' })
  return { success: true }
})
