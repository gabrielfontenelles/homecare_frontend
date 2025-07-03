"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AppointmentsService, AppointmentInput } from "@/services/appointments-service"
import { ProfessionalsService, Professional } from "@/services/professionals-service"
import { PatientsService, Patient } from "@/services/patients-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

const tipos = [
  { value: "MEDICO", label: "Médico" },
  { value: "FISIOTERAPIA", label: "Fisioterapia" },
  { value: "FONOAUDIOLOGIA", label: "Fonoaudiologia" },
  { value: "TERAPIA_OCUPACIONAL", label: "Terapia Ocupacional" },
  { value: "PSICOLOGIA", label: "Psicologia" },
  { value: "NUTRICAO", label: "Nutrição" }
]

const modalidades = [
  { value: "IDA", label: "Ida do paciente ao local" },
  { value: "VISITA", label: "Visita do profissional ao paciente" }
]

const especialidadesMedicas = [
  "Cardiologista", "Geriatra", "Ortopedista", "Clínico Geral", "Neurologista", "Endocrinologista", "Oftalmologista", "Outro"
]
const especialidadesFono = ["Fonoaudiólogo"]
const especialidadesFisio = ["Fisioterapeuta"]
const especialidadesTerapia = ["Terapeuta Ocupacional"]
const especialidadesPsico = ["Psicólogo"]
const especialidadesNutri = ["Nutricionista"]

const statusOptions = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "CANCELADO", label: "Cancelado" },
  { value: "REALIZADO", label: "Realizado" }
]

export default function EditAgendamentoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [form, setForm] = useState<AppointmentInput & { nomeProfissional?: string, status?: string }>({
    pacienteId: 0,
    profissionalId: undefined,
    nomeProfissional: "",
    data: "",
    horaInicio: "",
    horaFim: "",
    tipo: "",
    modalidade: "",
    especialidade: "",
    observacoes: "",
    status: "PENDENTE"
  })
  const [pacientes, setPacientes] = useState<Patient[]>([])
  const [profissionais, setProfissionais] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<any>({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [appointment, pacientesData, profissionaisData] = await Promise.all([
          AppointmentsService.getById(Number(id)),
          PatientsService.getAll().then(r => r.content),
          ProfessionalsService.getAll()
        ])
        if (appointment) {
          setForm({
            pacienteId: appointment.pacienteId,
            profissionalId: appointment.profissionalId,
            nomeProfissional: appointment.nomeProfissional || "",
            data: appointment.data,
            horaInicio: appointment.horaInicio || appointment.horario?.slice(0,5) || "",
            horaFim: appointment.horaFim || "",
            tipo: appointment.tipo || "",
            modalidade: appointment.modalidade || "",
            especialidade: appointment.especialidade || "",
            observacoes: appointment.observacoes || "",
            status: appointment.status || "PENDENTE"
          })
        }
        setPacientes(pacientesData)
        setProfissionais(profissionaisData)
      } catch (err) {
        setError("Erro ao carregar dados do agendamento.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const showEspecialidade = () => {
    return ["MEDICO", "FISIOTERAPIA", "FONOAUDIOLOGIA", "TERAPIA_OCUPACIONAL", "PSICOLOGIA", "NUTRICAO"].includes(form.tipo || "")
  }

  const showProfissional = () => true

  const getEspecialidades = () => {
    switch (form.tipo) {
      case "MEDICO": return especialidadesMedicas
      case "FISIOTERAPIA": return especialidadesFisio
      case "FONOAUDIOLOGIA": return especialidadesFono
      case "TERAPIA_OCUPACIONAL": return especialidadesTerapia
      case "PSICOLOGIA": return especialidadesPsico
      case "NUTRICAO": return especialidadesNutri
      default: return []
    }
  }

  const validate = () => {
    const errors: any = {}
    if (!form.pacienteId) errors.pacienteId = "Paciente obrigatório"
    if (!form.data) errors.data = "Data obrigatória"
    if (!form.horaInicio) errors.horaInicio = "Horário de início obrigatório"
    if (!form.horaFim) errors.horaFim = "Horário de fim obrigatório"
    if (!form.tipo) errors.tipo = "Tipo obrigatório"
    if (!form.modalidade) errors.modalidade = "Modalidade obrigatória"
    if (showEspecialidade() && !form.especialidade) errors.especialidade = "Especialidade obrigatória"
    if (!form.profissionalId && !form.nomeProfissional) errors.nomeProfissional = "Informe o nome do profissional externo."
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
      await AppointmentsService.update(Number(id), {
        id: Number(id),
        pacienteId: Number(form.pacienteId),
        profissionalId: form.profissionalId && form.profissionalId !== "" ? Number(form.profissionalId) : undefined,
        nomeProfissional: !form.profissionalId ? form.nomeProfissional : undefined,
        data: form.data,
        horaInicio: form.horaInicio,
        horaFim: form.horaFim,
        tipo: form.tipo,
        modalidade: form.modalidade,
        especialidade: form.especialidade,
        observacoes: form.observacoes,
        status: form.status
      })
      router.push("/dashboard/agendamentos")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao atualizar agendamento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Carregando...</div>
  }

  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center">
      <Card className="w-full max-w-2xl bg-background dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Editar Agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-2 mb-2 bg-red-100 text-red-700 border border-red-300 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Paciente</label>
              <select name="pacienteId" value={form.pacienteId} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Selecione o paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
              {fieldErrors.pacienteId && <div className="text-red-600 text-sm mt-1">{fieldErrors.pacienteId}</div>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Tipo de Atendimento</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                {tipos.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {fieldErrors.tipo && <div className="text-red-600 text-sm mt-1">{fieldErrors.tipo}</div>}
            </div>
            <div>
              <label className="block mb-1 font-medium">Modalidade</label>
              <select name="modalidade" value={form.modalidade} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                {modalidades.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {fieldErrors.modalidade && <div className="text-red-600 text-sm mt-1">{fieldErrors.modalidade}</div>}
            </div>
            {showEspecialidade() && (
              <div>
                <label className="block mb-1 font-medium">Especialidade</label>
                <select name="especialidade" value={form.especialidade} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                  <option value="">Selecione a especialidade</option>
                  {getEspecialidades().map(espec => (
                    <option key={espec} value={espec}>{espec}</option>
                  ))}
                </select>
                {fieldErrors.especialidade && <div className="text-red-600 text-sm mt-1">{fieldErrors.especialidade}</div>}
              </div>
            )}
            {showProfissional() && (
              <div>
                <label className="block mb-1 font-medium">Profissional</label>
                <select name="profissionalId" value={form.profissionalId || ""} onChange={handleChange} className="w-full border rounded px-3 py-2">
                  <option value="">Profissional externo (digite o nome abaixo)</option>
                  {profissionais.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.especialidade})</option>
                  ))}
                </select>
                {fieldErrors.profissionalId && <div className="text-red-600 text-sm mt-1">{fieldErrors.profissionalId}</div>}
                {!form.profissionalId && (
                  <div className="mt-2">
                    <Input name="nomeProfissional" value={form.nomeProfissional} onChange={handleChange} placeholder="Nome do profissional externo" />
                    {fieldErrors.nomeProfissional && <div className="text-red-600 text-sm mt-1">{fieldErrors.nomeProfissional}</div>}
                  </div>
                )}
              </div>
            )}
            <div>
              <label className="block mb-1 font-medium">Data</label>
              <Input name="data" type="date" value={form.data} onChange={handleChange} required />
              {fieldErrors.data && <div className="text-red-600 text-sm mt-1">{fieldErrors.data}</div>}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Horário de Início</label>
                <Input name="horaInicio" type="time" value={form.horaInicio} onChange={handleChange} required />
                {fieldErrors.horaInicio && <div className="text-red-600 text-sm mt-1">{fieldErrors.horaInicio}</div>}
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Horário de Fim</label>
                <Input name="horaFim" type="time" value={form.horaFim} onChange={handleChange} required />
                {fieldErrors.horaFim && <div className="text-red-600 text-sm mt-1">{fieldErrors.horaFim}</div>}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select name="status" value={form.status} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Observações</label>
              <Input name="observacoes" placeholder="Observações (opcional)" value={form.observacoes} onChange={handleChange} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => router.push("/dashboard/agendamentos")}>Cancelar</Button>
              <Button type="button" variant="destructive" className="w-full" disabled={loading}
                onClick={async () => {
                  if (window.confirm("Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.")) {
                    setLoading(true)
                    setError(null)
                    try {
                      await AppointmentsService.delete(Number(id))
                      router.push("/dashboard/agendamentos")
                    } catch (err) {
                      setError("Erro ao excluir agendamento. Tente novamente.")
                    } finally {
                      setLoading(false)
                    }
                  }
                }}
              >
                Excluir
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 