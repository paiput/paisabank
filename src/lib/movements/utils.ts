import { TransactionType } from "@/generated/prisma"

export const movementTypeFilterLabels: Record<TransactionType, string> = {
  [TransactionType.CASH_IN]: "Ingreso",
  [TransactionType.CASH_OUT]: "Egreso",
  [TransactionType.SUS]: "Suscripción",
}

export const movementTypeFilterOptions: {
  label: string
  value: TransactionType | null
}[] = [
  {
    label: "Todos",
    value: null,
  },
  ...Object.values(TransactionType).map((type) => ({
    label: movementTypeFilterLabels[type],
    value: type,
  })),
]
