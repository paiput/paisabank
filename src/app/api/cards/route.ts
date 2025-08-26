import { NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/api-middleware"
import * as cardService from "@/lib/cards/services"

export const GET = withAuth(async (_request: NextRequest, session) => {
  try {
    const cards = await cardService.getUserCards(session.userId)

    return NextResponse.json({
      success: true,
      data: cards,
    })
  } catch (error) {
    console.error("Error fetching cards:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch cards",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})
