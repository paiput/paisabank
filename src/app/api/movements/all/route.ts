import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/api-middleware"
import { TransactionType, Currency, Issuer } from "@prisma/client"
import { prisma } from "@/prisma/client"

export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const type = searchParams.get("type") as TransactionType | null
    const currency = searchParams.get("currency") as Currency | null
    const issuer = searchParams.get("issuer") as Issuer | null
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const movements = await prisma.transaction.findMany({
      where: {
        card: {
          userId: session.userId,
          issuer: issuer ?? undefined,
        },
        title: search?.trim() || undefined,
        type: type ?? undefined,
        currency: currency ?? undefined,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: movements,
      pagination: {
        page,
        limit,
        hasMore: movements.length === limit,
      },
    })
  } catch (error) {
    console.error("Error fetching movements:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch movements",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})
