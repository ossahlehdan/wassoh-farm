import { db } from '~/server/db'
import { intrantAchats, intrants } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return db
    .select({
      id: intrantAchats.id,
      intrantId: intrantAchats.intrantId,
      intrantName: intrants.name,
      intrantUnit: intrants.unit,
      quantity: intrantAchats.quantity,
      unitPrice: intrantAchats.unitPrice,
      totalAmount: intrantAchats.totalAmount,
      supplier: intrantAchats.supplier,
      note: intrantAchats.note,
      date: intrantAchats.date,
      createdAt: intrantAchats.createdAt,
    })
    .from(intrantAchats)
    .innerJoin(intrants, eq(intrantAchats.intrantId, intrants.id))
    .orderBy(desc(intrantAchats.date))
})
