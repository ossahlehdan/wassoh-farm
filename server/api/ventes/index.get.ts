import { db } from '~/server/db'
import { ventes, recoltes, cultures, sites } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = db
    .select({
      id: ventes.id,
      label: ventes.label,
      quantity: ventes.quantity,
      unit: ventes.unit,
      unitPrice: ventes.unitPrice,
      totalAmount: ventes.totalAmount,
      buyer: ventes.buyer,
      date: ventes.date,
      siteId: ventes.siteId,
      siteName: sites.name,
      recolteId: ventes.recolteId,
      note: ventes.note,
      createdAt: ventes.createdAt,
    })
    .from(ventes)
    .leftJoin(sites, eq(ventes.siteId, sites.id))
    .orderBy(desc(ventes.date))

  if (user.role === 'employee' && user.siteId) {
    return query.where(eq(ventes.siteId, user.siteId))
  }

  return query
})
