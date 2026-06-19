import { db } from '~/server/db'
import { users, sites } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      role: users.role,
      siteId: users.siteId,
      siteName: sites.name,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(sites, eq(users.siteId, sites.id))

  return result
})
