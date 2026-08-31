'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Coffee, Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await authClient.signIn.email({ email, password })
    if (error) {
      setLoading(false)
      setError('Não foi possível entrar. Verifique seu e-mail e senha.')
      return
    }
    router.push('/painel/pedidos')
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col justify-center px-8 py-10 md:px-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Coffee className="h-5 w-5" aria-hidden="true" />
        </div>

        <h2 className="font-display text-4xl font-700 text-primary">
          Olá Barista
        </h2>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Entre para ver os pedidos abertos do dia.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@bomsonho.cafe"
              className="h-12 rounded-xl border-transparent bg-secondary text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground/80">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 rounded-xl border-transparent bg-secondary text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl font-display text-base font-700"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Entrar no painel
                <ArrowRight className="ml-1 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
            novo por aqui?
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          asChild
          variant="outline"
          className="mt-4 h-12 w-full rounded-xl border-primary/30 bg-transparent font-display text-base font-600 text-primary hover:bg-primary/5"
        >
          <Link href="/cadastro">Cadastrar novo funcionário</Link>
        </Button>
      </div>
    </div>
  )
}
