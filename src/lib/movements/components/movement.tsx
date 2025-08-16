import { Currency, TransactionType } from "@/generated/prisma"
import { Upload, Download, Repeat } from "lucide-react"
import { formatCurrency } from "@/lib/core/utils"

const movementMap = {
  [TransactionType.CASH_IN]: {
    icon: <Upload className="h-5 w-5" />,
    color: "emerald",
    subtitle: "Pago recibido",
  },
  [TransactionType.CASH_OUT]: {
    icon: <Download className="h-5 w-5" />,
    color: "orange",
    subtitle: "Pago enviado",
  },
  [TransactionType.SUS]: {
    icon: <Repeat className="h-5 w-5" />,
    color: "violet",
    subtitle: "Pago de suscripción",
  },
}

export function MovementItem({
  title,
  amountText,
  type,
  currency,
}: {
  title: string
  amountText: string
  type: TransactionType
  currency: Currency
}) {
  const { icon, color, subtitle } = movementMap[type]

  const amountColor = type === TransactionType.CASH_IN ? "green" : "red"

  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-${color}-500 bg-${color}-100`}
        >
          {icon}
        </div>
        <div>
          <p className="leading-none font-medium">{title}</p>
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        </div>
      </div>
      <span className={`text-sm font-semibold text-${amountColor}-500`}>
        {formatCurrency(amountText, currency)}
      </span>
    </div>
  )
}
