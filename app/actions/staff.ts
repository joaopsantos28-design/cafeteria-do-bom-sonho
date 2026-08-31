'use server'

import { db } from '@/lib/db'
import { staff } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireUser } from './session'

export async function getStaff() {
  await requireUser()
  return db.select().from(staff).orderBy(desc(staff.createdAt))
}

/**
 * Called right after a successful sign-up so the new barista shows up in the
 * "Funcionários" list with their chosen role.
 */
export async function ensureStaffProfile(role: string) {
  const user = await requireUser()
  const cleanRole = role.trim() || 'Barista'

  const existing = await db
    .select({ userId: staff.userId })
    .from(staff)
    .where(eq(staff.userId, user.id))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(staff)
      .set({ role: cleanRole, name: user.name, email: user.email })
      .where(eq(staff.userId, user.id))
    revalidatePath('/painel/funcionarios')
    return
  }

  await db.insert(staff).values({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: cleanRole,
  })
  revalidatePath('/painel/funcionarios')
}

export async function updateStaffRole(userId: string, role: string) {
  await requireUser()
  const cleanRole = role.trim() || 'Barista'
  await db.update(staff).set({ role: cleanRole }).where(eq(staff.userId, userId))
  revalidatePath('/painel/funcionarios')
}
