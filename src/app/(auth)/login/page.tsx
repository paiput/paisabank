import { LoginForm } from "./components/login-form"
import Image from "next/image"

export default function Login() {
  return (
    <div className="flex min-h-svh w-full items-start justify-center bg-[#F6F8FB]">
      <main className="w-full max-w-[420px] px-6 pt-12 pb-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/paisabank-logo.svg"
            alt="PaisaBank"
            width={64}
            height={64}
          />
          <h1 className="text-[34px] leading-[40px] font-semibold tracking-wide text-[#1061FF]">
            PaisaBank
          </h1>
          <p className="text-muted-foreground text-[15px]">
            Comienza a manejar tu vida financiera
          </p>
        </div>

        <LoginForm />
      </main>
    </div>
  )
}
