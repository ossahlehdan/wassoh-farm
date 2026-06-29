import { db } from '~/server/db'
import { cultures, sites, pepinieres } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = db
    .select({
      id: cultures.id,
      name: cultures.name,
      siteId: cultures.siteId,
      siteName: sites.name,
      pepiniereId: cultures.pepiniereId,
      area: cultures.area,
      areaUnit: cultures.areaUnit,
      startDate: cultures.startDate,
      status: cultures.status,
      note: cultures.note,
      createdAt: cultures.createdAt,
    })
    .from(cultures)
    .innerJoin(sites, eq(cultures.siteId, sites.id))
    .orderBy(desc(cultures.createdAt))

  if (user.role === 'employee' && user.siteId) {
    return query.where(eq(cultures.siteId, user.siteId))
  }

  return query
})
