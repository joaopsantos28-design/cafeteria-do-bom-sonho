'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { ensureStaffProfile } from '@/app/actions/staff'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

const ROLES = ['Barista', 'Atendente', 'Caixa', 'Gerente', 'Cozinha']

export function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Barista')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    setLoading(true)
    const { error } = await authClient.signUp.email({ email, password, name })
    if (error) {
      setLoading(false)
      setError(
        'Não foi possível cadastrar. O e-mail pode já estar em uso ou os dados são inválidos.',
      )
      return
    }

    // Register the barista in the staff directory with their chosen role.
    try {
      await ensureStaffProfile(role)
    } catch {
      // Non-blocking: the account exists even if the profile write fails.
    }

    router.push('/painel/pedidos')
    router.refresh()
  }

  return (
    <div className="flex h-full flex-col justify-center px-8 py-10 md:px-12">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o login
        </Link>

        <h2 className="font-display text-4xl font-700 text-primary">
          Novo funcionário
        </h2>
        <p className="mt-2 font-sans text-sm text-muted-foreground">
          Crie a conta do time da Cafeteria do bom sonho.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground/80">
              Nome completo
            </Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Mia Bigodes"
              className="h-12 rounded-xl border-transparent bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground/80">
              Função
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger
                id="role"
                className="h-12 rounded-xl border-transparent bg-secondary"
              >
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              className="h-12 rounded-xl border-transparent bg-secondary"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
              className="h-12 rounded-xl border-transparent bg-secondary"
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
                Criar conta
                <ArrowRight className="ml-1 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
