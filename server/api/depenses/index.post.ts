import { db } from '~/server/db'
import { depenses } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const body = await readBody(event)

  if (!body.amount || !body.label || !body.category || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Montant, libellé, catégorie et date requis' })
  }

  const siteId = user.role === 'employee' ? user.siteId : (body.siteId || null)

  const [depense] = await db.insert(depenses).values({
    amount: body.amount,
    label: body.label,
    category: body.category,
    note: body.note || null,
    date: body.date,
    siteId,
    cultureId: body.cultureId || null,
    createdBy: user.id,
  }).returning()

  return depense
})
