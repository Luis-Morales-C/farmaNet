"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const { forgotPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setIsSuccess(true)
    } catch (err) {
      setError("Error al enviar el email. Por favor, verifica que el email sea correcto.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold font-space-grotesk text-primary">Email Enviado</CardTitle>
              <CardDescription>Revisa tu bandeja de entrada</CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>

              <p className="text-muted-foreground">
                Hemos enviado un enlace de recuperación de contraseña a <strong>{email}</strong>
              </p>

              <p className="text-sm text-muted-foreground">
                Si no recibes el email en unos minutos, revisa tu carpeta de spam.
              </p>

              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Login
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                  }}
                >
                  Enviar a otro email
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold font-space-grotesk">Recuperar Contraseña</CardTitle>
            <CardDescription>Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Volver al login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
