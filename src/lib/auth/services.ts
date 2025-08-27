"use server"

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { redirect } from "next/navigation"

export interface SessionPayload {
  userId: number
  email: string
  iat?: number
  exp?: number
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required")
  }
  return new TextEncoder().encode(secret)
}

// Session duration (7 days)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export async function createSession(
  userId: number,
  email: string,
): Promise<string> {
  const payload = {
    userId,
    email,
  }

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + SESSION_DURATION))
    .sign(getJwtSecret())

  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  ;(await cookies()).set("session", session, {
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  })

  return session
}

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = (await cookies()).get("session")?.value

  if (!sessionCookie) {
    return null
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, getJwtSecret())
    return payload as unknown as SessionPayload
  } catch (error) {
    console.error("Failed to verify session:", error)
    return null
  }
}

export async function logout() {
  ;(await cookies()).delete("session")
  redirect("/login")
}

export async function verifySession(
  sessionToken: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(sessionToken, getJwtSecret())
    return payload as unknown as SessionPayload
  } catch (error) {
    console.error(error)
    return null
  }
}
