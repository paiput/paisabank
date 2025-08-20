"use client"

import { Bell, Search } from "lucide-react"
import { useCards } from "@/lib/cards/hooks/useCards"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Transaction } from "@/generated/prisma"
import { MovementItem } from "@/lib/movements/components/movement"
import { AddCardForm } from "@/lib/cards/components/add-card-form"
import { CardsCarousel } from "@/lib/cards/components/cards-carousel"

export default function Home() {
  const { cards, loading, error } = useCards()

  const [movements, setMovements] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchMovements = async () => {
      const response = await fetch("/api/movements/last")
      const data = await response.json()
      setMovements(data.data)
    }
    fetchMovements()
  }, [])

  return (
    <main className="mx-auto border-2">
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
            <Search className="h-5 w-5" />
          </Link>
          <button
            aria-label="Notificaciones"
            className="rounded-full border bg-white p-2 shadow-sm"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Cards */}
      <section className="px-6">
        <CardsCarousel cards={cards} loading={loading} error={error} />
      </section>

      {/* Recent movements */}
      <section className="px-6 pt-6">
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
