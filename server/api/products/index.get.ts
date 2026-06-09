import { db } from '~/server/db'
import { products } from '~/server/db/schema'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  return db.select().from(products)
})
