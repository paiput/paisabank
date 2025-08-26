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
import { useEffect, useState } from "react"
import Link from "next/link"
import { Transaction } from "@prisma/client"
import { MovementItem } from "@/lib/movements/components/movement"
import { CardsCarousel } from "@/lib/cards/components/cards-carousel"
import { Button } from "@/lib/layout/components/ui/button"
import { useLocalStorage } from "usehooks-ts"

export default function Home() {
  const { cards, loading, error } = useCards()

  const [movements, setMovements] = useState<Transaction[]>([])
  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false)

  useEffect(() => {
    const fetchMovements = async () => {
      const response = await fetch("/api/movements/last")
      const data = await response.json()
      setMovements(data.data)
    }
    fetchMovements()
  }, [])

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
        <CardsCarousel cards={cards} loading={loading} error={error} />
      </section>

      <section className="my-4 grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-4 px-6">
        <Button className="min-w-max px-4 py-8" variant="secondary">
          <DownloadIcon className="size-4" />
          Recibir dinero
        </Button>
        <Button className="min-w-max px-4 py-8" variant="secondary">
          <UploadIcon className="size-4" />
          Enviar dinero
        </Button>
      </section>

      {/* Recent movements */}
      <section className="px-6 py-6">
        <h2 className="mb-3 text-xl font-semibold">Últimos movimientos</h2>
        <div className="space-y-4">
          {movements.map((movement) => (
            <MovementItem
              key={movement.id}
              title={movement.title}
              amountText={movement.amount.toString()}
              type={movement.type}
              currency={movement.currency}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
