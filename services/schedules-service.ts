import api from "@/lib/api"
import { format as formatDate } from "date-fns"

export interface Schedule {
  id: number
  profissionalId: number
  pacienteId: number
  nomeProfissional?: string
  nomePaciente?: string
  data: string
  horarioInicio: string
  horarioFim: string
  status: string
  observacoes?: string
}

export interface ScheduleInput {
  profissionalId: number
  pacienteId: number
  data: string
  horarioInicio: string
  horarioFim: string
  status: string
  observacoes?: string
}

function padTime(t: string) {
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
  if (/^\d{2}:\d{2}$/.test(t)) return t + ':00';
  return t;
}

export const SchedulesService = {
  getByDate: async (date: string): Promise<Schedule[]> => {
    try {
      const response = await api.get(`/escalas?data=${date}`)
      const data = Array.isArray(response.data) ? response.data : []
      return data.map((s: any) => ({
        ...s,
        horarioInicio: s.horarioInicio || s.horaInicio || "",
        horarioFim: s.horarioFim || s.horaFim || ""
      }))
    } catch (error) {
      console.error("Error fetching schedules:", error)
      return []
    }
  },

  getByProfessional: async (professionalId: number, startDate?: string, endDate?: string): Promise<Schedule[]> => {
    try {
      let url = `/escalas/profissional/${professionalId}`
      if (startDate) url += `?dataInicio=${startDate}`
      if (endDate) url += `${startDate ? '&' : '?'}dataFim=${endDate}`
      const response = await api.get(url)
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error("Error fetching professional schedules:", error)
      return []
    }
  },

  getById: async (id: number): Promise<Schedule | null> => {
    try {
      const response = await api.get(`/escalas/${id}`)
      const s = response.data
      return {
        ...s,
        horarioInicio: s.horarioInicio || s.horaInicio || "",
        horarioFim: s.horarioFim || s.horaFim || ""
      }
    } catch (error) {
      console.error("Error fetching schedule:", error)
      return null
    }
  },

  create: async (schedule: ScheduleInput): Promise<Schedule | null> => {
    try {
      const formattedSchedule: any = {
        ...schedule,
        horaInicio: padTime(schedule.horarioInicio),
        horaFim: padTime(schedule.horarioFim),
        status: schedule.status.toUpperCase()
        
      }
      delete formattedSchedule.horarioInicio
      delete formattedSchedule.horarioFim
      const response = await api.post("/escalas", formattedSchedule)
      return response.data
    } catch (error) {
      console.error("Error creating schedule:", error)
      throw error
    }
  },

  update: async (id: number, schedule: ScheduleInput): Promise<Schedule | null> => {
    try {
      const formattedSchedule: any = {
        ...schedule,
        data: schedule.data ? formatDate(new Date(schedule.data), "yyyy-MM-dd") : schedule.data,
        horaInicio: padTime(schedule.horarioInicio),
        horaFim: padTime(schedule.horarioFim),
        status: schedule.status.toUpperCase()
      }
      delete formattedSchedule.horarioInicio
      delete formattedSchedule.horarioFim
      const response = await api.put(`/escalas/${id}`, formattedSchedule)
      return response.data
    } catch (error) {
      console.error("Error updating schedule:", error)
      return null
    }
  },

  delete: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/escalas/${id}`)
      return true
    } catch (error) {
      console.error("Error deleting schedule:", error)
      return false
    }
  }
} 