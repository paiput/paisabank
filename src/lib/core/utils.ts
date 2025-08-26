import { Currency } from "@prisma/client"

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
