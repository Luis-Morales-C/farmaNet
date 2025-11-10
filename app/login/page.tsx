"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.data))
        localStorage.setItem("auth-token", result.data.token)
        router.push("/cuenta")
      } else {
        setError(result.error || "Error al iniciar sesión")
      }
    } catch (err) {
      setError("Error de conexión. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
 }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Iniciar Sesión</h1>
          <p className="text-muted">Ingresa a tu cuenta para acceder a todos nuestros servicios</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-nonefocus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text": "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
             <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5h-5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link href="/recuperar-password" className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            ¿No tienes cuenta?{""}
            <Link href="/registro" className="text-primary font-medium hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
