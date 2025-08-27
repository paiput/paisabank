"use client"

import {
  BellIcon,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react"
import { useCards } from "@/lib/cards/hooks/useCards"
import Link from "next/link"
import { MovementItem } from "@/lib/movements/components/movement"
import { CardsCarousel } from "@/lib/cards/components/cards-carousel"
import { Button } from "@/lib/layout/components/ui/button"
import { useLocalStorage } from "usehooks-ts"
import { useMovements } from "@/lib/movements/hooks/useMovements"
import { toast } from "sonner"

export default function Home() {
  const { cards, loading: cardsLoading, error: cardsError } = useCards()
  const { movements, loading: movementsLoading } = useMovements({ last: true })

  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false)

  const onBtnClick = () => {
    toast.info("Próximamente disponible 🙂")
  }

  return (
    <main className="mx-auto">
      {/* TODO: Move to a layout component */}
      {/* Header */}
      <header className="mb-4 flex items-start justify-between px-6 pt-6">
        <div>
          <p className="text-muted-foreground text-sm md:text-lg">Hola</p>
          <h1 className="text-2xl font-semibold tracking-tight">Paisanx</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            aria-label="Ver movimientos"
            href="/movements"
            className="rounded-full border bg-white p-2 shadow-sm"
          >
            <SearchIcon className="h-5 w-5" />
          </Link>
          <button
            aria-label="Notificaciones"
            className="rounded-full border bg-white p-2 shadow-sm"
          >
            <BellIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <section className="mt-4 mb-2 flex justify-end px-6">
        <Button
          className="cursor-pointer bg-white shadow-[0_1px_5px_rgba(0,0,0,0.1)] hover:bg-white"
          onClick={() => setHideBalance(!hideBalance)}
        >
          {hideBalance ? (
            <EyeOffIcon className="text-black" />
          ) : (
            <EyeIcon className="text-black" />
          )}
        </Button>
      </section>

      {/* Cards */}
      <section className="md:px-6">
        <CardsCarousel cards={cards} loading={cardsLoading} error={cardsError} />
      </section>

      <section className="my-4 grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4 px-6">
        <Button className="min-w-max px-4 py-8" variant="secondary" onClick={onBtnClick}>
          <DownloadIcon className="size-4" />
          Recibir dinero
        </Button>
        <Button className="min-w-max px-4 py-8" variant="secondary" onClick={onBtnClick}>
          <UploadIcon className="size-4" />
          Enviar dinero
        </Button>
      </section>

      {/* Recent movements */}
      <section className="px-6 py-6">
        <h2 className="mb-3 text-xl font-semibold">Últimos movimientos</h2>
        <div className="space-y-4">
          {movementsLoading ? (
            <>
              {new Array(5).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse rounded-xl bg-gray-200 w-full h-22" />
              ))}
            </>
          ) : (movements.map((movement) => (
            <MovementItem
              key={movement.id}
              title={movement.title}
              amountText={movement.amount.toString()}
              type={movement.type}
              currency={movement.currency}
            />
          )))}
        </div>
      </section>
    </main>
  )
}
