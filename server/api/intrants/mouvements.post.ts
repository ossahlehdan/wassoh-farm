import { db } from '~/server/db'
import { intrantMouvements, intrantStock } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'
import { eq, and, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const body = await readBody(event)

  if (!body.intrantId || !body.toSiteId || !body.quantity || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Intrant, site destination, quantité et date requis' })
  }

  const fromSiteId = body.fromSiteId || null

  return await db.transaction(async (tx) => {
    const sourceCondition = fromSiteId
      ? and(eq(intrantStock.intrantId, body.intrantId), eq(intrantStock.siteId, fromSiteId))
      : and(eq(intrantStock.intrantId, body.intrantId), isNull(intrantStock.siteId))

    const [sourceStock] = await tx.select().from(intrantStock).where(sourceCondition)

    if (!sourceStock || Number(sourceStock.quantity) < Number(body.quantity)) {
      throw createError({ statusCode: 400, statusMessage: 'Stock insuffisant' })
    }

    await tx
      .update(intrantStock)
      .set({
        quantity: sql`${intrantStock.quantity}::numeric - ${body.quantity}::numeric`,
        updatedAt: new Date(),
      })
      .where(eq(intrantStock.id, sourceStock.id))

    const [destStock] = await tx
      .select()
      .from(intrantStock)
      .where(and(eq(intrantStock.intrantId, body.intrantId), eq(intrantStock.siteId, body.toSiteId)))

    if (destStock) {
      await tx
        .update(intrantStock)
        .set({
          quantity: sql`${intrantStock.quantity}::numeric + ${body.quantity}::numeric`,
          updatedAt: new Date(),
        })
        .where(eq(intrantStock.id, destStock.id))
    } else {
      await tx.insert(intrantStock).values({
        intrantId: body.intrantId,
        siteId: body.toSiteId,
        quantity: body.quantity,
      })
    }

    const [movement] = await tx.insert(intrantMouvements).values({
      intrantId: body.intrantId,
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
