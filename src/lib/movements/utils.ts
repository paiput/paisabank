import { TransactionType } from "@prisma/client"

const movementTypeFilterLabels: Record<TransactionType, string> = {
  [TransactionType.CASH_IN]: "Ingreso",
  [TransactionType.CASH_OUT]: "Egreso",
  [TransactionType.SUS]: "Suscripción",
}

export const movementTypeFilterOptions: {
  label: string
  value: TransactionType | "ALL"
  defaultChecked?: boolean
}[] = [
  {
    defaultChecked: true,
    label: "Todos",
    value: "ALL",
  },
  ...Object.values(TransactionType).map((type) => ({
    label: movementTypeFilterLabels[type],
    value: type,
  })),
]
