import { Currency } from "@/generated/prisma"

export function formatMoneyAmount(
  amount: number | string,
  { currency }: { currency?: Currency } = {},
) {
  if (typeof amount === "string") {
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
