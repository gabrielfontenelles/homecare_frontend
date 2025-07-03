"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProfessionalsService, type Professional } from "@/services/professionals-service"
import { ProfessionalForm } from "@/components/professional-form"
import { useToast } from "@/hooks/use-toast"

interface EditProfessionalPageProps {
  params: {
    id: string
  }
}

export default function EditProfessionalPage({ params }: EditProfessionalPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfessional = async () => {
      try {
        const data = await ProfessionalsService.getById(Number(params.id))
        setProfessional(data)
      } catch (error) {
        console.error("Erro ao carregar profissional:", error)
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do profissional.",
        })
        router.push("/professionals")
      } finally {
        setLoading(false)
      }
    }

    loadProfessional()
  }, [params.id, router, toast])

  const handleSubmit = async (data: any) => {
    await ProfessionalsService.update(Number(params.id), data)
    router.push("/professionals")
  }

  const handleCancel = () => {
    router.push("/professionals")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!professional) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Profissional</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <ProfessionalForm
            professional={professional}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  )
} 