import { db } from '~/server/db'
import { transactions, sites, users } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { desc, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const query = db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      label: transactions.label,
      category: transactions.category,
      note: transactions.note,
      date: transactions.date,
      siteId: transactions.siteId,
      siteName: sites.name,
      userId: transactions.userId,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
    })
    .from(transactions)
    .leftJoin(sites, eq(transactions.siteId, sites.id))
    .orderBy(desc(transactions.date), desc(transactions.createdAt))

  // Employee sees only their site
  if (user.role === 'employee' && user.siteId) {
    return query.where(eq(transactions.siteId, user.siteId))
  }

  return query
})
