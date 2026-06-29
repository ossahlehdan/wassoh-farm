import { db } from '~/server/db'
import { depenses } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!body.label || !body.category || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Libellé, catégorie et date requis' })
  }

  let amount = body.amount
  if (body.quantity && body.unitPrice) {
    amount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)
  }
  if (!amount) {
    throw createError({ statusCode: 400, statusMessage: 'Montant ou quantité + prix unitaire requis' })
  }

  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [updated] = await db
    .update(depenses)
    .set({
      amount,
      label: body.label,
      category: body.category,
      quantity: body.quantity || null,
      unit: body.unit || null,
      unitPrice: body.unitPrice || null,
      note: body.note || null,
      date: body.date,
      siteId,
      cultureId: body.cultureId || null,
    })
    .where(eq(depenses.id, id))
    .returning()

  if (!updated) throw createError({ statusCode: 404, statusMessage: 'Dépense introuvable' })
  return updated
})
