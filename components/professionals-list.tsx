"use client"

import { useEffect, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, SearchIcon } from "lucide-react"
import { ProfessionalsService, type Professional } from "@/services/professionals-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function ProfessionalsList() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("nome")
  const [sortDirection, setSortDirection] = useState("asc")
  const { toast } = useToast()

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      setLoading(true)
      const data = await ProfessionalsService.getAll()
      console.log("Dados recebidos no componente:", data)
      setProfessionals(data)
    } catch (err) {
      console.error("Erro ao carregar profissionais:", err)
      setError("Não foi possível carregar os profissionais. Tente novamente mais tarde.")
      toast({
        variant: "destructive",
        title: "Erro ao carregar profissionais",
        description: "Não foi possível carregar a lista de profissionais. Tente novamente mais tarde.",
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

  const filteredProfessionals = professionals.filter(
    (professional) =>
      professional.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.especialidade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISPONIVEL":
        return <Badge className="bg-green-500 hover:bg-green-600">Disponível</Badge>
      case "EM_ATENDIMENTO":
        return <Badge variant="secondary">Em Atendimento</Badge>
      case "FOLGA":
        return <Badge variant="outline">Folga</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pacientes</TableHead>
                    <TableHead>Contato</TableHead>
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
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-10 w-32" />
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
          <Button variant="outline" className="mt-2" onClick={fetchProfessionals}>
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
            placeholder="Buscar profissionais..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/dashboard/profissionais/novo">
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Profissional
          </Link>
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort("especialidade")}>
                    <div className="flex items-center">
                      Especialidade
                      <SortIcon column="especialidade" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Status
                      <SortIcon column="status" />
                    </div>
                  </TableHead>
                  <TableHead>Pacientes</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProfessionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>{professional.nome}</TableCell>
                    <TableCell>{professional.especialidade}</TableCell>
                    <TableCell>{getStatusBadge(professional.status)}</TableCell>
                    <TableCell>{professional.agendamentos?.length || 0}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{professional.telefone}</span>
                        <span className="text-xs text-muted-foreground">{professional.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/profissionais/${professional.id}/editar`}>
                          Editar
                        </Link>
                      </Button>
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
