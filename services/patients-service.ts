import api from "@/lib/api"

export interface Patient {
  id: number
  nome: string
  dataNascimento: string
  cpf: string
  rg: string
  telefone: string
  email: string
  endereco: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  nomeResponsavel: string
  telefoneResponsavel: string
  observacoes: string
  status: string
  createdAt?: string
  updatedAt?: string
}

export interface PatientInput {
  nome: string
  dataNascimento: string
  cpf: string
  rg: string
  telefone: string
  email: string
  endereco: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  nomeResponsavel: string
  telefoneResponsavel: string
  observacoes: string
  status: string
}

export interface PaginatedPatients {
  content: Patient[]
  totalElements?: number
  totalPages?: number
  number?: number
  size?: number
}

export const PatientsService = {
  getAll: async (): Promise<PaginatedPatients> => {
    try {
      const response = await api.get("/pacientes")
      return response.data
    } catch (error) {
      console.error("Error fetching patients:", error)
      return { content: [] }
    }
  },

  getById: async (id: number): Promise<Patient> => {
    const response = await api.get(`/pacientes/${id}`)
    return response.data
  },

  create: async (patient: PatientInput): Promise<Patient> => {
    const response = await api.post("/pacientes", patient)
    return response.data
  },

  update: async (id: number, patient: PatientInput): Promise<Patient> => {
    const response = await api.put(`/pacientes/${id}`, patient)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/pacientes/${id}`)
  }
}
