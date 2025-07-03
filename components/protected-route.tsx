"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
      return
    }

    
    if (!loading && isAuthenticated && requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

      if (user && !roles.includes(user.role)) {
        router.push("/dashboard")
      }
    }
  }, [loading, isAuthenticated, user, router, requiredRole])

  // Mostrar nada enquanto verifica autenticação
  if (loading || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
