"use client"

import type * as React from "react"
import { useState } from "react"
import { format as formatDate } from "date-fns"
import { isBefore } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Download, Loader2, Users, ClipboardList, LayoutGrid, Calendar } from "lucide-react"
import { ReportsService } from "@/services/reports-service"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type ReportType = "patients" | "professionals" | "appointments" | "schedules"
type ReportFormat = "pdf" | "json" | "csv"

export function ReportsList(): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [loadingType, setLoadingType] = useState<string>("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date)
    if (date && endDate && isBefore(endDate, date)) {
      setEndDate(undefined)
      toast({
        variant: "destructive",
        title: "Data inválida",
        description: "A data final não pode ser anterior à data inicial.",
      })
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date && startDate && isBefore(date, startDate)) {
      toast({
        variant: "destructive",
        title: "Data inválida",
        description: "A data final não pode ser anterior à data inicial.",
      })
      return
    }
    setEndDate(date)
  }

  const handleGenerateReport = async (type: ReportType, format: ReportFormat) => {
    try {
      setLoading(true)
      setLoadingType(`${type}-${format}`)
      let report: Blob | null = null

      switch (type) {
        case "patients":
          report = await ReportsService.generatePatientsReport(undefined, format)
          break
        case "professionals":
          report = await ReportsService.generateProfessionalsReport(undefined, undefined, format)
          break
        case "schedules":
          report = await ReportsService.generateSchedulesReport(undefined, undefined, format)
          break
        case "appointments":
          if (!startDate || !endDate) {
            toast({
              variant: "destructive",
              title: "Erro ao gerar relatório",
              description: "Selecione o período para gerar o relatório de agendamentos.",
            })
            return
          }
          report = await ReportsService.generateAppointmentsReport(
            formatDate(startDate, "yyyy-MM-dd"),
            formatDate(endDate, "yyyy-MM-dd"),
            undefined,
            format,
          )
          break
      }

      if (report) {
        const url = URL.createObjectURL(report)
        const a = document.createElement("a")
        a.href = url
        a.download = `relatorio_${type}_${formatDate(new Date(), "dd-MM-yyyy")}.${format}`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Relatório gerado com sucesso",
          description: "O download do relatório começará automaticamente.",
        })
      } else {
        throw new Error("Não foi possível gerar o relatório")
      }
    } catch (err) {
      console.error("Erro ao gerar relatório:", err)
      toast({
        variant: "destructive",
        title: "Erro ao gerar relatório",
        description: "Não foi possível gerar o relatório. Tente novamente mais tarde.",
      })
    } finally {
      setLoading(false)
      setLoadingType("")
    }
  }

  const isButtonLoading = (type: ReportType, format: ReportFormat) => {
    return loading && loadingType === `${type}-${format}`
  }

  return (
    <div className="h-full flex items-start justify-center">
      <div className="w-full max-w-screen-xl grid gap-6 grid-cols-1 md:grid-cols-2 auto-rows-min">
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </span>
              Pacientes
            </CardTitle>
            <CardDescription className="text-muted-foreground">Relatório de pacientes cadastrados</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={loading}
              onClick={() => handleGenerateReport("patients", "csv")}
            >
              {isButtonLoading("patients", "csv") ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              CSV
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={loading}
              onClick={() => handleGenerateReport("patients", "pdf")}
            >
              {isButtonLoading("patients", "pdf") ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-primary" />
              </span>
              Profissionais
            </CardTitle>
            <CardDescription className="text-muted-foreground">Relatório de profissionais cadastrados</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={loading}
              onClick={() => handleGenerateReport("professionals", "csv")}
            >
              {isButtonLoading("professionals", "csv") ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              CSV
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={loading}
              onClick={() => handleGenerateReport("professionals", "pdf")}
            >
              {isButtonLoading("professionals", "pdf") ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <LayoutGrid className="h-4 w-4 text-primary" />
              </span>
              Escalas
            </CardTitle>
            <CardDescription className="text-muted-foreground">Relatório de escalas dos profissionais</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={loading}
              onClick={() => handleGenerateReport("schedules", "csv")}
            >
              {isButtonLoading("schedules", "csv") ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              CSV
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={loading}
              onClick={() => handleGenerateReport("schedules", "pdf")}
            >
              {isButtonLoading("schedules", "pdf") ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <span className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Calendar className="h-4 w-4 text-primary" />
              </span>
              Agendamentos
            </CardTitle>
            <CardDescription className="text-muted-foreground">Relatório de agendamentos por período</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal flex-1",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate, "dd/MM/yyyy") : <span>Data inicial</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateSelect}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal flex-1",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate, "dd/MM/yyyy") : <span>Data final</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateSelect}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => (startDate ? isBefore(date, startDate) : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-[#0a0d14] text-gray-300 hover:bg-[#1a2035] border-[#1a2035]"
                disabled={loading || !startDate || !endDate}
                onClick={() => handleGenerateReport("appointments", "csv")}
              >
                {isButtonLoading("appointments", "csv") ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                CSV
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading || !startDate || !endDate}
                onClick={() => handleGenerateReport("appointments", "pdf")}
              >
                {isButtonLoading("appointments", "pdf") ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
