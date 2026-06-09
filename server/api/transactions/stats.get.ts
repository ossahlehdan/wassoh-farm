import { db } from '~/server/db'
import { transactions, sites } from '~/server/db/schema'
import { eq, sum, sql, and } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const siteFilter = user.role === 'employee' && user.siteId
    ? eq(transactions.siteId, user.siteId)
    : undefined

  const incomeWhere = siteFilter
    ? and(eq(transactions.type, 'income'), siteFilter)
    : eq(transactions.type, 'income')

  const expenseWhere = siteFilter
    ? and(eq(transactions.type, 'expense'), siteFilter)
    : eq(transactions.type, 'expense')

  const [incomeResult] = await db
    .select({ total: sum(transactions.amount) })
    .from(transactions)
    .where(incomeWhere)

  const [expenseResult] = await db
    .select({ total: sum(transactions.amount) })
    .from(transactions)
    .where(expenseWhere)

  const recentQuery = db
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
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
    })
    .from(transactions)
    .leftJoin(sites, eq(transactions.siteId, sites.id))
    .orderBy(sql`${transactions.date} DESC, ${transactions.createdAt} DESC`)
    .limit(5)

  const recentTransactions = siteFilter
    ? await recentQuery.where(siteFilter)
    : await recentQuery

  const totalIncome = Number(incomeResult?.total ?? 0)
  const totalExpense = Number(expenseResult?.total ?? 0)

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    recentTransactions,
  }
})
