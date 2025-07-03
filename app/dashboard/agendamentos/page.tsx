import type { Metadata } from "next"
import { AppointmentsList } from "@/components/appointments-list"

export const metadata: Metadata = {
  title: "Agendamentos | HomeCare Coop",
  description: "Gerenciamento de agendamentos do sistema HomeCare Coop",
}

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col flex-1 h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
        <p className="text-muted-foreground">Gerencie os agendamentos da sua cooperativa</p>
      </div>
      <div className="flex-1 h-full">
        <AppointmentsList />
      </div>
    </div>
  )
} 