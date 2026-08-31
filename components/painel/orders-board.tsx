'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '@/app/actions/orders'
import { formatBRL, ORDER_STATUS, type OrderStatus } from '@/lib/format'
import type { cafeOrder, product } from '@/lib/db/schema'
import type { InferSelectModel } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Coffee,
  Minus,
  Plus,
  Trash2,
  Check,
  ChefHat,
  Bell,
  MapPin,
} from 'lucide-react'

type Order = InferSelectModel<typeof cafeOrder>
type Product = InferSelectModel<typeof product>

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  aberto: 'preparo',
  preparo: 'pronto',
  pronto: 'entregue',
  entregue: null,
}

const NEXT_LABEL: Record<OrderStatus, string> = {
  aberto: 'Iniciar preparo',
  preparo: 'Marcar pronto',
  pronto: 'Entregar',
  entregue: '',
}

const NEXT_ICON: Record<OrderStatus, typeof ChefHat> = {
  aberto: ChefHat,
  preparo: Bell,
  pronto: Check,
  entregue: Check,
}

export function OrdersBoard({
  orders,
  products,
}: {
  orders: Order[]
  products: Product[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-800 text-foreground text-balance">
            Pedidos abertos
          </h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            {orders.length === 0
              ? 'Nenhum pedido na fila — hora de um cochilo de gato.'
              : `${orders.length} pedido${orders.length > 1 ? 's' : ''} em andamento no balcão.`}
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 rounded-xl font-display text-base font-700">
              <Plus className="h-5 w-5" />
              Novo pedido
            </Button>
          </DialogTrigger>
          <NewOrderDialog products={products} onDone={() => setOpen(false)} />
        </Dialog>
      </div>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
        <Coffee className="h-7 w-7" />
      </div>
      <p className="mt-4 font-display text-lg font-700 text-foreground">
        Tudo tranquilo por aqui
      </p>
      <p className="mt-1 max-w-xs font-sans text-sm text-muted-foreground">
        Assim que um cliente pedir aquele cafezinho, o pedido aparece nesta
        fila.
      </p>
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  const [isPending, startTransition] = useTransition()
  const status = order.status as OrderStatus
  const meta = ORDER_STATUS[status]
  const next = NEXT_STATUS[status]
  const NextIcon = NEXT_ICON[status]

  function advance() {
    if (!next) return
    startTransition(async () => {
      try {
        await updateOrderStatus(order.id, next)
        toast.success(`Pedido de ${order.customerName} → ${ORDER_STATUS[next].label}`)
      } catch {
        toast.error('Não foi possível atualizar o pedido.')
      }
    })
  }

  function remove() {
    startTransition(async () => {
      try {
        await deleteOrder(order.id)
        toast.success('Pedido removido.')
      } catch {
        toast.error('Não foi possível remover o pedido.')
      }
    })
  }

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-700 text-foreground">
            {order.customerName}
          </h3>
          {order.tableLabel ? (
            <p className="mt-0.5 flex items-center gap-1 font-sans text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {order.tableLabel}
            </p>
          ) : null}
        </div>
        <Badge className={`${meta.tone} rounded-full border-0 font-sans`}>
          {meta.label}
        </Badge>
      </div>

      <ul className="mt-4 space-y-1.5">
        {order.items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between font-sans text-sm text-foreground/90"
          >
            <span>
              <span className="font-semibold text-primary">
                {item.quantity}×
              </span>{' '}
              {item.name}
            </span>
            <span className="text-muted-foreground">
              {formatBRL(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {order.notes ? (
        <p className="mt-3 rounded-lg bg-secondary px-3 py-2 font-sans text-xs italic text-secondary-foreground">
          “{order.notes}”
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="font-sans text-xs text-muted-foreground">Total</span>
        <span className="font-display text-xl font-800 text-foreground">
          {formatBRL(order.total)}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {next ? (
          <Button
            onClick={advance}
            disabled={isPending}
            className="h-10 flex-1 rounded-xl font-sans text-sm font-700"
          >
            <NextIcon className="h-4 w-4" />
            {NEXT_LABEL[status]}
          </Button>
        ) : null}
        <Button
          onClick={remove}
          disabled={isPending}
          variant="outline"
          size="icon"
          aria-label="Remover pedido"
          className="h-10 w-10 rounded-xl border-border bg-transparent text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  )
}

function NewOrderDialog({
  products,
  onDone,
}: {
  products: Product[]
  onDone: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [customerName, setCustomerName] = useState('')
  const [tableLabel, setTableLabel] = useState('')
  const [notes, setNotes] = useState('')
  const [qty, setQty] = useState<Record<number, number>>({})

  const total = products.reduce(
    (sum, p) => sum + p.price * (qty[p.id] ?? 0),
    0,
  )
  const itemCount = Object.values(qty).reduce((a, b) => a + b, 0)

  function setProductQty(id: number, delta: number) {
    setQty((prev) => {
      const nextVal = Math.max(0, Math.min(99, (prev[id] ?? 0) + delta))
      return { ...prev, [id]: nextVal }
    })
  }

  function submit() {
    if (!customerName.trim()) {
      toast.error('Informe o nome do cliente.')
      return
    }
    const lines = Object.entries(qty)
      .map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity,
      }))
      .filter((l) => l.quantity > 0)

    if (lines.length === 0) {
      toast.error('Adicione ao menos um item ao pedido.')
      return
    }

    startTransition(async () => {
      try {
        await createOrder({ customerName, tableLabel, notes, lines })
        toast.success('Pedido aberto com sucesso!')
        setCustomerName('')
        setTableLabel('')
        setNotes('')
        setQty({})
        onDone()
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : 'Não foi possível abrir o pedido.',
        )
      }
    })
  }

  return (
    <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-lg">
      <DialogHeader className="border-b border-border p-6 pb-4">
        <DialogTitle className="font-display text-2xl font-800">
          Novo pedido
        </DialogTitle>
        <DialogDescription className="font-sans">
          Monte o pedido escolhendo os itens do cardápio.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customer">Cliente</Label>
            <Input
              id="customer"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nome do cliente"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="table">Mesa / retirada</Label>
            <Input
              id="table"
              value={tableLabel}
              onChange={(e) => setTableLabel(e.target.value)}
              placeholder="Ex.: Mesa 4"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Itens do cardápio</Label>
          {products.length === 0 ? (
            <p className="rounded-xl bg-secondary px-4 py-6 text-center font-sans text-sm text-muted-foreground">
              Nenhum produto disponível. Cadastre itens em Produtos / cardápio.
            </p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border p-2">
              {products.map((p) => {
                const count = qty[p.id] ?? 0
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-secondary/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-semibold text-foreground">
                        {p.name}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground">
                        {formatBRL(p.price)} · {p.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Remover um ${p.name}`}
                        onClick={() => setProductQty(p.id, -1)}
                        disabled={count === 0}
                        className="h-8 w-8 rounded-lg bg-transparent"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-6 text-center font-display text-sm font-700 tabular-nums">
                        {count}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Adicionar um ${p.name}`}
                        onClick={() => setProductQty(p.id, 1)}
                        className="h-8 w-8 rounded-lg bg-transparent"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex.: sem açúcar, leite vegetal…"
            className="rounded-xl"
            rows={2}
          />
        </div>
      </div>

      <DialogFooter className="flex-row items-center justify-between gap-3 border-t border-border bg-secondary/40 p-6">
        <div className="font-sans text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'itens'} ·{' '}
          <span className="font-display text-lg font-800 text-foreground">
            {formatBRL(total)}
          </span>
        </div>
        <Button
          onClick={submit}
          disabled={isPending}
          className="h-11 rounded-xl font-display text-base font-700"
        >
          Abrir pedido
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
