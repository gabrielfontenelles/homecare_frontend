"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PatientsService } from "@/services/patients-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"

const statusOptions = ["ATIVO", "INATIVO", "EM_PAUSA"]
const specialtyOptions = ["Cuidados Gerais", "Fisioterapia", "Enfermagem", "Acompanhamento Médico"]
const frequencyOptions = ["Diária", "Semanal", "Mensal", "Sob demanda"]

function validateName(name: string) {
  const words = name.trim().split(" ")
  return words.length >= 2 && /^[A-Za-zÀ-ÿ'\- ]+$/.test(name)
}

function validatePhone(phone: string) {
  
  return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(phone)
}

function formatPhone(phone: string) {
  phone = phone.replace(/\D/g, "");
  if (phone.length <= 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, "");
  } else {
    return phone.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, "");
  }
}

function formatCPF(cpf: string) {
  return cpf.replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
}

function formatCEP(cep: string) {
  return cep.replace(/\D/g, "").replace(/(\d{5})(\d{0,3})/, "$1-$2").slice(0, 9);
}

export default function NovoPacientePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nome: "",
    dataNascimento: "",
    cpf: "",
    rg: "",
    telefone: "",
    email: "",
    endereco: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    nomeResponsavel: "",
    telefoneResponsavel: "",
    observacoes: "",
    status: "ATIVO"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value = e.target.value;
    if (e.target.name === "telefone" || e.target.name === "telefoneResponsavel") value = formatPhone(value);
    if (e.target.name === "cpf") value = formatCPF(value);
    if (e.target.name === "cep") value = formatCEP(value);
    setForm({ ...form, [e.target.name]: value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  }

  const validate = () => {
    const errors: {[key: string]: string} = {}
    if (!form.nome || form.nome.trim().length < 5) {
      errors.nome = "Digite o nome completo (mínimo 5 caracteres)."
    }
    if (!form.dataNascimento) {
      errors.dataNascimento = "Data de nascimento é obrigatória."
    }
    if (!form.cpf || form.cpf.length !== 11 || !/^[0-9]{11}$/.test(form.cpf)) {
      errors.cpf = "Digite um CPF válido (apenas números, 11 dígitos)."
    }
    if (!form.telefone || form.telefone.length < 10) {
      errors.telefone = "Telefone é obrigatório."
    }
    if (!form.endereco || form.endereco.length < 10) {
      errors.endereco = "Endereço deve ter pelo menos 10 caracteres."
    }
    if (!form.status) {
      errors.status = "Selecione o status."
    }
    if (!form.nomeResponsavel || form.nomeResponsavel.trim().length < 3) {
      errors.nomeResponsavel = "Nome do responsável é obrigatório."
    }
    if (!form.telefoneResponsavel || form.telefoneResponsavel.length < 10) {
      errors.telefoneResponsavel = "Telefone do responsável é obrigatório."
    }
    
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
      await PatientsService.create({
        ...form
      })
      router.push("/dashboard/pacientes")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erro ao cadastrar paciente. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Função para buscar endereço pelo CEP
  const fetchAddressByCep = async (cep: string) => {
    if (cep.length !== 8) return
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      const data = response.data
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: data.logradouro || prev.endereco,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
          complemento: data.complemento || prev.complemento,
        }))
      }
    } catch (e) {
      
    }
  }

  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Novo Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-2 mb-2 bg-red-100 text-red-700 border border-red-300 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} required />
              {fieldErrors.nome && <div className="text-red-600 text-sm mt-1">{fieldErrors.nome}</div>}
            </div>
            <div>
              <Input name="dataNascimento" type="date" placeholder="Data de nascimento" value={form.dataNascimento} onChange={handleChange} required />
              {fieldErrors.dataNascimento && <div className="text-red-600 text-sm mt-1">{fieldErrors.dataNascimento}</div>}
            </div>
            <div>
              <Input name="cpf" placeholder="CPF (apenas números)" value={form.cpf} onChange={handleChange} required maxLength={11} />
              {fieldErrors.cpf && <div className="text-red-600 text-sm mt-1">{fieldErrors.cpf}</div>}
            </div>
            <div>
              <Input name="rg" placeholder="RG" value={form.rg} onChange={handleChange} />
            </div>
            <div>
              <Input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required />
              {fieldErrors.telefone && <div className="text-red-600 text-sm mt-1">{fieldErrors.telefone}</div>}
            </div>
            <div>
              <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <Input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} required />
              {fieldErrors.endereco && <div className="text-red-600 text-sm mt-1">{fieldErrors.endereco}</div>}
            </div>
            <div>
              <Input name="complemento" placeholder="Complemento" value={form.complemento} onChange={handleChange} />
            </div>
            <div>
              <Input name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} />
            </div>
            <div>
              <Input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} />
            </div>
            <div>
              <Input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} />
            </div>
            <div>
              <Input name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} onBlur={e => fetchAddressByCep(e.target.value.replace(/\D/g, ""))} maxLength={8} />
            </div>
            <div>
              <Input name="nomeResponsavel" placeholder="Nome do responsável" value={form.nomeResponsavel} onChange={handleChange} required />
              {fieldErrors.nomeResponsavel && <div className="text-red-600 text-sm mt-1">{fieldErrors.nomeResponsavel}</div>}
            </div>
            <div>
              <Input name="telefoneResponsavel" placeholder="Telefone do responsável" value={form.telefoneResponsavel} onChange={handleChange} required />
              {fieldErrors.telefoneResponsavel && <div className="text-red-600 text-sm mt-1">{fieldErrors.telefoneResponsavel}</div>}
            </div>
            <div>
              <Input name="observacoes" placeholder="Observações" value={form.observacoes} onChange={handleChange} />
            </div>
            <div>
              <select name="status" value={form.status} onChange={handleChange} required className="w-full border rounded px-3 py-2">
                <option value="">Status</option>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="EM_PAUSA">Em Pausa</option>
              </select>
              {fieldErrors.status && <div className="text-red-600 text-sm mt-1">{fieldErrors.status}</div>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 