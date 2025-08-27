import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/api-middleware"
import { prisma } from "@/prisma/client"
import { Currency, TransactionType } from "@prisma/client"
import { z } from "zod"

const transferSchema = z.object({
  recipientIdentifier: z.string().min(1),
  recipientAccountType: z.enum(["alias", "cbu"]),
  amount: z.number().positive(),
  currency: z.nativeEnum(Currency),
  cardId: z.number().int().positive(),
})

export const POST = withAuth(async (request: NextRequest, session) => {
  try {
    const body = await request.json()
    const validationResult = transferSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validationResult.error.issues },
        { status: 400 },
      )
    }

    const {
      recipientIdentifier,
      recipientAccountType,
      amount,
      currency,
      cardId,
    } = validationResult.data

    // Verify the card belongs to the user and has sufficient balance
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId: session.userId,
        currency: currency,
      },
    })

    if (!card) {
      return NextResponse.json(
        { message: "Card not found or does not belong to user" },
        { status: 404 },
      )
    }

    if (Number(card.balance) < amount) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 },
      )
    }

    const newBalance = Number(card.balance) - amount

    const result = await prisma.$transaction(async (tx) => {
      // Update card balance
      const updatedCard = await tx.card.update({
        where: { id: cardId },
        data: { balance: newBalance },
      })

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          title: `${recipientAccountType === "cbu" ? "Transferencia" : recipientIdentifier}`,
          amount,
          currency: currency,
          type: TransactionType.CASH_OUT,
          cardId: cardId,
        },
      })

      return { updatedCard, transaction }
    })

    return NextResponse.json({
      message: "Transfer completed successfully",
      data: {
        transactionId: result.transaction.id,
        newBalance: Number(result.updatedCard.balance),
        amount: amount,
        currency: currency,
        recipient: {
          identifier: recipientIdentifier,
          type: recipientAccountType,
        },
      },
    })
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
})
