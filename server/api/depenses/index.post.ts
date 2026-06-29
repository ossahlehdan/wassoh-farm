import { db } from '~/server/db'
import { depenses } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.label || !body.category || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Libellé, catégorie et date requis' })
  }

  // Calculer le montant : soit directement, soit quantité × prix unitaire
  let amount = body.amount
  if (body.quantity && body.unitPrice) {
    amount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)
  }
  if (!amount) {
    throw createError({ statusCode: 400, statusMessage: 'Montant ou quantité + prix unitaire requis' })
  }

  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [depense] = await db.insert(depenses).values({
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
    createdBy: user.id,
  }).returning()

  return depense
})
