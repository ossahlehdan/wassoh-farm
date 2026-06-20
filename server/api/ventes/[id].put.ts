import { db } from '~/server/db'
import { ventes } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const totalAmount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)
  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [updated] = await db
    .update(ventes)
    .set({
      label: body.label,
      quantity: body.quantity,
      unit: body.unit,
      unitPrice: body.unitPrice,
      totalAmount,
      buyer: body.buyer || null,
      date: body.date,
      siteId,
      recolteId: body.recolteId || null,
      note: body.note || null,
    })
    .where(eq(ventes.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Vente introuvable' })
  return updated
})
