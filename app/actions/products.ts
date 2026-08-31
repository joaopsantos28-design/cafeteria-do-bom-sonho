'use server'

import { db } from '@/lib/db'
import { product } from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireUser } from './session'

export async function getProducts() {
  await requireUser()
  return db.select().from(product).orderBy(asc(product.category), asc(product.name))
}

export async function getAvailableProducts() {
  await requireUser()
  return db
    .select()
    .from(product)
    .where(eq(product.available, true))
    .orderBy(asc(product.category), asc(product.name))
}

export async function createProduct(input: {
  name: string
  description?: string
  category: string
  price: number
}) {
  const user = await requireUser()
  const name = input.name.trim()
  if (!name) throw new Error('Nome obrigatório')
  if (!Number.isInteger(input.price) || input.price < 0)
    throw new Error('Preço inválido')

  await db.insert(product).values({
    name,
    description: input.description?.trim() || null,
    category: input.category.trim() || 'Cafés',
    price: input.price,
    createdBy: user.id,
  })
  revalidatePath('/painel/produtos')
}

export async function updateProduct(
  id: number,
  input: {
    name: string
    description?: string
    category: string
    price: number
  },
) {
  await requireUser()
  const name = input.name.trim()
  if (!name) throw new Error('Nome obrigatório')
  if (!Number.isInteger(input.price) || input.price < 0)
    throw new Error('Preço inválido')

  await db
    .update(product)
    .set({
      name,
      description: input.description?.trim() || null,
      category: input.category.trim() || 'Cafés',
      price: input.price,
    })
    .where(eq(product.id, id))
  revalidatePath('/painel/produtos')
}

export async function toggleProductAvailability(id: number, available: boolean) {
  await requireUser()
  await db.update(product).set({ available }).where(eq(product.id, id))
  revalidatePath('/painel/produtos')
}

export async function deleteProduct(id: number) {
  await requireUser()
  await db.delete(product).where(eq(product.id, id))
  revalidatePath('/painel/produtos')
}
