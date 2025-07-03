import api from "@/lib/api"

export interface Professional {
  id: number
  nome: string
  email: string
  telefone: string
  cpf: string | null
  especialidade: string
  registroProfissional: string
  status: string
  userId: number | null
  createdAt: string
  updatedAt: string | null
  user: any | null
  escalas: any | null
  agendamentos: any | null
}

export interface ProfessionalInput {
  nome: string
  email: string
  telefone: string
  cpf?: string
  especialidade: string
  registroProfissional: string
  status: string
}

export const ProfessionalsService = {
  getAll: async (): Promise<Professional[]> => {
    try {
      const response = await api.get("/profissionais")
      console.log("Resposta da API:", response.data)
      return Array.isArray(response.data.content) ? response.data.content : []
    } catch (error) {
      console.error("Error fetching professionals:", error)
      return []
    }
  },

  getById: async (id: number): Promise<Professional> => {
    const response = await api.get(`/profissionais/${id}`)
    return response.data
  },

  create: async (professional: ProfessionalInput): Promise<Professional> => {
    const response = await api.post("/profissionais", professional)
    return response.data
  },

  update: async (id: number, professional: ProfessionalInput): Promise<Professional> => {
    const response = await api.put(`/profissionais/${id}`, professional)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/profissionais/${id}`)
  },

  getAvailable: async (): Promise<Professional[]> => {
    try {
      const response = await api.get("/profissionais/available")
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching available professionals:", error)
      return []
    }
  },

  reativar: async (id: number): Promise<void> => {
    await api.put(`/profissionais/${id}/reativar`)
  },
}
