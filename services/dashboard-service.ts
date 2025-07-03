import api from "@/lib/api"

export interface DashboardStats {
  totalPacientes: number
  totalVisitas: number
  visitasHoje: number
  visitasUltimos30Dias: {
    data: string
    count: number
  }[]
}

export const DashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/dashboard")
    return {
      totalPacientes: response.data.totalPacientes,
      totalVisitas: response.data.totalVisitas,
      visitasHoje: response.data.visitasHoje,
      visitasUltimos30Dias: response.data.visitasUltimos30Dias
    }
  }
}
