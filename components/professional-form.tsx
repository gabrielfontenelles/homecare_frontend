"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ProfessionalsService, type Professional, type ProfessionalInput } from "@/services/professionals-service"
import { PROFESSIONAL_SPECIALTIES } from "@/constants/specialties"

const professionalSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().min(11, "CPF deve ter pelo menos 11 caracteres"),
  especialidade: z.string().min(3, "Especialidade deve ter pelo menos 3 caracteres"),
  registroProfissional: z.string().min(3, "Registro profissional inválido"),
  status: z.enum(["DISPONIVEL", "EM_ATENDIMENTO", "FOLGA"]),
})

type ProfessionalFormValues = z.infer<typeof professionalSchema>

interface ProfessionalFormProps {
  professional?: Professional
  onSubmit: (data: ProfessionalInput) => Promise<void>
  onCancel: () => void
}

function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14)
}

function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15)
}

export function ProfessionalForm({ professional, onSubmit, onCancel }: ProfessionalFormProps) {
  const { toast } = useToast()
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      especialidade: "",
      registroProfissional: "",
      status: "DISPONIVEL",
    },
  })

  useEffect(() => {
    if (professional) {
      form.reset({
        nome: professional.nome,
        email: professional.email,
        telefone: professional.telefone,
        cpf: professional.cpf || "",
        especialidade: professional.especialidade,
        registroProfissional: professional.registroProfissional,
        status: professional.status as "DISPONIVEL" | "EM_ATENDIMENTO" | "FOLGA",
      })
    }
  }, [professional, form])

  const handleSubmit = async (data: ProfessionalFormValues) => {
    try {
      await onSubmit(data)
      toast({
        title: professional ? "Profissional atualizado" : "Profissional cadastrado",
        description: professional
          ? "O profissional foi atualizado com sucesso."
          : "O profissional foi cadastrado com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao salvar profissional:", error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o profissional. Tente novamente.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do profissional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(00) 00000-0000"
                    {...field}
                    onChange={e => field.onChange(formatPhone(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    {...field}
                    onChange={e => field.onChange(formatCPF(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="especialidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROFESSIONAL_SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registroProfissional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registro Profissional</FormLabel>
                <FormControl>
                  <Input placeholder="Número do registro profissional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                    <SelectItem value="EM_ATENDIMENTO">Em Atendimento</SelectItem>
                    <SelectItem value="FOLGA">Folga</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            {professional ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 