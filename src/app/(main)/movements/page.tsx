import { MovementsFilter } from "@/lib/movements/components/movements-filter"
import { MovementItem } from "@/lib/movements/components/movement"
import { getMovements } from "@/lib/movements/services"
import { getCurrentUser } from "@/lib/auth/services"
import { TransactionType, Currency, Issuer } from "@/generated/prisma"
import { redirect } from "next/navigation"

interface MovementsPageProps {
  searchParams: {
    search?: string
    type?: TransactionType
    currency?: Currency
    issuer?: Issuer
    page?: string
  }
}

export default async function Movements({ searchParams }: MovementsPageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const {
    search: searchParam,
    type,
    currency,
    issuer,
    page: pageParam,
  } = await searchParams

  // Parse search parameters
  const search = searchParam || ""
  const page = parseInt(pageParam || "1")

  const filters: any = {}
  if (type) filters.type = type
  if (currency) filters.currency = currency
  if (issuer) filters.issuer = issuer

  // Add search functionality (search in title)
  if (search.trim()) {
    filters.title = {
      contains: search.trim(),
      mode: "insensitive",
    }
  }

  const movements = await getMovements(user.id, filters, {
    limit: 20,
    offset: (page - 1) * 20,
  })

  return (
    <main className="mx-auto">
      <section className="px-6 pt-6">
        <h2 className="mb-3 text-xl font-semibold">Movimientos</h2>
        <MovementsFilter />
        <div className="space-y-4">
          {movements.length > 0 ? (
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
