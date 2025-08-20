"use client"

import { MovementsFilter } from "@/lib/movements/components/movements-filter"
import { MovementItem } from "@/lib/movements/components/movement"
import { useMovements } from "@/lib/movements/hooks/useMovements"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { TransactionType } from "@/generated/prisma"

export default function Movements() {
  const [filters, setFilters] = useState<{
    search?: string
    type?: TransactionType
  }>({})

  const { movements, loading, error } = useMovements(filters)

  if (error) {
    return (
      <main className="mx-auto">
        <section className="px-6 pt-6">
          <h2 className="mb-3 text-xl font-semibold">Movimientos</h2>
          <div className="py-8 text-center text-red-500">
            Error al cargar los movimientos: {error}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto">
      <section className="px-6 pt-6">
        <h2 className="mb-3 text-xl font-semibold">Movimientos</h2>
        <MovementsFilter
          onSubmit={(filterData) => {
            setFilters(filterData)
          }}
        />
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Cargando movimientos...</span>
            </div>
          ) : movements.length > 0 ? (
            movements.map((movement) => (
              <MovementItem
                key={movement.id}
                title={movement.title}
                amountText={movement.amount.toString()}
                type={movement.type}
                currency={movement.currency}
              />
            ))
          ) : (
            <p className="py-8 text-center text-gray-500">
              No se encontraron movimientos con los filtros aplicados.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
