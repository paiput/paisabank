import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/api-middleware"
import { getMovements } from "@/lib/movements/services"
import { TransactionType, Currency, Issuer } from "@/generated/prisma"

// TODO: Add Schema

export const GET = withAuth(async (request: NextRequest, session) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") as TransactionType | null
    const currency = searchParams.get("currency") as Currency | null
    const issuer = searchParams.get("issuer") as Issuer | null
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const filters: any = {}
    if (type) filters.type = type
    if (currency) filters.currency = currency
    if (issuer) filters.issuer = issuer

    // Add search functionality (search in title)
    if (search.trim()) {
      filters.title = {
        contains: search.trim(),
        mode: "insensitive",
      }
    }

    const movements = await getMovements(session.userId, filters, {
      limit,
      offset: (page - 1) * limit,
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
