"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SchedulesService } from "@/services/schedules-service"
import { ProfessionalsService, type Professional } from "@/services/professionals-service"
import { PatientsService, type Patient } from "@/services/patients-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PROFESSIONAL_SPECIALTIES } from "@/constants/specialties"
import { addDays, format } from "date-fns"

const statusOptions = ["ABERTA", "COBERTA", "CANCELADA", "COMPLETA", "PARCIAL"]

export default function NovaEscalaPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    profissionalId: "",
    pacienteId: "",
    data: "",
    horarioInicio: "",
    horarioFim: "",
    status: "ABERTA",
    observacoes: ""
  })
  const [tecnicos, setTecnicos] = useState<Professional[]>([])
  const [pacientes, setPacientes] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const fetchTecnicos = async () => {
      const all = await ProfessionalsService.getAll()
      setTecnicos(all.filter(p => p.especialidade === "Técnico de Enfermagem"))
    }
    fetchTecnicos()
    // Buscar pacientes
    const fetchPacientes = async () => {
      const all = await PatientsService.getAll()
      setPacientes(all.content || [])
    }
    fetchPacientes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" })
  }

  const validate = () => {
    const errors: {[key: string]: string} = {}
    if (!form.profissionalId) errors.profissionalId = "Selecione o técnico."
    if (!form.pacienteId) errors.pacienteId = "Selecione o paciente."
    if (!form.data) errors.data = "Data é obrigatória."
    if (!form.horarioInicio) errors.horarioInicio = "Horário de início é obrigatório."
    if (!form.horarioFim) errors.horarioFim = "Horário de fim é obrigatório."
    if (!form.status) errors.status = "Status é obrigatório."
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return
    setLoading(true)
    try {
     
      if (form.horarioInicio === form.horarioFim) {
        setError("O horário de início e fim não podem ser iguais")
        setLoading(false)
        return
      }

      
      await SchedulesService.create({
        profissionalId: Number(form.profissionalId),
        pacienteId: Number(form.pacienteId),
        data: form.data,
        horarioInicio: form.horarioInicio,
        horarioFim: form.horarioFim,
        status: form.status,
        observacoes: form.observacoes
      })

     
      const dataAtual = new Date(form.data)
      const proximaData = addDays(dataAtual, 3) 
      
      await SchedulesService.create({
        profissionalId: Number(form.profissionalId),
        pacienteId: Number(form.pacienteId),
        data: format(proximaData, "yyyy-MM-dd"),
        horarioInicio: form.horarioInicio,
        horarioFim: form.horarioFim,
        status: "ABERTA",
        observacoes: "Escala 12x36 gerada automaticamente"
      })

      router.push("/dashboard/escalas")
    } catch (err: any) {
      console.error("Erro ao criar escala:", err)
      const errorMessage = err?.response?.data?.message || "Erro ao cadastrar escala. Tente novamente."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center">
      <Card className="w-full max-w-2xl bg-background dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Nova Escala</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Técnico de Enfermagem</label>
              <select name="profissionalId" value={form.profissionalId} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Selecione o técnico</option>
                {tecnicos.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
              {fieldErrors.profissionalId && <div className="text-red-600 text-sm mt-1">{fieldErrors.profissionalId}</div>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Paciente</label>
              <select name="pacienteId" value={form.pacienteId || ""} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Selecione o paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              {fieldErrors.pacienteId && <div className="text-red-600 text-sm mt-1">{fieldErrors.pacienteId}</div>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Data</label>
              <Input name="data" type="date" value={form.data} onChange={handleChange} required />
              {fieldErrors.data && <div className="text-red-600 text-sm mt-1">{fieldErrors.data}</div>}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Horário de Início</label>
                <Input name="horarioInicio" type="time" value={form.horarioInicio} onChange={handleChange} required />
                {fieldErrors.horarioInicio && <div className="text-red-600 text-sm mt-1">{fieldErrors.horarioInicio}</div>}
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Horário de Fim</label>
                <Input name="horarioFim" type="time" value={form.horarioFim} onChange={handleChange} required />
                {fieldErrors.horarioFim && <div className="text-red-600 text-sm mt-1">{fieldErrors.horarioFim}</div>}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select name="status" value={form.status} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {fieldErrors.status && <div className="text-red-600 text-sm mt-1">{fieldErrors.status}</div>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Observações</label>
              <Input name="observacoes" placeholder="Observações (opcional)" value={form.observacoes} onChange={handleChange} />
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 