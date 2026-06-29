import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin, hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!body.name || !body.username || !body.role) {
    throw createError({ statusCode: 400, statusMessage: 'Nom, identifiant et rôle requis' })
  }

  const updates: Record<string, any> = {
    name: body.name,
    username: body.username,
    role: body.role,
    siteId: body.role === 'admin' ? null : (body.siteId || null),
  }

  if (body.password) {
    updates.passwordHash = await hashPassword(body.password)
  }

  const [updated] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable' })
  }

  return { id: updated.id, name: updated.name, username: updated.username, role: updated.role, siteId: updated.siteId }
})
