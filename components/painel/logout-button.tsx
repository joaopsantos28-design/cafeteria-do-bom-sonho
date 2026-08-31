'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onLogout() {
    setLoading(true)
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm font-semibold text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  )
}
