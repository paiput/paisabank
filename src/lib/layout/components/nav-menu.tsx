"use client"

import { HomeIcon, FileText, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { logout } from "@/lib/auth/services"
import { usePathname } from "next/navigation"
import Image from "next/image"

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

interface NavMenuProps {
  currentPath: string
}

function AsideNavMenu({ currentPath }: NavMenuProps) {
  return (
    <aside className="hidden h-screen w-full max-w-2xs border-r md:fixed md:block">
      <div className="mt-6 flex items-center gap-2 px-6 select-none">
        <Image
          src="/paisabank-logo.svg"
          alt="Logo"
          width={100}
          height={100}
          className="w-10"
        />
        <p className="text-xl font-medium">Paisabank</p>
      </div>
      <nav className="pointer-events-auto space-y-4 p-6">
        {navMenuItems.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={`hover:opacity-80", flex items-center gap-2 transition ${item.href === currentPath && "text-blue-500"}`}
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

function FooterNavMenu({ currentPath }: NavMenuProps) {
  return (
    <footer className="mt-18 md:hidden">
      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full">
        <div className="mx-auto flex h-18 items-center justify-around rounded-t-2xl border bg-white shadow-xl">
          {navMenuItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={`rounded-lg p-4 transition ${item.href === currentPath && "bg-blue-50 text-blue-500"} active:scale-90`}
            >
              <item.icon className="h-6 w-6" />
            </Link>
          ))}
          <button onClick={logout} className="rounded-xl p-4">
            <LogOutIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </footer>
  )
}

export function NavMenuLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="md:flex">
      <AsideNavMenu currentPath={pathname} />
      <div className="w-full md:ml-[18rem]">{children}</div>
      <FooterNavMenu currentPath={pathname} />
    </div>
  )
}
