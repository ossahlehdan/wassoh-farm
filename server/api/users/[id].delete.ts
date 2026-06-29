import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))

  if (admin.id === id) {
    throw createError({ statusCode: 400, statusMessage: 'Vous ne pouvez pas supprimer votre propre compte' })
  }

  const [deleted] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning()

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable' })
  }

  return { success: true }
})
