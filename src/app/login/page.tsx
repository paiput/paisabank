import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  return (
    <div className="flex min-h-svh w-full items-start justify-center bg-[#F6F8FB]">
      <main className="w-full max-w-[420px] px-6 pt-12 pb-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-[#0A5BFF] text-white shadow-[0_16px_40px_-16px_rgba(10,91,255,0.75)]">
            {/* Simple placeholder logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
              <path d="M8 10h4a2 2 0 1 1 0 4H8z" />
              <path d="M12 10v4" />
            </svg>
          </span>
          <h1 className="text-[34px] leading-[40px] font-semibold tracking-wide text-[#1061FF]">
            PaisaBank
          </h1>
          <p className="text-muted-foreground text-[15px]">
            Comienza a manejar tu vida financiera
          </p>
        </div>

        <form className="mt-10 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/80 text-[15px]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresa tu email"
              className="h-12 rounded-xl bg-white shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-foreground/80 text-[15px]"
            >
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
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
            className="h-14 w-full rounded-xl bg-[#0A5BFF] text-[16px] font-semibold text-white shadow-[0_24px_60px_-24px_rgba(10,91,255,0.85)] hover:bg-[#0A5BFF]/90"
          >
            Ingresar
          </Button>
        </form>
      </main>
    </div>
  )
}
