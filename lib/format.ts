export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function parseBRLToCents(value: string): number {
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const num = Number.parseFloat(normalized)
  if (Number.isNaN(num) || num < 0) return 0
  return Math.round(num * 100)
}

export const ORDER_STATUS = {
  aberto: { label: 'Aberto', tone: 'bg-accent text-accent-foreground' },
  preparo: { label: 'Em preparo', tone: 'bg-primary text-primary-foreground' },
  pronto: { label: 'Pronto', tone: 'bg-secondary text-secondary-foreground' },
  entregue: { label: 'Entregue', tone: 'bg-muted text-muted-foreground' },
} as const

export type OrderStatus = keyof typeof ORDER_STATUS
