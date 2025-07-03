"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { SchedulesService } from "@/services/schedules-service"
import { ProfessionalsService, type Professional } from "@/services/professionals-service"
import { PatientsService, type Patient } from "@/services/patients-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PROFESSIONAL_SPECIALTIES } from "@/constants/specialties"
import { format } from "date-fns"

const statusOptions = ["ABERTA", "COBERTA", "CANCELADA", "COMPLETA", "PARCIAL"]

export default function EditarEscalaPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [form, setForm] = useState({
    profissionalId: "",
    pacienteId: "",
    data: "",
    horarioInicio: "",
    horarioFim: "",
    status: "",
    observacoes: ""
  })
  const [tecnicos, setTecnicos] = useState<Professional[]>([])
  const [pacientes, setPacientes] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const all = await ProfessionalsService.getAll()
        setTecnicos(all.filter(p => p.especialidade === "Técnico de Enfermagem"))

       
        const allPacientes = await PatientsService.getAll()
        setPacientes(allPacientes.content || [])

        
        const escala = await SchedulesService.getById(Number(id))
        if (!escala) {
          setError("Escala não encontrada")
          return
        }

        setForm({
          profissionalId: escala.profissionalId?.toString() || "",
          pacienteId: escala.pacienteId?.toString() || "",
          data: escala.data ? format(new Date(escala.data), "yyyy-MM-dd") : "",
          horarioInicio: escala.horarioInicio || "",
          horarioFim: escala.horarioFim || "",
          status: escala.status || "",
          observacoes: escala.observacoes || ""
        })
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError("Erro ao carregar dados da escala")
      }
    }
    if (id) fetchData()
  }, [id])

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

      const updated = await SchedulesService.update(Number(id), {
        profissionalId: Number(form.profissionalId),
        pacienteId: Number(form.pacienteId),
        data: form.data,
        horarioInicio: form.horarioInicio,
        horarioFim: form.horarioFim,
        status: form.status,
        observacoes: form.observacoes
      })

      if (!updated) {
        setError("Erro ao atualizar escala. Verifique se já existe uma escala para este profissional nesta data e horário.")
        setLoading(false)
        return
      }

      
      router.push(`/dashboard/escalas?data=${form.data}`)
    } catch (err: any) {
      if (err?.response?.status === 500) {
        setError("Erro ao atualizar escala. Verifique se já existe uma escala para este profissional nesta data e horário.")
      } else {
        const errorMessage = err?.response?.data?.message || "Erro ao atualizar escala. Tente novamente."
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center">
      <Card className="w-full max-w-2xl bg-background dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()} title="Voltar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Button>
            <CardTitle>Editar Escala</CardTitle>
          </div>
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
            <Button type="button" variant="outline" className="w-full mt-2" onClick={() => router.push(`/dashboard/escalas?data=${form.data}`)}>
              Cancelar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 