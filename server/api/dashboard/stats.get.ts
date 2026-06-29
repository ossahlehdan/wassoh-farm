import { db } from '~/server/db'
import { ventes, depenses, cultures } from '~/server/db/schema'
import { eq, sum, count, and, desc } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const siteFilterVentes = user.role === 'employee' && user.siteId
    ? eq(ventes.siteId, user.siteId) : undefined
  const siteFilterDepenses = user.role === 'employee' && user.siteId
    ? eq(depenses.siteId, user.siteId) : undefined
  const siteFilterCultures = user.role === 'employee' && user.siteId
    ? eq(cultures.siteId, user.siteId) : undefined

  const [ventesResult] = await db
    .select({ total: sum(ventes.totalAmount) })
    .from(ventes)
    .where(siteFilterVentes)

  const [depensesResult] = await db
    .select({ total: sum(depenses.amount) })
    .from(depenses)
    .where(siteFilterDepenses)

  const [culturesResult] = await db
    .select({ total: count() })
    .from(cultures)
    .where(siteFilterCultures ? and(eq(cultures.status, 'en_cours'), siteFilterCultures) : eq(cultures.status, 'en_cours'))

  const recentVentes = await db
    .select({
      id: ventes.id,
      label: ventes.label,
      totalAmount: ventes.totalAmount,
      date: ventes.date,
    })
    .from(ventes)
    .where(siteFilterVentes)
    .orderBy(desc(ventes.date))
    .limit(5)

  const recentDepenses = await db
    .select({
      id: depenses.id,
      label: depenses.label,
      amount: depenses.amount,
      category: depenses.category,
      date: depenses.date,
    })
    .from(depenses)
    .where(siteFilterDepenses)
    .orderBy(desc(depenses.date))
    .limit(5)

  const totalVentes = Number(ventesResult?.total ?? 0)
  const totalDepenses = Number(depensesResult?.total ?? 0)

  const recentActivity = [
    ...recentVentes.map((v) => ({ type: 'vente' as const, id: v.id, label: v.label, amount: Number(v.totalAmount), date: v.date })),
    ...recentDepenses.map((d) => ({ type: 'depense' as const, id: d.id, label: d.label, amount: Number(d.amount), date: d.date, category: d.category })),
  ].sort((a, b) => (b.date > a.date ? 1 : -1)).slice(0, 5)

  return {
    totalVentes,
    totalDepenses,
    balance: totalVentes - totalDepenses,
    culturesEnCours: culturesResult.total,
    recentActivity,
  }
})
