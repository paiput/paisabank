import { login } from "@/lib/auth/services"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: validationResult.error.message || "Invalid input",
        },
        { status: 400 },
      )
    }

    const { email, password } = validationResult.data

    const user = await login(email, password)

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Error in login:", error)

    const statusCode =
      error instanceof Error &&
      error.message.includes("Invalid email or password")
        ? 401
        : 500

    return NextResponse.json(
      {
        error: "Login failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: statusCode },
    )
  }
}
