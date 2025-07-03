import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login | HomeCare Coop",
  description: "Faça login no sistema HomeCare Coop",
}

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:flex md:w-1/2 bg-muted relative">
        <Image
          src="/login-banner.jpg"
          alt="Profissional de saúde atendendo paciente"
          fill
          className="object-cover"
          style={{ objectPosition: 'center center' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex flex-col justify-end p-8">
          <h1 className="text-white text-3xl font-bold mb-2">HomeCare Coop</h1>
          <p className="text-white/80 text-lg max-w-md">
            Plataforma para gestão de cooperativas de saúde especializadas em atendimento domiciliar
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo(a) de volta</h2>
            <p className="text-muted-foreground mt-2">Entre com suas credenciais para acessar o sistema</p>
          </div>
          <LoginForm />
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
