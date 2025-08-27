"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@prisma/client"

interface UseCardsReturn {
  cards: Card[]
  loading: boolean
  error: string | null
  fetchCards: () => Promise<void>
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
    refreshCards,
  }
}
