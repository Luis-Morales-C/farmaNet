"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "CLIENTE" | "ADMIN" | "FARMACEUTICO"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("[ProtectedRoute] Estado:", {
      isLoading,
      isAuthenticated,
      user: user?.nombre,
      requiredRole,
      hasRole: user?.rol === requiredRole,
    })

    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("[ProtectedRoute] NO AUTENTICADO - Redirigiendo a:", redirectTo)
        router.push(redirectTo)
        return
      }

      if (requiredRole && user?.rol !== requiredRole) {
        console.log("[ProtectedRoute] ROL INCORRECTO - Redirigiendo a: /unauthorized")
        router.push("/unauthorized")
        return
      }

      console.log("[ProtectedRoute] Acceso permitido")
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (requiredRole && user?.rol !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
