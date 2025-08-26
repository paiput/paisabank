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

  const narrowSymbolCurrencies: Currency[] = [Currency.ARS, Currency.EUR]

  return new Intl.NumberFormat("es-AR", {
    style: currency ? "currency" : "decimal",
    currency: currency,
    currencyDisplay:
      currency && narrowSymbolCurrencies.includes(currency)
        ? "narrowSymbol"
        : "symbol",
  }).format(amount)
}
