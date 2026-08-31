'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Coffee, Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    window.setTimeout(() => router.push('/painel/pedidos'), 350)
  }

  return (
    <div className="flex h-full flex-col justify-center px-8 py-10 md:px-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground"><Coffee aria-hidden="true" /></div>
        <h2 className="font-display text-4xl font-700 text-primary">Olá Barista</h2>
        <p className="mt-2 text-sm text-muted-foreground">Entre para ver os pedidos abertos do dia.</p>
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@bomsonho.cafe" className="h-12 rounded-xl border-transparent bg-secondary" /></div>
          <div className="flex flex-col gap-2"><Label htmlFor="password">Senha</Label><Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 rounded-xl border-transparent bg-secondary" /></div>
          <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl font-display text-base font-700">{loading ? <Loader2 className="animate-spin" /> : <>Entrar no painel <ArrowRight data-icon="inline-end" /></>}</Button>
        </form>
        <div className="my-8 flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-xs uppercase tracking-wider text-muted-foreground">novo por aqui?</span><span className="h-px flex-1 bg-border" /></div>
        <Button asChild variant="outline" className="h-12 w-full rounded-xl border-primary/30 bg-transparent font-display text-base font-600 text-primary"><Link href="/cadastro">Cadastrar novo funcionário</Link></Button>
      </div>
    </div>
  )
}

export default LoginForm
