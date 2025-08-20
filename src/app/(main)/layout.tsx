import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "@/app/styles/globals.css"
import { Toaster } from "@/lib/layout/components/ui/sonner"
import { NavMenuLayout } from "@/lib/layout/components/nav-menu"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "PaisaBank",
  description: "Una experiencia financiera digital única",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${poppins.className} antialiased`}>
        <NavMenuLayout>{children}</NavMenuLayout>
        <Toaster />
      </body>
    </html>
  )
}
