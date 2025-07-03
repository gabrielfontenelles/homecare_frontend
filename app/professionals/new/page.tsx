"use client"

import { useRouter } from "next/navigation"
import { ProfessionalsService } from "@/services/professionals-service"
import { ProfessionalForm } from "@/components/professional-form"

export default function NewProfessionalPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    await ProfessionalsService.create(data)
    router.push("/professionals")
  }

  const handleCancel = () => {
    router.push("/professionals")
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Novo Profissional</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <ProfessionalForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
} 