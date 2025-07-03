"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { setCookie, getCookie, deleteCookie } from "cookies-next"
import api from "@/lib/api"

/
export interface User {
  id: number
  nome: string
  email: string
  telefone?: string
  roles?: string[]
  avatar?: string
}


interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone: string) => Promise<void>
  logout: () => void
  clearError: () => void
  isAuthenticated: boolean
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

 
  useEffect(() => {
    const token = getCookie("auth-token")
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
    setInitialized(true)
  }, [])

  
  useEffect(() => {
    const checkAuth = async () => {
      if (!initialized) return

      const token = getCookie("auth-token")
      if (token) {
        try {
          const response = await api.get("/auth/me")
          setUser(response.data)
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err)
          deleteCookie("auth-token")
          deleteCookie("refresh-token")
          delete api.defaults.headers.common.Authorization
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [initialized])

  
  useEffect(() => {
    if (!loading && initialized) {
      if (!user && pathname?.startsWith("/dashboard")) {
        router.push("/login")
        return
      }

      if (user && (pathname === "/login" || pathname === "/register")) {
        router.push("/dashboard")
        return
      }
    }
  }, [user, loading, initialized, pathname, router])

  
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post("/auth/login", { email, password })
      const { token, refreshToken } = response.data

      if (!token) {
        throw new Error("Token não recebido do servidor")
      }

      
      setCookie("auth-token", token, { maxAge: 60 * 60 * 24 }) // 1 dia
      setCookie("refresh-token", refreshToken, { maxAge: 60 * 60 * 24 * 7 }) // 7 dias

      
      api.defaults.headers.common.Authorization = `Bearer ${token}`

      
      const userResponse = await api.get("/auth/me")
      setUser(userResponse.data)

      setLoading(false)
      router.push("/dashboard")
    } catch (err: any) {
      console.error("Erro no login:", err)
      setError(err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.")
      setLoading(false)
    }
  }

  
  const register = async (name: string, email: string, password: string, phone: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post("/auth/register", { name, email, password, telefone: phone })
      const { token, refreshToken, user: userData } = response.data

      
      setCookie("auth-token", token, { maxAge: 60 * 60 * 24 }) // 1 dia
      setCookie("refresh-token", refreshToken, { maxAge: 60 * 60 * 24 * 7 }) // 7 dias

      
      setUser(userData)

      
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao registrar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  
  const logout = () => {
    deleteCookie("auth-token")
    deleteCookie("refresh-token")
    delete api.defaults.headers.common.Authorization
    setUser(null)
    router.push("/login")
  }

  
  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  }

  if (!initialized) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }

  return context
}
