import { Currency } from "@/generated/prisma"

export function formatCurrency(amount: number | string, currency?: Currency) {
  if (typeof amount === "string") {
    amount = Number(amount)
    if (isNaN(amount)) {
      throw new Error("Invalid amount")
    }
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency || "ARS",
  }).format(amount)
}
