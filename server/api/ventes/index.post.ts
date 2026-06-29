import { db } from '~/server/db'
import { ventes, recoltes, cultures } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.recolteId || !body.quantity || !body.unit || !body.unitPrice || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Récolte, quantité, unité, prix unitaire et date requis' })
  }

  // Générer le libellé depuis la récolte → culture
  let label = body.label || ''
  if (!label) {
    const [recolte] = await db
      .select({ cultureName: cultures.name })
      .from(recoltes)
      .innerJoin(cultures, eq(recoltes.cultureId, cultures.id))
      .where(eq(recoltes.id, body.recolteId))
    label = recolte ? `Vente de ${recolte.cultureName}` : 'Vente'
  }

  const totalAmount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)
  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [vente] = await db.insert(ventes).values({
    label,
    quantity: body.quantity,
    unit: body.unit,
    unitPrice: body.unitPrice,
    totalAmount,
    buyer: body.buyer || null,
    date: body.date,
    siteId,
    recolteId: body.recolteId,
    note: body.note || null,
    createdBy: user.id,
  }).returning()

  return vente
})
