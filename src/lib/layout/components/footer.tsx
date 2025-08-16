import { HomeIcon, FileText, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { logout } from "@/lib/auth/services"

export function Footer() {
  return (
    <footer className="mt-[calc(58px+2rem)]">
      <nav className="pointer-events-auto fixed inset-x-0 bottom-3 z-10 mx-auto w-full px-6">
        <div className="mx-auto flex h-14 items-center justify-around rounded-2xl border bg-white shadow-xl">
          <Link href="/" className="rounded-xl p-2">
            <HomeIcon className="h-6 w-6" />
          </Link>
          <Link href="/movements" className="rounded-xl p-2">
            <FileText className="h-6 w-6" />
          </Link>
          <button onClick={logout} className="rounded-xl p-2">
            <LogOutIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </footer>
  )
}
