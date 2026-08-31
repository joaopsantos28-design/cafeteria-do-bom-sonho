import Image from 'next/image'

export function BrandSide() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-primary p-8 text-primary-foreground md:p-12">
      {/* soft decorative saucer rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border-[3px] border-primary-foreground/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full border-[3px] border-primary-foreground/10"
      />

      <div className="relative">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-foreground/10 p-2 ring-1 ring-primary-foreground/15">
          <Image
            src="/gato-cafe.png"
            alt="Gatinho abraçado a uma xícara de café fumegante, mascote da cafeteria"
            width={110}
            height={110}
            className="h-full w-full object-contain drop-shadow-sm"
            priority
          />
        </div>
      </div>

      <div className="relative">
        <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/80">
          Cafeteria do bom sonho
        </p>
        <h1 className="mt-3 font-display text-4xl font-800 leading-[1.05] text-balance md:text-5xl">
          Um cantinho para cuidar do seu café
        </h1>
        <p className="mt-4 max-w-sm font-sans text-base leading-relaxed text-primary-foreground/85">
          Organize os pedidos, produtos e funcionários — com o carinho de quem
          serve o melhor ronronar da cidade.
        </p>
      </div>

      <div className="relative flex items-center gap-2 font-sans text-sm text-primary-foreground/70">
        <span className="inline-block h-2 w-2 rounded-full bg-accent" />
        Feito com carinho para baristas de patinhas
      </div>
    </div>
  )
}
