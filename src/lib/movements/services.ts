import { Currency, Issuer, TransactionType } from "@/generated/prisma"
import { prisma } from "@/prisma/client"

export async function getMovements(
  userId: number,
  filters: {
    title?: {
      contains?: string
      mode?: "insensitive"
    }
    startDate?: Date
    endDate?: Date
    type?: TransactionType
    currency?: Currency
    issuer?: Issuer
  } = {},
  config: {
    limit?: number
    offset?: number
  } = {},
) {
  return await prisma.transaction.findMany({
    where: {
      card: {
        userId,
      },
      ...filters,
    },
    take: config.limit,
    skip: config.offset,
    orderBy: {
      createdAt: "desc",
    },
  })
}
