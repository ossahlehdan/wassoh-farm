import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { hashPassword, createToken } from '~/server/utils/auth'
import { count } from 'drizzle-orm'
import type { AuthUser } from '~/server/utils/auth'

// Endpoint pour créer le premier admin (seulement si aucun utilisateur n'existe)
export default defineEventHandler(async (event) => {
  const [result] = await db.select({ total: count() }).from(users)

  if (result.total > 0) {
    throw createError({ statusCode: 400, statusMessage: 'Un administrateur existe déjà. Utilisez la gestion des utilisateurs.' })
  }

  const body = await readBody(event)
  const { name, username, password } = body

  if (!name || !username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Nom, identifiant et mot de passe requis' })
  }

  const passwordHash = await hashPassword(password)

  const [user] = await db
    .insert(users)
    .values({ name, username, passwordHash, role: 'admin', siteId: null })
    .returning()

  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    username: user.username,
    role: 'admin',
    siteId: null,
  }

  return {
    token: createToken(authUser),
    user: authUser,
  }
})
