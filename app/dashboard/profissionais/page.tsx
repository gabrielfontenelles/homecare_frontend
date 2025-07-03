import type { Metadata } from "next"
import { ProfessionalsList } from "@/components/professionals-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Profissionais | HomeCare Coop",
  description: "Gerenciamento de profissionais do sistema HomeCare Coop",
}

export default function ProfessionalsPage() {
  return (
    <div className="flex flex-col flex-1 h-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profissionais</h1>
        <p className="text-muted-foreground">Gerencie os profissionais cadastrados na sua cooperativa</p>
      </div>
      <div className="flex-1 h-full">
        <ProfessionalsList />
      </div>
    </div>
  )
}
