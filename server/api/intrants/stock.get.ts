import { db } from '~/server/db'
import { intrantStock, intrants, sites } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = db
    .select({
      id: intrantStock.id,
      intrantId: intrantStock.intrantId,
      intrantName: intrants.name,
      intrantUnit: intrants.unit,
      intrantCategory: intrants.category,
      siteId: intrantStock.siteId,
      siteName: sites.name,
      quantity: intrantStock.quantity,
    })
    .from(intrantStock)
    .innerJoin(intrants, eq(intrantStock.intrantId, intrants.id))
    .leftJoin(sites, eq(intrantStock.siteId, sites.id))

  if (user.role === 'employee' && user.siteId) {
    return query.where(eq(intrantStock.siteId, user.siteId))
  }

  return query
})
