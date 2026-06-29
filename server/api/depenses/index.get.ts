import { db } from '~/server/db'
import { depenses, sites, cultures } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = db
    .select({
      id: depenses.id,
      amount: depenses.amount,
      label: depenses.label,
      category: depenses.category,
      note: depenses.note,
      date: depenses.date,
      siteId: depenses.siteId,
      siteName: sites.name,
      cultureId: depenses.cultureId,
      cultureName: cultures.name,
      createdAt: depenses.createdAt,
    })
    .from(depenses)
    .leftJoin(sites, eq(depenses.siteId, sites.id))
    .leftJoin(cultures, eq(depenses.cultureId, cultures.id))
    .orderBy(desc(depenses.date))

  if (user.role === 'employee' && user.siteId) {
    return query.where(eq(depenses.siteId, user.siteId))
  }

  return query
})
