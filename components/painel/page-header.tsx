import type React from 'react'

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-800 text-foreground text-balance">
          {title}
        </h1>
        <p className="mt-1 font-sans text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  )
}
