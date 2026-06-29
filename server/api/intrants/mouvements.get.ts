import { db } from '~/server/db'
import { intrantMouvements, intrants, sites } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'
import { eq, desc, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const fromSite = alias(sites, 'fromSite')
  const toSite = alias(sites, 'toSite')

  return db
    .select({
      id: intrantMouvements.id,
      intrantName: intrants.name,
      intrantUnit: intrants.unit,
      fromSiteName: fromSite.name,
      toSiteName: toSite.name,
      quantity: intrantMouvements.quantity,
      note: intrantMouvements.note,
      date: intrantMouvements.date,
    })
    .from(intrantMouvements)
    .innerJoin(intrants, eq(intrantMouvements.intrantId, intrants.id))
    .leftJoin(fromSite, eq(intrantMouvements.fromSiteId, fromSite.id))
    .innerJoin(toSite, eq(intrantMouvements.toSiteId, toSite.id))
    .orderBy(desc(intrantMouvements.date))
})
