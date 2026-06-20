import { db } from '~/server/db'
import { ventes } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  const [deleted] = await db.delete(ventes).where(eq(ventes.id, id)).returning()
  if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Vente introuvable' })
  return { success: true }
})
