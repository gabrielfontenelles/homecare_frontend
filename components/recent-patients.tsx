"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"

interface RecentPatient {
  id: number
  nome: string
  status: string
}

export function RecentPatients() {
  const [patients, setPatients] = useState<RecentPatient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const response = await api.get("/pacientes/recent")
        setPatients(response.data)
      } catch (err) {
        console.error("Erro ao carregar pacientes recentes:", err)
        setError("Não foi possível carregar os pacientes recentes. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Recentes</CardTitle>
          <CardDescription>Pacientes cadastrados recentemente no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex flex-col space-y-2 p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Recentes</CardTitle>
          <CardDescription>Pacientes cadastrados recentemente no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pacientes Recentes</CardTitle>
        <CardDescription>Pacientes cadastrados recentemente no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient.id} className="flex flex-col space-y-2 p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <span className="font-medium">{patient.nome}</span>
                <Badge variant={patient.status === "ATIVO" ? "default" : "secondary"}>
                  {patient.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
