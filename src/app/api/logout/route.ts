import { logout } from "@/lib/auth/services"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await logout()

    return NextResponse.json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Error in logout:", error)
    return NextResponse.json(
      {
        error: "Logout failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
