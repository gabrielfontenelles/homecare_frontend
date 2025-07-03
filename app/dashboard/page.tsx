"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "cookies-next"
import { DashboardCards } from "@/components/dashboard-cards"
import { DashboardCharts } from "@/components/dashboard-charts"
import { RecentPatients } from "@/components/recent-patients"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const token = getCookie("auth-token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.nome || "Usuário"}</h1>
          <p className="text-muted-foreground">Aqui está um resumo das atividades da sua cooperativa</p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => router.push("/dashboard/relatorios")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>
      <DashboardCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>
        <div>
          <RecentPatients />
        </div>
      </div>
    </div>
  )
}