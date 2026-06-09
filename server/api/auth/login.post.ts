import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, createToken } from '~/server/utils/auth'
import type { AuthUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email et mot de passe requis' })
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Email ou mot de passe incorrect' })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Email ou mot de passe incorrect' })
  }

  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'employee',
    siteId: user.siteId,
  }

  return {
    token: createToken(authUser),
    user: authUser,
  }
})
