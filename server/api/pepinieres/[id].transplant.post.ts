import { db } from '~/server/db'
import { pepinieres, cultures } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

// Transplanter une pépinière → créer une culture liée
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!body.siteId || !body.startDate) {
    throw createError({ statusCode: 400, statusMessage: 'Site de destination et date de transplantation requis' })
  }

  // Vérifier que la pépinière existe et est prête
  const [pepiniere] = await db.select().from(pepinieres).where(eq(pepinieres.id, id))
  if (!pepiniere) throw createError({ statusCode: 404, statusMessage: 'Pépinière introuvable' })
  if (pepiniere.status === 'transplantee') {
    throw createError({ statusCode: 400, statusMessage: 'Cette pépinière a déjà été transplantée' })
  }

  return await db.transaction(async (tx) => {
    // Créer la culture
    const [culture] = await tx.insert(cultures).values({
      name: pepiniere.name,
      siteId: body.siteId,
      pepiniereId: id,
      area: body.area || null,
      areaUnit: body.areaUnit || 'ha',
      startDate: body.startDate,
      status: 'en_cours',
      note: body.note || `Transplanté depuis pépinière: ${pepiniere.plantsSown} plants semés, ${pepiniere.plantsViable || '?'} viables`,
      createdBy: user.id,
    }).returning()

    // Mettre à jour le statut de la pépinière
    await tx
      .update(pepinieres)
      .set({ status: 'transplantee' })
      .where(eq(pepinieres.id, id))

    return culture
  })
})
