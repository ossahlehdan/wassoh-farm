import { pgTable, serial, varchar, decimal, text, date, timestamp, integer } from 'drizzle-orm/pg-core'

// ── Sites / Parcelles ──
export const sites = pgTable('sites', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  area: decimal('area', { precision: 10, scale: 2 }),
  areaUnit: varchar('area_unit', { length: 10 }).default('ha'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Site = typeof sites.$inferSelect

// ── Users ──
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('employee'),
  siteId: integer('site_id').references(() => sites.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect

// ── Intrants (semences, engrais, pesticides, matériel) ──
export const intrants = pgTable('intrants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // semence, engrais, pesticide, materiel, autre
  unit: varchar('unit', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Intrant = typeof intrants.$inferSelect

// ── Stock d'intrants (quantité par intrant par site) ──
export const intrantStock = pgTable('intrant_stock', {
  id: serial('id').primaryKey(),
  intrantId: integer('intrant_id').references(() => intrants.id).notNull(),
  siteId: integer('site_id').references(() => sites.id), // null = entrepôt central
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull().default('0'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type IntrantStock = typeof intrantStock.$inferSelect

// ── Achats d'intrants ──
export const intrantAchats = pgTable('intrant_achats', {
  id: serial('id').primaryKey(),
  intrantId: integer('intrant_id').references(() => intrants.id).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  supplier: varchar('supplier', { length: 255 }),
  note: text('note'),
  date: date('date').notNull(),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type IntrantAchat = typeof intrantAchats.$inferSelect

// ── Mouvements d'intrants (transferts entre sites) ──
export const intrantMouvements = pgTable('intrant_mouvements', {
  id: serial('id').primaryKey(),
  intrantId: integer('intrant_id').references(() => intrants.id).notNull(),
  fromSiteId: integer('from_site_id').references(() => sites.id),
  toSiteId: integer('to_site_id').references(() => sites.id).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull(),
  note: text('note'),
  date: date('date').notNull(),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type IntrantMouvement = typeof intrantMouvements.$inferSelect

// ── Pépinières ──
export const pepinieres = pgTable('pepinieres', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(), // variété : Riz NERICA, Tomate Roma...
  siteId: integer('site_id').references(() => sites.id).notNull(),
  boxesSown: integer('boxes_sown').notNull(), // nombre de boîtes semées
  boxesViable: integer('boxes_viable'), // boîtes viables après germination
  boxesTransplanted: integer('boxes_transplanted').notNull().default(0), // boîtes déjà transplantées
  sowDate: date('sow_date').notNull(),
  estimatedDays: integer('estimated_days'), // durée estimée en jours avant transplantation
  status: varchar('status', { length: 20 }).notNull().default('en_cours'), // en_cours, prete, transplantee, perdue
  note: text('note'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Pepiniere = typeof pepinieres.$inferSelect

// ── Cultures (ce qui est planté) ──
export const cultures = pgTable('cultures', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(), // Riz, Maïs, Manioc...
  siteId: integer('site_id').references(() => sites.id).notNull(),
  pepiniereId: integer('pepiniere_id').references(() => pepinieres.id), // lien optionnel si issu d'une pépinière
  area: decimal('area', { precision: 10, scale: 2 }),
  areaUnit: varchar('area_unit', { length: 10 }).default('ha'),
  startDate: date('start_date').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('en_cours'), // en_cours, recoltee, abandonnee
  note: text('note'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Culture = typeof cultures.$inferSelect

// ── Récoltes ──
export const recoltes = pgTable('recoltes', {
  id: serial('id').primaryKey(),
  cultureId: integer('culture_id').references(() => cultures.id).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  quality: varchar('quality', { length: 50 }), // bonne, moyenne, mauvaise
  date: date('date').notNull(),
  note: text('note'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Recolte = typeof recoltes.$inferSelect

// ── Ventes (vente de récoltes) ──
export const ventes = pgTable('ventes', {
  id: serial('id').primaryKey(),
  recolteId: integer('recolte_id').references(() => recoltes.id),
  label: varchar('label', { length: 255 }).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  buyer: varchar('buyer', { length: 255 }),
  date: date('date').notNull(),
  siteId: integer('site_id').references(() => sites.id),
  note: text('note'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Vente = typeof ventes.$inferSelect

// ── Dépenses ──
export const depenses = pgTable('depenses', {
  id: serial('id').primaryKey(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  quantity: decimal('quantity', { precision: 12, scale: 2 }),
  unit: varchar('unit', { length: 50 }),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }),
  note: text('note'),
  date: date('date').notNull(),
  siteId: integer('site_id').references(() => sites.id),
  cultureId: integer('culture_id').references(() => cultures.id),
  achatIntrantId: integer('achat_intrant_id').references(() => intrantAchats.id),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Depense = typeof depenses.$inferSelect
