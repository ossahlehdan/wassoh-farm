import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { requireAdmin, hashPassword } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.name || !body.username || !body.password || !body.role) {
    throw createError({ statusCode: 400, statusMessage: 'Nom, identifiant, mot de passe et rôle requis' })
  }

  if (body.role === 'employee' && !body.siteId) {
    throw createError({ statusCode: 400, statusMessage: 'Un employé doit être assigné à un site' })
  }

  const passwordHash = await hashPassword(body.password)

  const [user] = await db.insert(users).values({
    name: body.name,
    username: body.username,
    passwordHash,
    role: body.role,
    siteId: body.role === 'admin' ? null : body.siteId,
  }).returning()

  return { id: user.id, name: user.name, username: user.username, role: user.role, siteId: user.siteId }
})
