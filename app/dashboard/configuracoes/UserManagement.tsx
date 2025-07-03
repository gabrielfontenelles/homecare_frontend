"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"

interface User {
  id: number
  name: string
  email: string
  roles: string[]
}

const ALL_ROLES = [
  { label: "Admin", value: "ADMIN" },
  { label: "Coordenador", value: "COORDENADOR" },
  { label: "Profissional", value: "PROFISSIONAL" },
  { label: "Usuário", value: "USER" },
];

function formatPhone(phone: string) {
  // Remove tudo que não for número
  phone = phone.replace(/\D/g, "");
  if (phone.length <= 10) {
    // (99) 9999-9999
    return phone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, "");
  } else {
    // (99) 99999-9999
    return phone.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, "");
  }
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<number | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        // Ajuste o endpoint conforme seu backend
        const response = await api.get("/users")
        setUsers(response.data)
      } catch (err) {
        setError("Não foi possível carregar os usuários. Tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: number, newRole: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    setSaving(userId)
    try {
      const updatedUser = { ...user, roles: [newRole] }
      await api.put(`/users/${userId}`, updatedUser)
      setUsers(users.map(u => u.id === userId ? { ...u, roles: [newRole] } : u))
    } catch (err) {
      alert("Erro ao atualizar papel do usuário.")
    } finally {
      setSaving(null)
    }
  }

  const handleResetPassword = async (userId: number) => {
    const newPassword = prompt("Digite a nova senha para este usuário:")
    if (!newPassword) return
    setSaving(userId)
    try {
      await api.put(`/users/${userId}`, { password: newPassword })
      alert("Senha redefinida com sucesso!")
    } catch (err) {
      alert("Erro ao redefinir a senha.")
    } finally {
      setSaving(null)
    }
  }

  const handleDeactivateUser = async (userId: number) => {
    if (!window.confirm("Tem certeza que deseja desativar este usuário?")) return
    setSaving(userId)
    try {
      await api.delete(`/users/${userId}`)
      setUsers(users.filter(u => u.id !== userId))
      alert("Usuário desativado com sucesso!")
    } catch (err) {
      alert("Erro ao desativar usuário.")
    } finally {
      setSaving(null)
    }
  }

  const handleInviteUser = async () => {
    const name = prompt("Nome do novo usuário:")
    if (!name) return
    const email = prompt("E-mail do novo usuário:")
    if (!email) return
    const role = prompt("Papel do novo usuário (ADMIN, COORDENADOR, PROFISSIONAL, USER):", "USER")
    if (!role) return
    let phone = prompt("Telefone do novo usuário (apenas números):") || ""
    phone = formatPhone(phone)
    const password = prompt("Senha inicial do novo usuário:")
    if (!password) return
    try {
      await api.post("/auth/register", { name, email, password, roles: [role], telefone: phone })
      alert("Usuário convidado com sucesso!")
      // Atualiza lista
      const response = await api.get("/users")
      setUsers(response.data)
    } catch (err) {
      alert("Erro ao convidar usuário.")
    }
  }

  return (
    <section className="mb-8 p-6 rounded-lg border bg-card">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-bold">Usuários do sistema</h2>
          <p className="text-muted-foreground">Gerencie os usuários cadastrados, convide novos e redefina senhas.</p>
        </div>
        <Button onClick={handleInviteUser}>+ Convidar usuário</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Nome</th>
              <th className="text-left py-2 px-2">E-mail</th>
              <th className="text-left py-2 px-2">Papel</th>
              <th className="text-left py-2 px-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="py-2 px-2"><Skeleton className="h-5 w-32" /></td>
                  <td className="py-2 px-2"><Skeleton className="h-5 w-40" /></td>
                  <td className="py-2 px-2"><Skeleton className="h-5 w-24" /></td>
                  <td className="py-2 px-2"><Skeleton className="h-8 w-24" /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={4} className="text-red-600 py-4 text-center">{error}</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-muted-foreground py-4 text-center">Nenhum usuário encontrado</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-2 px-2">{user.name}</td>
                  <td className="py-2 px-2">{user.email}</td>
                  <td className="py-2 px-2">
                    <select
                      className="bg-background border rounded px-2 py-1"
                      value={user.roles[0] || ''}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                      disabled={saving === user.id}
                    >
                      {ALL_ROLES.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex gap-4">
                      <Button onClick={() => handleResetPassword(user.id)} disabled={saving === user.id}>Resetar senha</Button>
                      <Button variant="destructive" className="ml-2" onClick={() => handleDeactivateUser(user.id)} disabled={saving === user.id}>Desativar</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
} 