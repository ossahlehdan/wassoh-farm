import { db } from '~/server/db'
import { pepinieres, cultures } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '~/server/utils/auth'

// Transplanter une pépinière (totalement ou partiellement) → créer une culture liée
export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!body.siteId || !body.startDate || !body.boxes) {
    throw createError({ statusCode: 400, statusMessage: 'Site, date et nombre de boîtes requis' })
  }

  const boxes = Number(body.boxes)
  if (boxes <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Le nombre de boîtes doit être supérieur à 0' })
  }

  const siteId = user.role === 'employee' ? user.siteId : body.siteId

  // Vérifier que la pépinière existe
  const [pepiniere] = await db.select().from(pepinieres).where(eq(pepinieres.id, id))
  if (!pepiniere) throw createError({ statusCode: 404, statusMessage: 'Pépinière introuvable' })
  if (pepiniere.status === 'transplantee') {
    throw createError({ statusCode: 400, statusMessage: 'Toutes les boîtes ont déjà été transplantées' })
  }

  // Calculer les boîtes disponibles (viables si renseigné, sinon semées)
  const totalBoxes = pepiniere.boxesViable ?? pepiniere.boxesSown
  const remaining = totalBoxes - (pepiniere.boxesTransplanted || 0)

  if (boxes > remaining) {
    throw createError({ statusCode: 400, statusMessage: `Seulement ${remaining} boîtes disponibles` })
  }

  const newTransplanted = (pepiniere.boxesTransplanted || 0) + boxes
  const allTransplanted = newTransplanted >= totalBoxes

  return await db.transaction(async (tx) => {
    // Créer la culture
    const [culture] = await tx.insert(cultures).values({
      name: pepiniere.name,
      siteId,
      pepiniereId: id,
      area: body.area || null,
      areaUnit: body.areaUnit || 'ha',
      startDate: body.startDate,
      status: 'en_cours',
      note: body.note || `Transplanté depuis pépinière: ${boxes} boîtes sur ${totalBoxes}`,
      createdBy: user.id,
    }).returning()

    // Mettre à jour la pépinière
    await tx
      .update(pepinieres)
      .set({
        boxesTransplanted: newTransplanted,
        status: allTransplanted ? 'transplantee' : pepiniere.status,
      })
      .where(eq(pepinieres.id, id))

    return culture
  })
})
