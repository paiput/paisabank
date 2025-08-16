import { NextRequest, NextResponse } from "next/server"
import * as cardService from "@/lib/cards/services"

// TODO: Add Schema

export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from authentication/session
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      )
    }

    const cards = await cardService.getUserCards(parseInt(userId))

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
}
