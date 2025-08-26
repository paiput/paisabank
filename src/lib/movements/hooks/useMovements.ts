"use client"

import { useState, useEffect } from "react"
import { TransactionType, Currency, Issuer } from "@prisma/client"

interface MovementFilters {
  search?: string
  type?: TransactionType
  currency?: Currency
  issuer?: Issuer
  page?: number
  limit?: number
}

interface Movement {
  id: number
  title: string
  amount: number
  type: TransactionType
  currency: Currency
  createdAt: Date
}

interface UseMovementsResult {
  movements: Movement[]
  loading: boolean
  error: string | null
  hasMore: boolean
  totalPages: number
}

export function useMovements(
  filters: MovementFilters = {},
): UseMovementsResult {
  const [movements, setMovements] = useState<Movement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchMovements = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (filters.search) params.set("search", filters.search)
        if (filters.type) params.set("type", filters.type)
        if (filters.currency) params.set("currency", filters.currency)
        if (filters.issuer) params.set("issuer", filters.issuer)
        if (filters.page) params.set("page", filters.page.toString())
        if (filters.limit) params.set("limit", filters.limit.toString())

        const response = await fetch(`/api/movements/all?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch movements")
        }

        const data = await response.json()

        if (data.success) {
          setMovements(data.data)
          setHasMore(data.pagination?.hasMore || false)
          setTotalPages(
            Math.ceil((data.pagination?.total || 0) / (filters.limit || 20)),
          )
        } else {
          throw new Error(data.error || "Failed to fetch movements")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Hubo un error")
        setMovements([])
      } finally {
        setLoading(false)
      }
    }

    fetchMovements()
  }, [
    filters.search,
    filters.type,
    filters.currency,
    filters.issuer,
    filters.page,
    filters.limit,
  ])

  return {
    movements,
    loading,
    error,
    hasMore,
    totalPages,
  }
}
