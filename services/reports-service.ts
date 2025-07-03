import api from "@/lib/api"

export const ReportsService = {
  // Gerar relatório de pacientes
  generatePatientsReport: async (status?: string, format: 'pdf' | 'json' | 'csv' = 'pdf'): Promise<Blob | null> => {
    try {
      const response = await api.get(`/relatorios/pacientes`, {
        params: { status, formato: format },
        responseType: 'blob'
      })
      return new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : format === 'csv' ? 'text/csv' : 'application/json' 
      })
    } catch (error) {
      console.error("Error generating patients report:", error)
      return null
    }
  },

  // Gerar relatório de profissionais
  generateProfessionalsReport: async (
    especialidade?: string, 
    status?: string, 
    format: 'pdf' | 'json' | 'csv' = 'pdf'
  ): Promise<Blob | null> => {
    try {
      const response = await api.get(`/relatorios/profissionais`, {
        params: { especialidade, status, formato: format },
        responseType: 'blob'
      })
      return new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : format === 'csv' ? 'text/csv' : 'application/json' 
      })
    } catch (error) {
      console.error("Error generating professionals report:", error)
      return null
    }
  },

  // Gerar relatório de agendamentos
  generateAppointmentsReport: async (
    dataInicio: string,
    dataFim: string,
    status?: string,
    format: 'pdf' | 'json' | 'csv' = 'pdf'
  ): Promise<Blob | null> => {
    try {
      const response = await api.get(`/relatorios/agendamentos`, {
        params: { dataInicio, dataFim, status, formato: format },
        responseType: 'blob'
      })
      return new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : format === 'csv' ? 'text/csv' : 'application/json' 
      })
    } catch (error) {
      console.error("Error generating appointments report:", error)
      return null
    }
  },

  // Gerar relatório de escalas
  generateSchedulesReport: async (
    mes?: string,
    especialidade?: string,
    format: 'pdf' | 'json' | 'csv' = 'pdf'
  ): Promise<Blob | null> => {
    try {
      const response = await api.get(`/relatorios/escalas`, {
        params: { mes, especialidade, formato: format },
        responseType: 'blob'
      })
      return new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : format === 'csv' ? 'text/csv' : 'application/json' 
      })
    } catch (error) {
      console.error("Error generating schedules report:", error)
      return null
    }
  }
} 