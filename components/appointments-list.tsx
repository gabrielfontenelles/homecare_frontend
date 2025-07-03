"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, PlusIcon, PencilIcon } from "lucide-react"
import { AppointmentsService, type Appointment } from "@/services/appointments-service"
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

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const formattedDate = format(date, "yyyy-MM-dd")
        const data = await AppointmentsService.getByDate(formattedDate)
        setAppointments(data)
      } catch (err) {
        console.error("Erro ao carregar agendamentos:", err)
        setError("Não foi possível carregar os agendamentos. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [date])

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
      <div className="flex justify-between items-center">
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
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/dashboard/agendamentos/nova">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Agendamento
          </Link>
        </Button>
      </div>

      <Card className="flex-1">
        <CardContent className="p-6 h-full">
          {appointments.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nenhum agendamento encontrado para esta data
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {appointment.horaInicio
                        ? format(new Date(`1970-01-01T${appointment.horaInicio}`), "HH:mm")
                        : appointment.horario?.slice(0,5) || ""} - Paciente: {appointment.nomePaciente || `#${appointment.pacienteId}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.nomeProfissional
                        ? `Profissional: ${appointment.nomeProfissional} (${appointment.tipo || ""}${appointment.especialidade ? ` - ${appointment.especialidade}` : ""})`
                        : "Profissional não atribuído"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={appointment.status === "Confirmado" ? "default" : "secondary"}
                      className={appointment.status === "Confirmado" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {appointment.status}
                    </Badge>
                    <Link href={`/dashboard/agendamentos/${appointment.id}/edit`}>
                      <Button size="icon" variant="outline" className="ml-2" title="Editar">
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </Link>
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