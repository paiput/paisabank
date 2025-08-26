import { withAuth } from "@/lib/auth/api-middleware"
import { getMovements } from "@/lib/movements/services"
import { NextRequest, NextResponse } from "next/server"

export const GET = withAuth(async (_request: NextRequest, session) => {
  try {
    const movements = await getMovements(session.userId, {}, { limit: 5 })
    return NextResponse.json({
      success: true,
      data: movements,
      message: "Last movements fetched successfully",
    })
  } catch (error) {
    console.error("Error fetching last movements:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch last movements",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
})
