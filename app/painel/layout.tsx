import type React from 'react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { NavLinks } from '@/components/painel/nav-links'
import { LogoutButton } from '@/components/painel/logout-button'
import { Toaster } from '@/components/ui/sonner'

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/')

  const initials = session.user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="sticky top-0 hidden h-svh w-72 flex-col border-r border-sidebar-border bg-sidebar p-5 md:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary p-1.5">
            <Image
              src="/gato-cafe.png"
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-700 text-sidebar-foreground">
              Bom sonho
            </p>
            <p className="font-sans text-xs text-sidebar-foreground/60">
              Painel do barista
            </p>
          </div>
        </div>

        <div className="my-6 h-px bg-sidebar-border" />

        <NavLinks />

        <div className="mt-auto">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-sidebar-accent px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-700 text-primary-foreground">
              {initials || 'B'}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate font-sans text-sm font-semibold text-sidebar-foreground">
                {session.user.name}
              </p>
              <p className="truncate font-sans text-xs text-sidebar-foreground/60">
                {session.user.email}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary p-1">
              <Image
                src="/gato-cafe.png"
                alt=""
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-display text-base font-700 text-foreground">
              Bom sonho
            </span>
          </div>
          <LogoutButton />
        </header>

        <div className="border-b border-border bg-sidebar px-4 pb-3 md:hidden">
          <NavLinks />
        </div>

        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>

      <Toaster position="top-center" />
    </div>
  )
}
