import { Currency } from "@/generated/prisma"
import { Decimal } from "@/generated/prisma/runtime/index-browser"

export function formatMoneyAmount(
  amount: number | string | Decimal,
  { currency }: { currency?: Currency } = {},
) {
  if (typeof amount === "string" || amount instanceof Decimal) {
    amount = Number(amount)
    if (isNaN(amount)) {
      throw new Error("Invalid amount")
    }
  }

  return new Intl.NumberFormat("es-AR", {
    style: currency ? "currency" : "decimal",
    currency: currency,
  }).format(amount)
}
