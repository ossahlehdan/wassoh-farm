import { db } from '~/server/db'
import { intrantAchats, intrantStock, intrants, depenses } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'
import { eq, and, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const body = await readBody(event)

  if (!body.quantity || !body.unitPrice || !body.date || !body.unit) {
    throw createError({ statusCode: 400, statusMessage: 'Quantité, unité, prix unitaire et date requis' })
  }

  // Soit intrantId existant, soit name + category pour créer/trouver
  let intrantId = body.intrantId ? Number(body.intrantId) : null
  let intrantName = ''
  let intrantCategory = ''

  if (intrantId) {
    const [existing] = await db.select().from(intrants).where(eq(intrants.id, intrantId))
    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Intrant introuvable' })
    intrantName = existing.name
    intrantCategory = existing.category
  } else {
    if (!body.name || !body.category) {
      throw createError({ statusCode: 400, statusMessage: 'Nom et catégorie de l\'intrant requis' })
    }
    // Chercher ou créer l'intrant
    const [existing] = await db.select().from(intrants).where(eq(intrants.name, body.name))
    if (existing) {
      intrantId = existing.id
      intrantName = existing.name
      intrantCategory = existing.category
    } else {
      const [created] = await db.insert(intrants).values({
        name: body.name,
        category: body.category,
        unit: body.unit,
      }).returning()
      intrantId = created.id
      intrantName = created.name
      intrantCategory = created.category
    }
  }

  const totalAmount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)

  return await db.transaction(async (tx) => {
    // 1. Créer l'achat
    const [achat] = await tx.insert(intrantAchats).values({
      intrantId: intrantId!,
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalAmount,
      supplier: body.supplier || null,
      note: body.note || null,
      date: body.date,
      createdBy: user.id,
    }).returning()

    // 2. Mettre à jour le stock central
    const [existingStock] = await tx
      .select()
      .from(intrantStock)
      .where(and(eq(intrantStock.intrantId, intrantId!), isNull(intrantStock.siteId)))

    if (existingStock) {
      await tx
        .update(intrantStock)
        .set({
          quantity: sql`${intrantStock.quantity}::numeric + ${body.quantity}::numeric`,
          updatedAt: new Date(),
        })
        .where(eq(intrantStock.id, existingStock.id))
    } else {
      await tx.insert(intrantStock).values({
        intrantId: intrantId!,
        siteId: null,
        quantity: body.quantity,
      })
    }

    // 3. Créer la dépense associée automatiquement
    const categoryMap: Record<string, string> = {
      semence: 'Semences',
      engrais: 'Engrais',
      pesticide: 'Pesticides',
      materiel: 'Matériel',
      autre: 'Autre',
    }
    const depenseCategory = categoryMap[intrantCategory] || 'Autre'
    const supplierNote = body.supplier ? ` (${body.supplier})` : ''

    await tx.insert(depenses).values({
      amount: totalAmount,
      label: `Achat ${intrantName}${supplierNote}`,
      category: depenseCategory,
      quantity: body.quantity,
      unit: body.unit,
      unitPrice: body.unitPrice,
      note: body.note || null,
      date: body.date,
      achatIntrantId: achat.id,
      createdBy: user.id,
    })

    return achat
  })
})
