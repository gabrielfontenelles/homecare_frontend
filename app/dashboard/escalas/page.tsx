import type { Metadata } from "next"
import { SchedulesList } from "@/components/schedules-list"

export const metadata: Metadata = {
  title: "Escalas | HomeCare Coop",
  description: "Gerenciamento de escalas do sistema HomeCare Coop",
}

export default function SchedulesPage() {
  return (
    <div className="flex flex-col flex-1 h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Escalas</h1>
        <p className="text-muted-foreground">Gerencie as escalas dos profissionais</p>
      </div>
      <div className="flex-1 h-full">
        <SchedulesList />
      </div>
    </div>
  )
} 