"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, PlusIcon } from "lucide-react"
import { SchedulesService, type Schedule } from "@/services/schedules-service"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

function getEffectiveStatus(schedule: {
  status: string,
  data: string,
  horarioFim?: string
}) {
  if (
    (schedule.status === "PENDENTE" || schedule.status === "CONFIRMADO") &&
    schedule.data && schedule.horarioFim
  ) {
    const endDateTime = new Date(`${schedule.data}T${schedule.horarioFim}`)
    if (endDateTime < new Date()) {
      return "REALIZADO"
    }
  }
  return schedule.status
}

export function SchedulesList() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true)
        const formattedDate = format(date, "yyyy-MM-dd")
        const data = await SchedulesService.getByDate(formattedDate)
        setSchedules(data)
      } catch (err) {
        console.error("Erro ao carregar escalas:", err)
        setError("Não foi possível carregar as escalas. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [date])

  const filteredSchedules = statusFilter === "ALL"
    ? schedules
    : schedules.filter(s => (s.status?.toUpperCase() === statusFilter))

  if (loading) {
    return (
      <div className="flex flex-col flex-1 h-full space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Card className="flex-1">
          <CardContent className="p-6 h-full">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b last:border-0">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 h-full">
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              setError(null)
              setDate(new Date())
            }}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 h-full space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[250px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP", { locale: ptBR })
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os status</SelectItem>
            <SelectItem value="PENDENTE">PENDENTE</SelectItem>
            <SelectItem value="ABERTA">ABERTA</SelectItem>
            <SelectItem value="COBERTA">COBERTA</SelectItem>
            <SelectItem value="CANCELADA">CANCELADA</SelectItem>
            <SelectItem value="COMPLETA">COMPLETA</SelectItem>
            <SelectItem value="PARCIAL">PARCIAL</SelectItem>
            <SelectItem value="REALIZADO">REALIZADO</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/dashboard/escalas/nova">
            <PlusIcon className="w-4 h-4 mr-2" />
            Nova Escala
          </Link>
        </Button>
      </div>

      <Card className="flex-1">
        <CardContent className="p-6 h-full">
          {filteredSchedules.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nenhuma escala encontrada para esta data
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {schedule.nomeProfissional ? schedule.nomeProfissional : `Profissional #${schedule.profissionalId}`}
                    </div>
                    {schedule.nomePaciente && (
                      <div className="text-sm text-blue-400 font-semibold">{schedule.nomePaciente}</div>
                    )}
                    <div className="text-xs text-zinc-400">
                      {schedule.data ? schedule.data.split("-").reverse().join("/") : ""}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {schedule.horarioInicio} - {schedule.horarioFim}
                      {schedule.observacoes && (
                        <span className="block text-xs text-zinc-400 mt-1">{schedule.observacoes}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getEffectiveStatus(schedule) === "CONFIRMADO" ? "default" : getEffectiveStatus(schedule) === "REALIZADO" ? "outline" : "secondary"}
                      className={
                        getEffectiveStatus(schedule) === "CONFIRMADO"
                          ? "bg-green-500 hover:bg-green-600"
                          : getEffectiveStatus(schedule) === "REALIZADO"
                          ? "bg-gray-500 text-white border-gray-500"
                          : ""
                      }
                    >
                      {getEffectiveStatus(schedule)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Editar escala"
                    >
                      <Link href={`/dashboard/escalas/${schedule.id}/editar`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" /></svg>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 