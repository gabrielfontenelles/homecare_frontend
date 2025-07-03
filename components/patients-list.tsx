"use client"

import { useEffect, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, SearchIcon } from "lucide-react"
import { PatientsService, type Patient } from "@/services/patients-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function PatientsList() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const { toast } = useToast()
  const router = useRouter();

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const data = await PatientsService.getAll()
      setPatients(data.content || [])
    } catch (err) {
      console.error("Erro ao carregar pacientes:", err)
      setError("Não foi possível carregar os pacientes. Tente novamente mais tarde.")
      toast({
        variant: "destructive",
        title: "Erro ao carregar pacientes",
        description: "Não foi possível carregar a lista de pacientes. Tente novamente mais tarde.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a]
    const bValue = b[sortBy as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
  })

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return null
    return sortDirection === "asc" ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="flex flex-col flex-1 h-full space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-64 lg:w-80">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="flex-1">
          <CardContent className="p-0 h-full">
            <div className="overflow-x-auto h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Frequência</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
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
          <Button variant="outline" className="mt-2" onClick={fetchPatients}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 h-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64 lg:w-80">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar pacientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={() => router.push("/dashboard/pacientes/novo")}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </div>
      <Card className="flex-1">
        <CardContent className="p-0 h-full">
          <div className="overflow-x-auto h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("nome")}>
                    <div className="flex items-center">
                      Nome
                      <SortIcon column="nome" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("dataNascimento")}>
                    <div className="flex items-center">
                      Data de Nascimento
                      <SortIcon column="dataNascimento" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("cpf")}>
                    <div className="flex items-center">
                      CPF
                      <SortIcon column="cpf" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("telefone")}>
                    <div className="flex items-center">
                      Telefone
                      <SortIcon column="telefone" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status
                      <SortIcon column="status" />
                    </div>
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.nome}</TableCell>
                    <TableCell>{new Date(patient.dataNascimento).toLocaleDateString()}</TableCell>
                    <TableCell>{patient.cpf}</TableCell>
                    <TableCell>{patient.telefone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={patient.status === "ATIVO" ? "default" : "outline"}
                        className={patient.status === "ATIVO" ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/pacientes/${patient.id}/editar`)}>
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/pacientes/${patient.id}`)}>
                          Ver
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-[400px]">
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Nenhum paciente encontrado
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
