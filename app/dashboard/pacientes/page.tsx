import type { Metadata } from "next"
import { PatientsList } from "@/components/patients-list"

export const metadata: Metadata = {
  title: "Pacientes | HomeCare Coop",
  description: "Gerenciamento de pacientes do sistema HomeCare Coop",
}

export default function PatientsPage() {
  return (
    <div className="flex flex-col flex-1 h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
        <p className="text-muted-foreground">Gerencie os pacientes cadastrados na sua cooperativa</p>
      </div>
      <div className="flex-1 h-full">
        <PatientsList />
      </div>
    </div>
  )
}
