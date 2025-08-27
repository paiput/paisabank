"use client"

import { Button } from "@/lib/layout/components/ui/button"
import { Input } from "@/lib/layout/components/ui/input"
import { Label } from "@/lib/layout/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/lib/layout/components/ui/checkbox"
import { useForm } from "react-hook-form"

type LoginFormData = {
  email: string
  password: string
  rememberMe: boolean
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null) // Clear any previous errors

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.message || "Error al iniciar sesión")
      }

      router.push("/")
      // Refresh to update auth state
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      setError(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground/80 text-[15px]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Ingresa tu email"
          className="h-12 rounded-xl bg-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]"
          {...register("email", {
            required: "El email es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido"
            }
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground/80 text-[15px]">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          className="h-12 rounded-xl bg-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]"
          {...register("password", {
            required: "La contraseña es requerida",
            minLength: {
              value: 6,
              message: "La contraseña debe tener al menos 6 caracteres"
            }
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <label className="text-foreground/70 flex items-center gap-3 text-[15px]">
        <Checkbox
          className="size-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
          {...register("rememberMe")}
        />
        <span>Recordarme</span>
      </label>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

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
