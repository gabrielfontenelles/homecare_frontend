"use client"

import { useRouter } from "next/navigation"
import { ProfessionalsService } from "@/services/professionals-service"
import { ProfessionalForm } from "@/components/professional-form"
import { useState } from "react"

export default function NewProfessionalPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    setError(null)
    try {
      await ProfessionalsService.create(data)
      router.push("/dashboard/profissionais")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao cadastrar profissional. Tente novamente.")
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/profissionais")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Novo Profissional</h1>
        <div className="rounded-lg shadow p-6 bg-background dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          {error && (
            <div className="p-2 mb-2 bg-red-100 text-red-700 border border-red-300 rounded">
              {error}
            </div>
          )}
          <ProfessionalForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
} 