import { db } from '~/server/db'
import { stockMovements, stock } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'
import { eq, and, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const body = await readBody(event)

  if (!body.productId || !body.toSiteId || !body.quantity || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Produit, site destination, quantité et date requis' })
  }

  const quantity = Number(body.quantity)
  const fromSiteId = body.fromSiteId || null

  return await db.transaction(async (tx) => {
    // Check source stock
    const sourceCondition = fromSiteId
      ? and(eq(stock.productId, body.productId), eq(stock.siteId, fromSiteId))
      : and(eq(stock.productId, body.productId), isNull(stock.siteId))

    const [sourceStock] = await tx.select().from(stock).where(sourceCondition)

    if (!sourceStock || Number(sourceStock.quantity) < quantity) {
      throw createError({ statusCode: 400, statusMessage: 'Stock insuffisant' })
    }

    // Decrease source stock
    await tx
      .update(stock)
      .set({
        quantity: sql`${stock.quantity}::numeric - ${body.quantity}::numeric`,
        updatedAt: new Date(),
      })
      .where(eq(stock.id, sourceStock.id))

    // Increase destination stock
    const [destStock] = await tx
      .select()
      .from(stock)
      .where(and(eq(stock.productId, body.productId), eq(stock.siteId, body.toSiteId)))

    if (destStock) {
      await tx
        .update(stock)
        .set({
          quantity: sql`${stock.quantity}::numeric + ${body.quantity}::numeric`,
          updatedAt: new Date(),
        })
        .where(eq(stock.id, destStock.id))
    } else {
      await tx.insert(stock).values({
        productId: body.productId,
        siteId: body.toSiteId,
        quantity: body.quantity,
      })
    }

    // Record movement
    const [movement] = await tx.insert(stockMovements).values({
      productId: body.productId,
      fromSiteId,
      toSiteId: body.toSiteId,
      quantity: body.quantity,
      note: body.note || null,
      date: body.date,
      createdBy: user.id,
    }).returning()

    return movement
  })
})
