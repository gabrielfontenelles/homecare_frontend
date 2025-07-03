"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProfessionalsService, type Professional } from "@/services/professionals-service"
import { ProfessionalForm } from "@/components/professional-form"
import { useToast } from "@/hooks/use-toast"

export default function EditProfessionalPage() {
  const params = useParams();
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
        router.push("/dashboard/profissionais")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProfessional()
    }
  }, [params, router, toast])

  const handleSubmit = async (data: any) => {
    await ProfessionalsService.update(Number(params.id), data)
    router.push("/dashboard/profissionais")
  }

  const handleCancel = () => {
    router.push("/dashboard/profissionais")
  }

  const handleDeactivate = async () => {
    if (!confirm("Tem certeza que deseja desativar este profissional?")) return
    try {
      if (!professional) return
      await ProfessionalsService.update(Number(params.id), {
        nome: professional.nome || "",
        email: professional.email || "",
        telefone: professional.telefone || "",
        cpf: professional.cpf || "",
        especialidade: professional.especialidade || "",
        registroProfissional: professional.registroProfissional || "",
        status: "INATIVO"
      })
      router.push("/dashboard/profissionais")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao desativar profissional."
      })
    }
  }

  const handleReactivate = async () => {
    try {
      await ProfessionalsService.reativar(Number(params.id))
      router.push("/dashboard/profissionais")
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao reativar profissional."
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-background dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
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
        <div className="bg-background dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
          <ProfessionalForm
            professional={professional}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
          <div className="flex justify-end mt-4">
            {professional.status === "INATIVO" ? (
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                onClick={handleReactivate}
              >
                Ativar Profissional
              </button>
            ) : (
              <button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                onClick={handleDeactivate}
              >
                Desativar Profissional
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 