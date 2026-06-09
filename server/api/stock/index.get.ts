import { db } from '~/server/db'
import { stock, products, sites } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = db
    .select({
      id: stock.id,
      productId: stock.productId,
      productName: products.name,
      productUnit: products.unit,
      siteId: stock.siteId,
      siteName: sites.name,
      quantity: stock.quantity,
      updatedAt: stock.updatedAt,
    })
    .from(stock)
    .innerJoin(products, eq(stock.productId, products.id))
    .leftJoin(sites, eq(stock.siteId, sites.id))

  if (user.role === 'employee' && user.siteId) {
    return query.where(eq(stock.siteId, user.siteId))
  }

  return query
})
