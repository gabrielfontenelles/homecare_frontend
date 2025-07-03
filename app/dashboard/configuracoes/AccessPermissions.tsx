"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"


const roles = [
  { id: "admin", label: "Admin" },
  { id: "coordenador", label: "Coordenador" },
  { id: "user", label: "Usuário" },
]

const permissions = [
  { id: "ver_pacientes", label: "Ver pacientes" },
  { id: "editar_pacientes", label: "Editar pacientes" },
  { id: "ver_agendamentos", label: "Ver agendamentos" },
  { id: "editar_agendamentos", label: "Editar agendamentos" },
]

export default function AccessPermissions() {
  const [selectedRole, setSelectedRole] = useState("admin")
  const [checked, setChecked] = useState<string[]>(["ver_pacientes", "editar_pacientes", "ver_agendamentos"])

  function handleCheck(permissionId: string) {
    setChecked((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  return (
    <section className="mb-8 p-6 rounded-lg border bg-card">
      <h2 className="text-xl font-bold mb-1">Permissões de acesso</h2>
      <p className="text-muted-foreground mb-4">Defina o que cada papel pode acessar ou editar no sistema.</p>
      <div className="mb-4">
        <label className="font-medium mr-2">Papel:</label>
        <select
          className="border rounded px-2 py-1 bg-background"
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          disabled // Desabilitado para evitar alteração via frontend
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2 mb-4">
        {permissions.map(perm => (
          <label key={perm.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-primary"
              checked={checked.includes(perm.id)}
              onChange={() => handleCheck(perm.id)}
            />
            {perm.label}
          </label>
        ))}
      </div>
      <Button>Salvar permissões</Button>
    </section>
  )
} 