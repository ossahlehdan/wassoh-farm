import { db } from '~/server/db'
import { intrantAchats, intrantStock, intrants, depenses } from '~/server/db/schema'
import { requireAdmin } from '~/server/utils/auth'
import { eq, and, isNull } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event)
  const body = await readBody(event)

  if (!body.intrantId || !body.quantity || !body.unitPrice || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Intrant, quantité, prix unitaire et date requis' })
  }

  const totalAmount = (Number(body.quantity) * Number(body.unitPrice)).toFixed(2)

  // Récupérer le nom de l'intrant pour le libellé de la dépense
  const [intrant] = await db.select({ name: intrants.name, category: intrants.category }).from(intrants).where(eq(intrants.id, body.intrantId))
  if (!intrant) {
    throw createError({ statusCode: 404, statusMessage: 'Intrant introuvable' })
  }

  return await db.transaction(async (tx) => {
    // 1. Créer l'achat
    const [achat] = await tx.insert(intrantAchats).values({
      intrantId: body.intrantId,
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalAmount,
      supplier: body.supplier || null,
      note: body.note || null,
      date: body.date,
      createdBy: user.id,
    }).returning()

    // 2. Mettre à jour le stock central
    const [existing] = await tx
      .select()
      .from(intrantStock)
      .where(and(eq(intrantStock.intrantId, body.intrantId), isNull(intrantStock.siteId)))

    if (existing) {
      await tx
        .update(intrantStock)
        .set({
          quantity: sql`${intrantStock.quantity}::numeric + ${body.quantity}::numeric`,
          updatedAt: new Date(),
        })
        .where(eq(intrantStock.id, existing.id))
    } else {
      await tx.insert(intrantStock).values({
        intrantId: body.intrantId,
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
    const depenseCategory = categoryMap[intrant.category] || 'Autre'
    const supplierNote = body.supplier ? ` (${body.supplier})` : ''

    await tx.insert(depenses).values({
      amount: totalAmount,
      label: `Achat ${intrant.name} — ${body.quantity} unités${supplierNote}`,
      category: depenseCategory,
      note: body.note || null,
      date: body.date,
      achatIntrantId: achat.id,
      createdBy: user.id,
    })

    return achat
  })
})
