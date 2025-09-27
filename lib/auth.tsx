// Authentication utilities and types
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name?: string // Added name field for compatibility
  nombre: string
  apellido: string
  telefono?: string
  direccion?: string
  role?: "admin" | "user" // Added role field for compatibility
  rol: "CLIENTE" | "ADMIN" | "FARMACEUTICO"
  fechaRegistro: string
  activo: boolean
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock authentication functions - replace with actual API calls
export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful login
    const user: User = {
      id: "1",
      email,
      name: "Juan Pérez", // Added name field
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "+1234567890",
      role: email.includes("admin") ? "admin" : "user", // Added role field
      rol: email.includes("admin") ? "ADMIN" : "CLIENTE",
      fechaRegistro: new Date().toISOString(),
      activo: true,
    }

    const token = "mock-jwt-token"
    localStorage.setItem("auth-token", token)
    localStorage.setItem("user", JSON.stringify(user))

    return { user, token }
  },

  async register(userData: {
    email: string
    password: string
    nombre: string
    apellido: string
    telefono?: string
  }): Promise<{ user: User; token: string }> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: `${userData.nombre} ${userData.apellido}`, // Added name field
      nombre: userData.nombre,
      apellido: userData.apellido,
      telefono: userData.telefono,
      role: "user", // Added role field
      rol: "CLIENTE",
      fechaRegistro: new Date().toISOString(),
      activo: true,
    }

    const token = "mock-jwt-token"
    localStorage.setItem("auth-token", token)
    localStorage.setItem("user", JSON.stringify(user))

    return { user, token }
  },

  async logout(): Promise<void> {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")
  },

  async forgotPassword(email: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Password reset email sent to ${email}`)
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Password reset successfully")
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth-token")
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}

export const AuthContext = createContext<{
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    email: string
    password: string
    nombre: string
    apellido: string
    telefono?: string
  }) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  isLoading: boolean
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user } = await authService.login(email, password)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    nombre: string
    apellido: string
    telefono?: string
  }) => {
    setIsLoading(true)
    try {
      const { user } = await authService.register(userData)
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        forgotPassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
