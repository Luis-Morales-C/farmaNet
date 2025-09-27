"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ArrowLeft, Check, X, Package, ShoppingCart, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"

// Mock data para notificaciones
const mockNotificaciones = [
  {
    id: "1",
    tipo: "pedido",
    titulo: "Pedido confirmado",
    mensaje: "Tu pedido #12345 ha sido confirmado y está siendo preparado",
    fecha: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    leida: false,
    icono: ShoppingCart,
    color: "text-green-600",
  },
  {
    id: "2",
    tipo: "stock",
    titulo: "Producto disponible",
    mensaje: "El Paracetamol 500mg que tenías en favoritos ya está disponible",
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    leida: false,
    icono: Package,
    color: "text-blue-600",
  },
  {
    id: "3",
    tipo: "promocion",
    titulo: "Nueva oferta disponible",
    mensaje: "25% de descuento en vitaminas y suplementos hasta el domingo",
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 horas atrás
    leida: true,
    icono: Info,
    color: "text-purple-600",
  },
  {
    id: "4",
    tipo: "alerta",
    titulo: "Recordatorio de medicamento",
    mensaje: "Es hora de tomar tu medicamento prescrito",
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
    leida: true,
    icono: AlertTriangle,
    color: "text-orange-600",
  },
]

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState(mockNotificaciones)
  const { toast } = useToast()

  const handleMarkAsRead = (id: string) => {
    setNotificaciones((prev) => prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)))
  }

  const handleMarkAllAsRead = () => {
    setNotificaciones((prev) => prev.map((notif) => ({ ...notif, leida: true })))
    toast({
      title: "Notificaciones marcadas",
      description: "Todas las notificaciones se marcaron como leídas",
    })
  }

  const handleDeleteNotification = (id: string) => {
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id))
    toast({
      title: "Notificación eliminada",
      description: "La notificación se eliminó correctamente",
    })
  }

  const formatTimeAgo = (fecha: Date) => {
    const now = new Date()
    const diff = now.getTime() - fecha.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `hace ${minutes} minutos`
    } else if (hours < 24) {
      return `hace ${hours} horas`
    } else {
      return `hace ${days} días`
    }
  }

  const unreadCount = notificaciones.filter((n) => !n.leida).length

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-space-grotesk flex items-center gap-2">
                  <Bell className="h-8 w-8 text-primary" />
                  Notificaciones
                </h1>
                <p className="text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : "Todas las notificaciones están al día"}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} variant="outline">
                  <Check className="h-4 w-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              )}
            </div>

            {notificaciones.length === 0 ? (
              <div className="text-center max-w-md mx-auto py-16">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Bell className="h-12 w-12 text-muted-foreground" />
                </div>

                <h2 className="text-2xl font-bold mb-2 font-space-grotesk">No tienes notificaciones</h2>
                <p className="text-muted-foreground mb-8">
                  Te notificaremos sobre el estado de tus pedidos, ofertas especiales y más
                </p>

                <Button size="lg" asChild>
                  <Link href="/catalogo">Explorar Productos</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {notificaciones.map((notificacion) => {
                  const IconComponent = notificacion.icono
                  return (
                    <Card
                      key={notificacion.id}
                      className={`transition-all duration-200 ${
                        !notificacion.leida ? "border-primary/50 bg-primary/5" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 ${notificacion.color}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-sm">{notificacion.titulo}</h3>
                              <div className="flex items-center gap-2">
                                {!notificacion.leida && (
                                  <Badge variant="default" className="text-xs">
                                    Nueva
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTimeAgo(notificacion.fecha)}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">{notificacion.mensaje}</p>

                            <div className="flex items-center gap-2">
                              {!notificacion.leida && (
                                <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notificacion.id)}>
                                  <Check className="h-4 w-4 mr-1" />
                                  Marcar como leída
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNotification(notificacion.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
