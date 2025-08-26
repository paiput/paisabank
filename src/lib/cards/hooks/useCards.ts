"use client"

import { useState, useEffect, useCallback } from "react"
import { CreateCardRequest } from "@/lib/cards/types"
import { Card } from "@prisma/client"

interface UseCardsReturn {
  cards: Card[]
  loading: boolean
  error: string | null
  fetchCards: () => Promise<void>
  addCard: (cardData: CreateCardRequest) => Promise<Card | null>
  deleteCard: (cardId: number) => Promise<void>
  refreshCards: () => Promise<void>
}

export function useCards(): UseCardsReturn {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cards")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch cards")
      }

      setCards(data.data || [])
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Error fetching cards:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const addCard = useCallback(
    async (cardData: CreateCardRequest): Promise<Card | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/cards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cardData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to add card")
        }

        const newCard = data.data
        setCards((prev) => [newCard, ...prev])
        return newCard
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred"
        setError(errorMessage)
        console.error("Error adding card:", err)
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const deleteCard = useCallback(async (cardId: number) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/cards", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete card")
      }

      setCards((prev) => prev.filter((card) => card.id !== cardId))
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Error deleting card:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshCards = useCallback(async () => {
    await fetchCards()
  }, [fetchCards])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  return {
    cards,
    loading,
    error,
    fetchCards,
    addCard,
    deleteCard,
    refreshCards,
  }
}
