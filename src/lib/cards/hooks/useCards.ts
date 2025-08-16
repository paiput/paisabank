"use client"

import { useState, useEffect, useCallback } from "react"
import { CardResponse, CreateCardRequest } from "@/lib/cards/types"

interface UseCardsReturn {
  cards: CardResponse[]
  loading: boolean
  error: string | null
  fetchCards: (userId: number) => Promise<void>
  addCard: (
    userId: number,
    cardData: CreateCardRequest,
  ) => Promise<CardResponse | null>
  deleteCard: (cardId: number) => Promise<void>
  refreshCards: () => Promise<void>
}

export function useCards(userId?: number): UseCardsReturn {
  const [cards, setCards] = useState<CardResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | undefined>(userId)

  const fetchCards = useCallback(async (fetchUserId: number) => {
    setLoading(true)
    setError(null)
    setCurrentUserId(fetchUserId)

    try {
      const response = await fetch(`/api/cards?userId=${fetchUserId}`)
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
    async (
      addUserId: number,
      cardData: CreateCardRequest,
    ): Promise<CardResponse | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/cards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: addUserId,
            ...cardData,
          }),
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
    if (currentUserId) {
      await fetchCards(currentUserId)
    }
  }, [currentUserId, fetchCards])

  useEffect(() => {
    if (userId) {
      fetchCards(userId)
    }
  }, [userId, fetchCards])

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
