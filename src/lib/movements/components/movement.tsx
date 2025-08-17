import { Currency, TransactionType } from "@/generated/prisma"
import { Upload, Download, Repeat } from "lucide-react"
import { formatCurrency } from "@/lib/core/utils"

const movementMap = {
  [TransactionType.CASH_IN]: {
    icon: <Upload className="h-5 w-5" />,
    iconClasses: "text-emerald-500 bg-emerald-100",
    subtitle: "Pago recibido",
    amountClasses: "text-green-600",
  },
  [TransactionType.CASH_OUT]: {
    icon: <Download className="h-5 w-5" />,
    iconClasses: "text-orange-500 bg-orange-100",
    subtitle: "Pago enviado",
    amountClasses: "text-red-500",
  },
  [TransactionType.SUS]: {
    icon: <Repeat className="h-5 w-5" />,
    iconClasses: "text-violet-500 bg-violet-100",
    subtitle: "Pago de suscripción",
    amountClasses: "text-red-500",
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
  const { icon, iconClasses, subtitle, amountClasses } = movementMap[type]

  return (
    <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClasses}`}
        >
          {icon}
        </div>
        <div>
          <p className="leading-none font-medium">{title}</p>
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        </div>
      </div>
      <span className={`text-sm font-semibold ${amountClasses}`}>
        {formatCurrency(amountText, currency)}
      </span>
    </div>
  )
}
