import { useEffect, useState } from "react"
import { getSession, SessionPayload } from "../services"

export function useSession() {
  const [session, setSession] = useState<SessionPayload | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession()
      setSession(session)
    }
    fetchSession()
  }, [])

  return session
}
