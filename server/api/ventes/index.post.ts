import { db } from '~/server/db'
import { ventes } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.label || !body.quantity || !body.unit || !body.unitPrice || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Libellé, quantité, unité, prix unitaire et date requis' })
  }

  const totalAmount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)
  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [vente] = await db.insert(ventes).values({
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
    createdBy: user.id,
  }).returning()

  return vente
})
