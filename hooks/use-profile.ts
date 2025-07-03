"use client"

import { useState } from "react"
import api from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export interface ProfileData {
  nome: string
  email: string
  telefone: string
}

export function useProfile() {
  const { user, setUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = async (data: ProfileData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.put("/users/profile", data)

      // Atualizar o usuário no contexto de autenticação com os dados retornados do backend
      if (user) {
        setUser(response.data)
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })

      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao atualizar o perfil. Tente novamente."
      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: errorMessage,
      })

      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (senhaAtual: string, novaSenha: string) => {
    setLoading(true)
    setError(null)

    try {
      await api.put("/users/me/password", { senhaAtual, novaSenha })

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Erro ao atualizar a senha. Tente novamente."
      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: errorMessage,
      })

      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    updateProfile,
    updatePassword,
    loading,
    error,
  }
}
