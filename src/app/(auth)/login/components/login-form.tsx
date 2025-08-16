"use client"

import { Button } from "@/lib/layout/components/ui/button"
import { Input } from "@/lib/layout/components/ui/input"
import { Label } from "@/lib/layout/components/ui/label"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión")
      }

      toast.success("¡Bienvenido! Iniciando sesión...")

      router.push("/")
      // Refresh to update auth state
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      toast.error(
        error instanceof Error ? error.message : "Error al iniciar sesión",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground/80 text-[15px]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Ingresa tu email"
          className="h-12 rounded-xl bg-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground/80 text-[15px]">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          className="h-12 rounded-xl bg-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]"
        />
      </div>

      <label className="text-foreground/70 flex items-center gap-3 text-[15px]">
        <input
          type="checkbox"
          className="border-input size-5 rounded-md border accent-[#0A5BFF]"
        />
        <span>Recordarme</span>
      </label>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-14 w-full rounded-xl bg-[#0A5BFF] text-[16px] font-semibold text-white shadow-[0_24px_60px_-24px_rgba(10,91,255,0.85)] hover:bg-[#0A5BFF]/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Iniciando sesión..." : "Ingresar"}
      </Button>
    </form>
  )
}
