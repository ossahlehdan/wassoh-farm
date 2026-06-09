import { db } from '~/server/db'
import { stockMovements, products, users } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc } from 'drizzle-orm'
import { sites as sitesTable } from '~/server/db/schema'
import { sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const fromSite = alias(sitesTable, 'from_site')
  const toSite = alias(sitesTable, 'to_site')

  return db
    .select({
      id: stockMovements.id,
      productId: stockMovements.productId,
      productName: products.name,
      productUnit: products.unit,
      fromSiteId: stockMovements.fromSiteId,
      fromSiteName: fromSite.name,
      toSiteId: stockMovements.toSiteId,
      toSiteName: toSite.name,
      quantity: stockMovements.quantity,
      note: stockMovements.note,
      date: stockMovements.date,
      createdByName: users.name,
      createdAt: stockMovements.createdAt,
    })
    .from(stockMovements)
    .innerJoin(products, eq(stockMovements.productId, products.id))
    .leftJoin(fromSite, eq(stockMovements.fromSiteId, fromSite.id))
    .innerJoin(toSite, eq(stockMovements.toSiteId, toSite.id))
    .leftJoin(users, eq(stockMovements.createdBy, users.id))
    .orderBy(desc(stockMovements.date))
})
