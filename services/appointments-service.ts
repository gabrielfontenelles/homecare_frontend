import api from "@/lib/api"

export interface Appointment {
  id: number
  pacienteId: number
  profissionalId: number
  data: string
  horario: string
  status: string
  observacoes?: string
  nomePaciente?: string
  nomeProfissional?: string
  tipo?: string
  especialidade?: string
  horaInicio?: string
  horaFim?: string
  modalidade?: string
}

export interface AppointmentInput {
  id?: number
  pacienteId: number
  profissionalId?: number
  nomeProfissional?: string
  data: string
  horario?: string
  status?: string
  horaInicio?: string
  horaFim?: string
  tipo?: string
  modalidade?: string
  especialidade?: string
  observacoes?: string
}

export const AppointmentsService = {
  // Obter agendamentos por data
  getByDate: async (date: string): Promise<Appointment[]> => {
    try {
      const response = await api.get(`/agendamentos?data=${date}`)
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching appointments:", error)
      return []
    }
  },

  // Obter agendamentos de hoje
  getToday: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get("/agendamentos/hoje")
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching today's appointments:", error)
      return []
    }
  },

  // Obter agendamentos por paciente
  getByPatient: async (patientId: number, startDate?: string, endDate?: string): Promise<Appointment[]> => {
    try {
      let url = `/agendamentos/paciente/${patientId}`
      if (startDate) url += `?dataInicio=${startDate}`
      if (endDate) url += `${startDate ? '&' : '?'}dataFim=${endDate}`
      const response = await api.get(url)
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching patient appointments:", error)
      return []
    }
  },

  // Obter agendamentos por profissional
  getByProfessional: async (professionalId: number, startDate?: string, endDate?: string): Promise<Appointment[]> => {
    try {
      let url = `/agendamentos/profissional/${professionalId}`
      if (startDate) url += `?dataInicio=${startDate}`
      if (endDate) url += `${startDate ? '&' : '?'}dataFim=${endDate}`
      const response = await api.get(url)
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching professional appointments:", error)
      return []
    }
  },

  // Obter um agendamento por ID
  getById: async (id: number): Promise<Appointment | null> => {
    try {
      const response = await api.get(`/agendamentos/${id}`)
      return response.data
    } catch (error) {
      console.error("Error fetching appointment:", error)
      return null
    }
  },

  // Criar um novo agendamento
  create: async (appointment: AppointmentInput): Promise<Appointment | null> => {
    try {
      const response = await api.post("/agendamentos", appointment)
      return response.data
    } catch (error) {
      console.error("Error creating appointment:", error)
      return null
    }
  },

  // Atualizar um agendamento
  update: async (id: number, appointment: AppointmentInput): Promise<Appointment | null> => {
    try {
      const response = await api.put(`/agendamentos/${id}`, appointment)
      return response.data
    } catch (error) {
      console.error("Error updating appointment:", error)
      return null
    }
  },

  // Excluir um agendamento
  delete: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/agendamentos/${id}`)
      return true
    } catch (error) {
      console.error("Error deleting appointment:", error)
      return false
    }
  }
} 