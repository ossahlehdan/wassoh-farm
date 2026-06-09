import { db } from '~/server/db'
import { stockPurchases, stock } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'
import { eq, and, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const body = await readBody(event)

  if (!body.productId || !body.quantity || !body.unitPrice || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Produit, quantité, prix unitaire et date requis' })
  }

  const totalAmount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)

  return await db.transaction(async (tx) => {
    // Create purchase record
    const [purchase] = await tx.insert(stockPurchases).values({
      productId: body.productId,
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalAmount,
      supplier: body.supplier || null,
      note: body.note || null,
      date: body.date,
      createdBy: user.id,
    }).returning()

    // Update central stock (siteId = null)
    const [existing] = await tx
      .select()
      .from(stock)
      .where(and(eq(stock.productId, body.productId), isNull(stock.siteId)))

    if (existing) {
      await tx
        .update(stock)
        .set({
          quantity: sql`${stock.quantity}::numeric + ${body.quantity}::numeric`,
          updatedAt: new Date(),
        })
        .where(eq(stock.id, existing.id))
    } else {
      await tx.insert(stock).values({
        productId: body.productId,
        siteId: null,
        quantity: body.quantity,
      })
    }

    return purchase
  })
})
