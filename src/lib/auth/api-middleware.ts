import { NextRequest, NextResponse } from "next/server"
import { getSession, SessionPayload } from "./services"

/**
 * Higher-order function to wrap API route handlers with authentication
 * Usage: export const GET = withAuth(async (request, session) => { ... })
 */
export function withAuth<T extends any[]>(
  handler: (
    request: NextRequest,
    session: SessionPayload,
    ...args: T
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const session = await getSession()
      if (!session) {
        throw new Error("No valid session found")
      }
      return await handler(request, session, ...args)
    } catch (error) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be authenticated to access this resource",
        },
        { status: 401 },
      )
    }
  }
}
