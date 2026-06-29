import { db } from '~/server/db'
import { pepinieres, sites } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = db
    .select({
      id: pepinieres.id,
      name: pepinieres.name,
      siteId: pepinieres.siteId,
      siteName: sites.name,
      boxesSown: pepinieres.boxesSown,
      boxesViable: pepinieres.boxesViable,
      boxesTransplanted: pepinieres.boxesTransplanted,
      sowDate: pepinieres.sowDate,
      status: pepinieres.status,
      note: pepinieres.note,
      createdAt: pepinieres.createdAt,
    })
    .from(pepinieres)
    .innerJoin(sites, eq(pepinieres.siteId, sites.id))
    .orderBy(desc(pepinieres.createdAt))

  if (user.role === 'employee' && user.siteId) {
    return query.where(eq(pepinieres.siteId, user.siteId))
  }

  return query
})
