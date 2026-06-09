import { pgTable, serial, varchar, decimal, text, date, timestamp, integer } from 'drizzle-orm/pg-core'

// ── Sites ──
export const sites = pgTable('sites', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Site = typeof sites.$inferSelect

// ── Users ──
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('employee'), // 'admin' | 'employee'
  siteId: integer('site_id').references(() => sites.id), // null = admin (tous les sites)
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect

// ── Products ──
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(), // kg, sac, litre, pièce, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Product = typeof products.$inferSelect

// ── Stock Purchases (achats en gros) ──
export const stockPurchases = pgTable('stock_purchases', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  supplier: varchar('supplier', { length: 255 }),
  note: text('note'),
  date: date('date').notNull(),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type StockPurchase = typeof stockPurchases.$inferSelect

// ── Stock (quantité par produit par site) ──
export const stock = pgTable('stock', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  siteId: integer('site_id').references(() => sites.id), // null = entrepôt central
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull().default('0'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Stock = typeof stock.$inferSelect

// ── Stock Movements (sorties/transferts vers un site) ──
export const stockMovements = pgTable('stock_movements', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  fromSiteId: integer('from_site_id').references(() => sites.id), // null = entrepôt central
  toSiteId: integer('to_site_id').references(() => sites.id).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull(),
  note: text('note'),
  date: date('date').notNull(),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type StockMovement = typeof stockMovements.$inferSelect

// ── Transactions (revenus / dépenses) ──
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 10 }).notNull(), // 'income' | 'expense'
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  note: text('note'),
  date: date('date').notNull(),
  siteId: integer('site_id').references(() => sites.id),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert
