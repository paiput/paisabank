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

  if (error) {
    return (
      <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="md:w-[calc(100vw-288px-4rem)] md:overflow-hidden">
      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <Carousel opts={{ align: "center", containScroll: "trimSnaps" }}>
          <CarouselContent className="ml-0">
            {loading ? (
              new Array(2).fill(0).map((_, index) => (
                <CarouselItem
                  key={index}
                  index={index}
                  className={`${touchedCard === index && "scale-95"} ${index === 0
                    ? "basis-5/6 pr-2 pl-6"
                    : index === cards.length - 1
                      ? "basis-4/5 pr-6 pl-2"
                      : "basis-4/5 px-2"
                    }`}
                >
                  <div className="aspect-[1.6] w-full max-w-sm animate-pulse bg-gray-200 rounded-3xl" />
                </CarouselItem>
              ))
            ) : (
              cards.map((card, index) => (
                <CarouselItem
                  key={card.id}
                  index={index}
                  onTouchStart={() => {
                    setTouchedCard(index)
                  }}
                  onTouchEnd={() => {
                    setTouchedCard(null)
                  }}
                  className={`${touchedCard === index && "scale-95"} ${index === 0
                    ? "basis-5/6 pr-2 pl-6"
                    : index === cards.length - 1
                      ? "basis-4/5 pr-6 pl-2"
                      : "basis-4/5 px-2"
                    }`}
                >
                  <CardComponent card={card} />
                </CarouselItem>
              )
              ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Desktop: Flex */}
      <div className="hidden overflow-x-scroll md:flex md:gap-6">
        {loading ? (
          <div className="flex-1 flex gap-6">
            <div className="relative aspect-[1.6] w-full max-w-sm animate-pulse bg-gray-200 rounded-3xl" />
            <div className="relative aspect-[1.6] w-full max-w-sm animate-pulse bg-gray-200 rounded-3xl" />
          </div>
        ) : (
          cards.map((card) => (
            <div key={card.id} className="max-w-sm flex-1">
              <CardComponent card={card} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
