'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

const ROLES = ['Barista', 'Atendente', 'Caixa', 'Gerente', 'Cozinha']

export function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  function onSubmit(e: React.FormEvent) { e.preventDefault(); setLoading(true); window.setTimeout(() => router.push('/painel/funcionarios'), 350) }
  return <div className="flex h-full flex-col justify-center px-8 py-10 md:px-12"><div className="mx-auto w-full max-w-sm">
    <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft /> Voltar para o login</Link>
    <h2 className="font-display text-4xl font-700 text-primary">Novo funcionário</h2><p className="mt-2 text-sm text-muted-foreground">Adicione alguém ao time da Cafeteria do bom sonho.</p>
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
      <div className="flex flex-col gap-2"><Label htmlFor="name">Nome completo</Label><Input id="name" required placeholder="Ex.: Mia Bigodes" className="h-12 rounded-xl border-transparent bg-secondary" /></div>
      <div className="flex flex-col gap-2"><Label htmlFor="role">Função</Label><Select defaultValue="Barista"><SelectTrigger id="role" className="h-12 rounded-xl border-transparent bg-secondary"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Barista">Barista</SelectItem><SelectItem value="Atendente">Atendente</SelectItem><SelectItem value="Caixa">Caixa</SelectItem><SelectItem value="Gerente">Gerente</SelectItem><SelectItem value="Cozinha">Cozinha</SelectItem></SelectContent></Select></div>
      <div className="flex flex-col gap-2"><Label htmlFor="new-email">E-mail</Label><Input id="new-email" type="email" required placeholder="voce@bomsonho.cafe" className="h-12 rounded-xl border-transparent bg-secondary" /></div>
      <div className="flex flex-col gap-2"><Label htmlFor="new-password">Senha provisória</Label><Input id="new-password" type="password" required placeholder="Mínimo de 8 caracteres" className="h-12 rounded-xl border-transparent bg-secondary" /></div>
      <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl font-display text-base font-700">{loading ? <Loader2 className="animate-spin" /> : <>Cadastrar funcionário <ArrowRight data-icon="inline-end" /></>}</Button>
    </form></div></div>
}
