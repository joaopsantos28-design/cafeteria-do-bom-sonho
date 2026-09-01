'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Plus, Save } from 'lucide-react'

const inputClass = 'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15'

function Field({ label, children, required = true }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
      <span>{label}{required && <span className="ml-1 text-primary">*</span>}</span>
      {children}
    </label>
  )
}

function FormShell({ title, description, backHref, children }: { title: string; description: string; backHref: string; children: React.ReactNode }) {
  const router = useRouter()
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 lg:p-10">
      <button onClick={() => router.push(backHref)} className="flex w-fit items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary">
        <ArrowLeft className="size-4" /> Voltar
      </button>
      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">Cafeteria do bom sonho</p>
        <h1 className="font-serif text-4xl font-bold text-foreground">{title}</h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
      </header>
      {children}
    </main>
  )
}

function Success({ message }: { message: string }) {
  return <div role="status" className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm font-semibold text-foreground"><span className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check className="size-4" /></span>{message}</div>
}

export function NewOrderForm() {
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  return <FormShell title="Criar novo pedido" description="Registre o pedido do cliente e acompanhe o preparo pela aba de pedidos abertos." backHref="/painel/pedidos">
    <form onSubmit={(e) => { e.preventDefault(); setSaved(true) }} className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
      {saved && <Success message="Pedido criado e enviado para a fila de preparo." />}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nome do cliente"><input className={inputClass} placeholder="Ex.: Marina Souza" required /></Field>
        <Field label="Número da mesa"><input className={inputClass} type="number" min="1" placeholder="Ex.: 04" required /></Field>
      </div>
      <Field label="Item do pedido"><select className={inputClass} required defaultValue=""><option value="" disabled>Selecione um produto</option><option>Cappuccino da casa — R$ 12,90</option><option>Latte de baunilha — R$ 14,50</option><option>Bolo de cenoura — R$ 9,00</option><option>Cookie de chocolate — R$ 7,50</option></select></Field>
      <div className="grid gap-5 md:grid-cols-2"><Field label="Quantidade"><input className={inputClass} type="number" min="1" defaultValue="1" required /></Field><Field label="Observações" required={false}><input className={inputClass} placeholder="Ex.: pouco açúcar" /></Field></div>
      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5"><button type="button" onClick={() => router.push('/painel/pedidos')} className="rounded-xl px-5 py-3 text-sm font-bold text-muted-foreground hover:bg-muted">Cancelar</button><button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"><Plus className="size-4" /> Criar pedido</button></div>
    </form>
  </FormShell>
}

export function NewProductForm() {
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  return <FormShell title="Novo produto no cardápio" description="Cadastre bebidas, comidas e acompanhamentos para deixar o menu sempre atualizado." backHref="/painel/produtos">
    <form onSubmit={(e) => { e.preventDefault(); setSaved(true) }} className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
      {saved && <Success message="Produto cadastrado no cardápio com sucesso." />}
      <div className="grid gap-5 md:grid-cols-2"><Field label="Nome do produto"><input className={inputClass} placeholder="Ex.: Mocha de caramelo" required /></Field><Field label="Categoria"><select className={inputClass} defaultValue="Bebidas"><option>Bebidas</option><option>Comidas</option><option>Doces</option><option>Acompanhamentos</option></select></Field></div>
      <div className="grid gap-5 md:grid-cols-2"><Field label="Preço"><input className={inputClass} type="number" min="0" step="0.01" placeholder="0,00" required /></Field><Field label="Código interno" required={false}><input className={inputClass} placeholder="Ex.: BEB-014" /></Field></div>
      <Field label="Descrição" required={false}><textarea className={`${inputClass} min-h-28 resize-y`} placeholder="Descreva os ingredientes e detalhes do produto..." /></Field>
      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5"><button type="button" onClick={() => router.push('/painel/produtos')} className="rounded-xl px-5 py-3 text-sm font-bold text-muted-foreground hover:bg-muted">Cancelar</button><button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"><Save className="size-4" /> Salvar produto</button></div>
    </form>
  </FormShell>
}

export function NewStaffForm() {
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  return <FormShell title="Cadastrar novo funcionário" description="Adicione uma pessoa à equipe da cafeteria e defina sua função no painel." backHref="/painel/funcionarios">
    <form onSubmit={(e) => { e.preventDefault(); setSaved(true) }} className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
      {saved && <Success message="Funcionário cadastrado com sucesso." />}
      <div className="grid gap-5 md:grid-cols-2"><Field label="Nome completo"><input className={inputClass} placeholder="Ex.: Mia Oliveira" required /></Field><Field label="Cargo"><select className={inputClass} defaultValue="Barista"><option>Barista</option><option>Atendente</option><option>Gerente</option><option>Auxiliar de cozinha</option></select></Field></div>
      <div className="grid gap-5 md:grid-cols-2"><Field label="E-mail"><input className={inputClass} type="email" placeholder="nome@bomsonho.cafe" required /></Field><Field label="Telefone" required={false}><input className={inputClass} type="tel" placeholder="(00) 00000-0000" /></Field></div>
      <Field label="Observações" required={false}><textarea className={`${inputClass} min-h-28 resize-y`} placeholder="Anotações sobre o funcionário..." /></Field>
      <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5"><button type="button" onClick={() => router.push('/painel/funcionarios')} className="rounded-xl px-5 py-3 text-sm font-bold text-muted-foreground hover:bg-muted">Cancelar</button><button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"><Plus className="size-4" /> Cadastrar funcionário</button></div>
    </form>
  </FormShell>
}

export default NewOrderForm
