"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"

interface Notification {
  id: string
  titulo: string
  mensaje: string
  tipo: "info" | "oferta" | "pedido" | "alerta"
  timestamp: string
  leida: boolean
}

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    titulo: "Oferta Especial",
    mensaje: "Vitamina C con 30% de descuento esta semana",
    tipo: "oferta",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    leida: false,
  },
  {
    id: "2",
    titulo: "Tu pedido ha sido confirmado",
    mensaje: "Pedido #12345 confirmado y en preparación",
    tipo: "pedido",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    leida: false,
  },
  {
    id: "3",
    titulo: "Nuevo producto disponible",
    mensaje: "Protector solar biodegradable SPF 70 ya en stock",
    tipo: "info",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    leida: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS)

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIconColor = (tipo: string) => {
    switch (tipo) {
      case "oferta":
        return "text-orange-500"
      case "pedido":
        return "text-blue-500"
      case "alerta":
        return "text-red-500"
      default:
        return "text-primary"
    }
  }

  const unreadCount = notifications.filter((n) => !n.leida).length

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Notificaciones</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{unreadCount}</span>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <Bell className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted text-lg">No tienes notificaciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`border rounded-lg p-4 flex items-start gap-4 ${
                  notif.leida ? "bg-white border-border" : "bg-blue-50 border-primary"
                }`}
              >
                <Bell className={`w-6 h-6 mt-1 flex-shrink-0 ${getIconColor(notif.tipo)}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{notif.titulo}</h3>
                  <p className="text-sm text-muted mt-1">{notif.mensaje}</p>
                  <p className="text-xs text-muted mt-2">
                    {new Date(notif.timestamp).toLocaleDateString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(notif.id)}
                  className="p-2 hover:bg-background rounded-lg transition flex-shrink-0"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
