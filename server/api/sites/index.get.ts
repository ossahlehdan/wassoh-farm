import { db } from '~/server/db'
import { sites } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  return db.select().from(sites).orderBy(desc(sites.createdAt))
})
