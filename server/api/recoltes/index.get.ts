import { db } from '~/server/db'
import { recoltes, cultures, sites } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = db
    .select({
      id: recoltes.id,
      cultureId: recoltes.cultureId,
      cultureName: cultures.name,
      siteName: sites.name,
      siteId: cultures.siteId,
      quantity: recoltes.quantity,
      unit: recoltes.unit,
      quality: recoltes.quality,
      date: recoltes.date,
      note: recoltes.note,
      createdAt: recoltes.createdAt,
    })
    .from(recoltes)
    .innerJoin(cultures, eq(recoltes.cultureId, cultures.id))
    .innerJoin(sites, eq(cultures.siteId, sites.id))
    .orderBy(desc(recoltes.date))

  if (user.role === 'employee' && user.siteId) {
    return query.where(eq(cultures.siteId, user.siteId))
  }

  return query
})
