import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { RegisterForm } from "@/components/register-form"

export const metadata: Metadata = {
  title: "Registro | HomeCare Coop",
  description: "Crie sua conta no sistema HomeCare Coop",
}

export default function RegisterPage() {
  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:flex md:w-1/2 bg-muted relative">
        <Image
          src="/register-banner.jpg"
          alt="Equipe de profissionais de saúde"
          fill
          className="object-cover"
          style={{ objectPosition: 'center center' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex flex-col justify-end p-8">
          <h1 className="text-white text-3xl font-bold mb-2">HomeCare Coop</h1>
          <p className="text-white/80 text-lg max-w-md">
            Junte-se à nossa plataforma e simplifique a gestão da sua cooperativa de saúde
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Crie sua conta</h2>
            <p className="text-muted-foreground mt-2">Preencha os dados abaixo para se registrar</p>
          </div>
          <RegisterForm />
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
