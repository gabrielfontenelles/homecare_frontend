"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { DashboardService, type DashboardStats } from "@/services/dashboard-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface VisitData {
  data: string
  count: number
}

export function DashboardCharts() {
  const [data, setData] = useState<VisitData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const dashboardData = await DashboardService.getStats()
        setData(
          dashboardData.visitasUltimos30Dias.map((item: any) => ({
            data: item.dia,
            count: item.visitas,
          }))
        )
      } catch (err) {
        console.error("Erro ao carregar dados de visitas:", err)
        setError("Não foi possível carregar os dados de visitas. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchData()
    }
  }, [mounted])

  if (!mounted || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visitas nos Últimos 30 Dias</CardTitle>
          <CardDescription>Acompanhe o número de visitas realizadas diariamente</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <Skeleton className="w-full h-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visitas nos Últimos 30 Dias</CardTitle>
          <CardDescription>Acompanhe o número de visitas realizadas diariamente</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitas nos Últimos 30 Dias</CardTitle>
        <CardDescription>Acompanhe o número de visitas realizadas diariamente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="data" className="text-xs" tickFormatter={(value) => `${value}`} />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value) => [`${value} visitas`, "Total"]}
                labelFormatter={(value) => `Dia ${value}`}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} className="fill-green-500" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
