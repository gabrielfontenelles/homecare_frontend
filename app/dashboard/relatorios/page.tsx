import type { Metadata } from "next"
import { ReportsList } from "@/components/reports-list"

export const metadata: Metadata = {
  title: "Relatórios | HomeCare Coop",
  description: "Relatórios do sistema HomeCare Coop",
}

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">Gere relatórios sobre pacientes, profissionais e agendamentos</p>
      </div>
      <div className="flex-1">
        <ReportsList />
      </div>
    </div>
  )
} 