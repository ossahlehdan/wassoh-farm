import { db } from '~/server/db'
import { intrantAchats, intrantStock } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'
import { eq, and, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const body = await readBody(event)

  if (!body.intrantId || !body.quantity || !body.unitPrice || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Intrant, quantité, prix unitaire et date requis' })
  }

  const totalAmount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)

  return await db.transaction(async (tx) => {
    const [achat] = await tx.insert(intrantAchats).values({
      intrantId: body.intrantId,
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalAmount,
      supplier: body.supplier || null,
      note: body.note || null,
      date: body.date,
      createdBy: user.id,
    }).returning()

    // Update central stock
    const [existing] = await tx
      .select()
      .from(intrantStock)
      .where(and(eq(intrantStock.intrantId, body.intrantId), isNull(intrantStock.siteId)))

    if (existing) {
      await tx
        .update(intrantStock)
        .set({
          quantity: sql`${intrantStock.quantity}::numeric + ${body.quantity}::numeric`,
          updatedAt: new Date(),
        })
        .where(eq(intrantStock.id, existing.id))
    } else {
      await tx.insert(intrantStock).values({
        intrantId: body.intrantId,
        siteId: null,
        quantity: body.quantity,
      })
    }

    return achat
  })
})
