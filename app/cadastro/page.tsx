import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { BrandSide } from '@/components/brand-side'
import { SignupForm } from '@/components/signup-form'

export default async function CadastroPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/painel/pedidos')

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-xl shadow-primary/10 ring-1 ring-border md:grid-cols-2">
        <BrandSide />
        <SignupForm />
      </div>
    </main>
  )
}
