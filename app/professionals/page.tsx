"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ProfessionalsService, type Professional } from "@/services/professionals-service"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function ProfessionalsPage() {
  const { toast } = useToast()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfessionals()
  }, [])

  const loadProfessionals = async () => {
    try {
      const data = await ProfessionalsService.getAll()
      setProfessionals(data)
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar a lista de profissionais.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este profissional?")) {
      return
    }

    try {
      await ProfessionalsService.delete(id)
      toast({
        title: "Profissional excluído",
        description: "O profissional foi excluído com sucesso.",
      })
      loadProfessionals()
    } catch (error) {
      console.error("Erro ao excluir profissional:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o profissional.",
      })
    }
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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profissionais</h1>
          <Link href="/professionals/new">
            <Button className="bg-green-600 hover:bg-green-700" type="button">
              Novo Profissional
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especialidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {professionals.map((professional) => (
                <tr key={professional.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{professional.nome}</div>
                    <div className="text-sm text-gray-500">{professional.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{professional.especialidade}</div>
                    <div className="text-sm text-gray-500">{professional.registroProfissional}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        professional.status === "DISPONIVEL"
                          ? "bg-green-100 text-green-800"
                          : professional.status === "EM_ATENDIMENTO"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {professional.status === "DISPONIVEL"
                        ? "Disponível"
                        : professional.status === "EM_ATENDIMENTO"
                        ? "Em Atendimento"
                        : "Folga"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/professionals/${professional.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        type="button"
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => handleDelete(professional.id)}
                    >
                      Excluir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 