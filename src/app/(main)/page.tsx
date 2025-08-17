"use client"

import { Bell, Search } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/lib/layout/components/ui/carousel"
import { CardComponent } from "@/lib/cards/components/card"
import { useCards } from "@/lib/cards/hooks/useCards"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Transaction } from "@/generated/prisma"
import { MovementItem } from "@/lib/movements/components/movement"

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
    <main className="mx-auto">
      {/* TODO: Move to a layout component */}
      {/* Header */}
      <header className="mb-4 flex items-start justify-between px-6 pt-6">
        <div>
          <p className="text-muted-foreground text-sm">Hola</p>
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
      {loading ? (
        <div className="mb-8 text-center">
          <p className="text-gray-500">Cargando tarjetas...</p>
        </div>
      ) : error ? (
        <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : (
        <Carousel opts={{ align: "center", containScroll: "trimSnaps" }}>
          <CarouselContent className="ml-0">
            {cards.map((card, index) => (
              <CarouselItem
                key={card.id}
                index={index}
                className={`${
                  index === 0
                    ? "basis-5/6 pr-2 pl-6"
                    : index === cards.length - 1
                      ? "basis-4/5 pr-6 pl-2"
                      : "basis-4/5 px-2"
                }`}
              >
                <CardComponent card={card} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}

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
