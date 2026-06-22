import { db } from '~/server/db'
import { requireAdmin } from '~/server/utils/auth'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  // Supprimer dans l'ordre pour respecter les foreign keys
  await db.execute(sql`TRUNCATE TABLE
    depenses,
    ventes,
    recoltes,
    cultures,
    pepinieres,
    intrant_mouvements,
    intrant_achats,
    intrant_stock,
    intrants,
    users,
    sites
    RESTART IDENTITY CASCADE`)

  return { success: true }
})
