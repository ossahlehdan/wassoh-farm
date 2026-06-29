import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, createToken } from '~/server/utils/auth'
import type { AuthUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Identifiant et mot de passe requis' })
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiant ou mot de passe incorrect' })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiant ou mot de passe incorrect' })
  }

  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role as 'admin' | 'employee',
    siteId: user.siteId,
  }

  return {
    token: createToken(authUser),
    user: authUser,
  }
})
