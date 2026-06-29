import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import { db } from '~/server/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

const JWT_SECRET = process.env.JWT_SECRET || 'wassoh-farm-secret-key-change-in-production'

export interface AuthUser {
  id: number
  name: string
  username: string
  role: 'admin' | 'employee'
  siteId: number | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, JWT_SECRET) as AuthUser
}

export async function getUserFromEvent(event: H3Event): Promise<AuthUser | null> {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    return verifyToken(authHeader.slice(7))
  } catch {
    return null
  }
}

export async function requireAuth(event: H3Event): Promise<AuthUser> {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Non autorisé' })
  }
  return user
}

export async function requireAdmin(event: H3Event): Promise<AuthUser> {
  const user = await requireAuth(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Accès réservé aux administrateurs' })
  }
  return user
}
