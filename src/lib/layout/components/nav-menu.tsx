import { HomeIcon, FileText, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { logout } from "@/lib/auth/services"

const navMenuItems = [
  {
    href: "/",
    label: "Inicio",
    icon: HomeIcon,
  },
  {
    href: "/movements",
    label: "Movimientos",
    icon: FileText,
  },
]

function AsideNavMenu() {
  return (
    <aside className="hidden h-screen w-full max-w-2xs bg-blue-700 text-white md:fixed md:block">
      <nav className="pointer-events-auto space-y-4 p-6">
        {navMenuItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className="flex items-center gap-2 transition hover:opacity-80"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={logout}
          className="flex cursor-pointer items-center gap-2 transition hover:opacity-80"
        >
          <LogOutIcon className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </aside>
  )
}

function FooterNavMenu() {
  return (
    <footer className="mt-[calc(58px+2rem)] md:hidden">
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

export function NavMenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <AsideNavMenu />
      <div className="w-full md:ml-[18rem]">{children}</div>
      <FooterNavMenu />
    </div>
  )
}
