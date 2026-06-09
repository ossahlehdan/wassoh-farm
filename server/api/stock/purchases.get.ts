import { db } from '~/server/db'
import { stockPurchases, products, users } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return db
    .select({
      id: stockPurchases.id,
      productId: stockPurchases.productId,
      productName: products.name,
      productUnit: products.unit,
      quantity: stockPurchases.quantity,
      unitPrice: stockPurchases.unitPrice,
      totalAmount: stockPurchases.totalAmount,
      supplier: stockPurchases.supplier,
      note: stockPurchases.note,
      date: stockPurchases.date,
      createdByName: users.name,
      createdAt: stockPurchases.createdAt,
    })
    .from(stockPurchases)
    .innerJoin(products, eq(stockPurchases.productId, products.id))
    .leftJoin(users, eq(stockPurchases.createdBy, users.id))
    .orderBy(desc(stockPurchases.date))
})
