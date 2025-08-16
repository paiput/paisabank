"use client"

import { TransactionType } from "@/generated/prisma"
import { Button } from "@/lib/layout/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { movementTypeFilterOptions } from "../utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"

export function MovementsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for the search input
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  )
  const currentType = searchParams.get("type") as TransactionType | null

  // Debounced search function
  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value.trim()) {
      params.set("search", value.trim())
    } else {
      params.delete("search")
    }

    // Reset to first page when searching
    params.delete("page")

    startTransition(() => {
      router.push(`/movements?${params.toString()}`)
    })
  }, 300)

  // Handle search input changes
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)
      debouncedSearch(value)
    },
    [debouncedSearch],
  )

  // Handle filter button clicks
  const handleTypeFilter = useCallback(
    (type: TransactionType | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (type && type !== currentType) {
        params.set("type", type)
      } else {
        params.delete("type")
      }

      // Reset to first page when filtering
      params.delete("page")

      startTransition(() => {
        router.push(`/movements?${params.toString()}`)
      })
    },
    [searchParams, currentType, router],
  )

  // Sync search input with URL params (for back/forward navigation)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || ""
    if (urlSearch !== searchValue) {
      setSearchValue(urlSearch)
    }
  }, [searchParams])

  return (
    <div className="my-4 space-y-4">
      <div className="flex items-center gap-2 rounded-md border border-gray-200 p-4">
        {isPending ? (
          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        ) : (
          <Search className="text-muted-foreground h-4 w-4" />
        )}
        <input
          value={searchValue}
          onChange={handleSearchChange}
          disabled={isPending}
          className="w-full rounded-lg border-none outline-0 focus:border-none focus:outline-none disabled:opacity-50"
          placeholder="Ingresa un nombre o servicio"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {movementTypeFilterOptions.map((filter) => {
          const isActive =
            filter.value === currentType ||
            (filter.value === null && !currentType)

          return (
            <Button
              key={filter.label}
              variant={isActive ? "default" : "outline"}
              onClick={() => handleTypeFilter(filter.value)}
              size="sm"
            >
              {filter.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
