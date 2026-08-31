'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Coffee, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/painel/pedidos', label: 'Pedidos abertos', icon: ClipboardList },
  { href: '/painel/produtos', label: 'Produtos / cardápio', icon: Coffee },
  { href: '/painel/funcionarios', label: 'Funcionários', icon: Users },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1.5">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm font-semibold transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
