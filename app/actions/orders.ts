'use server'

import { db } from '@/lib/db'
import { cafeOrder, product, type OrderItem } from '@/lib/db/schema'
import { desc, eq, inArray, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireUser } from './session'
import type { OrderStatus } from '@/lib/format'

export async function getOpenOrders() {
  await requireUser()
  return db
    .select()
    .from(cafeOrder)
    .where(ne(cafeOrder.status, 'entregue'))
    .orderBy(desc(cafeOrder.createdAt))
}

export async function getDeliveredOrders() {
  await requireUser()
  return db
    .select()
    .from(cafeOrder)
    .where(eq(cafeOrder.status, 'entregue'))
    .orderBy(desc(cafeOrder.createdAt))
    .limit(30)
}

export async function createOrder(input: {
  customerName: string
  tableLabel?: string
  notes?: string
  lines: { productId: number; quantity: number }[]
}) {
  const user = await requireUser()

  const customerName = input.customerName.trim()
  if (!customerName) throw new Error('Nome do cliente obrigatório')

  // Keep only positive, integer quantities.
  const requested = input.lines.filter(
    (l) => Number.isInteger(l.quantity) && l.quantity > 0 && l.quantity <= 99,
  )
  if (requested.length === 0) throw new Error('Adicione ao menos um item')

  // Re-price everything from the server-side catalog — never trust client prices.
  const ids = [...new Set(requested.map((l) => l.productId))]
  const catalog = await db
    .select()
    .from(product)
    .where(inArray(product.id, ids))

  const items: OrderItem[] = []
  let total = 0
  for (const line of requested) {
    const p = catalog.find((c) => c.id === line.productId)
    if (!p || !p.available) continue
    items.push({
      productId: p.id,
      name: p.name,
      price: p.price,
      quantity: line.quantity,
    })
    total += p.price * line.quantity
  }

  if (items.length === 0) throw new Error('Nenhum item válido no pedido')

  await db.insert(cafeOrder).values({
    customerName,
    tableLabel: input.tableLabel?.trim() || null,
    notes: input.notes?.trim() || null,
    items,
    total,
    status: 'aberto',
    createdBy: user.id,
    createdByName: user.name,
  })
  revalidatePath('/painel/pedidos')
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await requireUser()
  await db.update(cafeOrder).set({ status }).where(eq(cafeOrder.id, id))
  revalidatePath('/painel/pedidos')
}

export async function deleteOrder(id: number) {
  await requireUser()
  await db.delete(cafeOrder).where(eq(cafeOrder.id, id))
  revalidatePath('/painel/pedidos')
}
