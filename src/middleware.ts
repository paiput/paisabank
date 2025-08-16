import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required")
  }
  return new TextEncoder().encode(secret)
}

async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value

  console.log("path:", request.nextUrl.pathname)
  console.log("has session:", !!sessionToken)

  // Allow access to login page when there's no session
  if (request.nextUrl.pathname === "/login") {
    // If user has session and is on login page, redirect to home
    if (sessionToken) {
      const session = await verifySessionToken(sessionToken)
      if (session) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
    // If no session or invalid session, allow access to login page
    return NextResponse.next()
  }

  // For all other routes, require valid session
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Verify the session token
  const session = await verifySessionToken(sessionToken)
  if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("session")
    return response
  }

  return NextResponse.next()
}

// TODO: Review config
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any file with an extension (simple pattern)
     */
    "/((?!api|_next/static|_next/image|favicon.ico)(?![^/]*\\.[^/]+$).*)",
  ],
}
