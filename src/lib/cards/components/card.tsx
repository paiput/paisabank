"use client"

import { Issuer } from "@/generated/prisma"
import { CardResponse } from "@/lib/cards/types"
import { formatMoneyAmount } from "@/lib/core/utils"
import { format } from "date-fns"
import Image from "next/image"

interface CardComponentProps {
  card: CardResponse
}

export function CardComponent({ card }: CardComponentProps) {
  const formatLastDigits = (digits: number) => {
    return `**** **** **** ${digits.toString()}`
  }

  const getCardGradient = (issuer: string) => {
    switch (issuer) {
      case "VISA":
        return "from-blue-600 to-blue-700"
      case "MASTERCARD":
        return "from-red-600 to-red-700"
      default:
        return "from-gray-600 to-gray-700"
    }
  }

  const getIssuerLogo = (issuer: Issuer) => {
    switch (issuer) {
      case Issuer.VISA:
        return <Image src="/logo-visa.svg" alt="VISA" width={32} height={32} />
      case Issuer.MASTERCARD:
        return (
          <Image
            src="/logo-mastercard.svg"
            alt="MASTERCARD"
            width={32}
            height={32}
          />
        )
      default:
        return (
          <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-orange-400 to-rose-500 opacity-90" />
        )
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div
        className={`relative flex aspect-[1.6] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${getCardGradient(card.issuer)} p-4 text-white`}
      >
        <div>
          <div className="flex items-center">
            <p className="text-sm opacity-80">Balance</p>
            <span className="ml-auto">{getIssuerLogo(card.issuer)}</span>
          </div>
          <p className="flex items-center gap-2">
            <span className="rounded-md bg-white/20 px-2 py-1 text-[10px] font-medium">
              {card.currency}
            </span>
            {formatMoneyAmount(card.balance)}
          </p>
        </div>
        <p className="text-lg tracking-widest">
          {formatLastDigits(card.lastDigits)}
        </p>
        <div className="flex items-end justify-between text-xs opacity-90">
          <p className="text-base">Soy Paisanx</p>
          <div className="text-right">
            <p className="opacity-80">Exp. Date</p>
            <p className="font-semibold">
              {format(new Date(card.expDate), "MM/yy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
