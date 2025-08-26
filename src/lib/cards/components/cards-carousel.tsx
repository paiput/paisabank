"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/lib/layout/components/ui/carousel"
import { CardComponent } from "./card"
import { Card } from "@prisma/client"
import { useState } from "react"

export function CardsCarousel({
  cards,
  loading,
  error,
}: {
  cards: Card[]
  loading: boolean
  error: string | null
}) {
  const [touchedCard, setTouchedCard] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="mb-8 text-center">
        <p className="text-gray-500">Cargando tarjetas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <Carousel opts={{ align: "center", containScroll: "trimSnaps" }}>
          <CarouselContent className="ml-0">
            {cards.map((card, index) => (
              <CarouselItem
                key={card.id}
                index={index}
                onTouchStart={() => {
                  setTouchedCard(index)
                }}
                onTouchEnd={() => {
                  setTouchedCard(null)
                }}
                className={`${touchedCard === index && "scale-95"} ${
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
      </div>

      {/* Desktop: Flex */}
      <div className="hidden w-fit overflow-x-scroll md:flex md:gap-6">
        {cards.map((card) => (
          <div key={card.id} className="max-w-sm flex-1">
            <CardComponent card={card} />
          </div>
        ))}
      </div>
    </div>
  )
}
