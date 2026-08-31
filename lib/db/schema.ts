import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// This is a shared cafeteria workspace: every authenticated employee (barista)
// works from the same catalog and the same order queue. Authorization here is
// "must be a signed-in employee" rather than per-user row ownership, so app
// rows are org-wide instead of scoped by userId. We still record who created
// each record for auditing.

export type OrderItem = {
  productId: number
  name: string
  price: number // cents
  quantity: number
}

export const staff = pgTable('staff', {
  userId: text('userId').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('Barista'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const product = pgTable('product', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull().default('Cafés'),
  price: integer('price').notNull(), // stored in cents
  available: boolean('available').notNull().default(true),
  createdBy: text('createdBy').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const cafeOrder = pgTable('cafe_order', {
  id: serial('id').primaryKey(),
  customerName: text('customerName').notNull(),
  tableLabel: text('tableLabel'),
  items: jsonb('items').$type<OrderItem[]>().notNull(),
  total: integer('total').notNull(), // stored in cents
  status: text('status').notNull().default('aberto'), // aberto | preparo | pronto | entregue
  notes: text('notes'),
  createdBy: text('createdBy').notNull(),
  createdByName: text('createdByName'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
