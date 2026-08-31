'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/**
 * Every action that touches cafeteria data goes through this helper. In this
 * shared workspace the rule is "must be a signed-in employee" — we return the
 * whole session user so actions can record who created each record.
 */
export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}
