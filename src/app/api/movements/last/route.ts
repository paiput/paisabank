import { getSession } from "@/lib/auth/services"
import { getMovements } from "@/lib/movements/services"
import { NextRequest, NextResponse } from "next/server"

// TODO: Add Schema

export async function GET(_request: NextRequest) {
  // TODO: Remove session verification and use auth middleware
  const session = await getSession()

  try {
    const movements = await getMovements(session?.userId ?? 0, {}, { limit: 5 })
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
}
