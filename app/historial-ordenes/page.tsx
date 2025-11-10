"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  numero: string
  fecha: string
  total: number
  estado: "Pendiente" | "Procesando" | "Enviado" | "Entregado" | "Cancelado"
  articulos: number
}

const DEMO_ORDERS: Order[] = [
  {
    id: "1",
    numero: "ORD-2025-001",
    fecha: "2025-11-01",
    total: 125.5,
    estado: "Entregado",
    articulos: 3,
  },
  {
    id: "2",
    numero: "ORD-2025-002",
    fecha: "2025-10-28",
    total: 89.99,
    estado: "Enviado",
    articulos: 2,
  },
  {
    id: "3",
    numero: "ORD-2025-003",
    fecha: "2025-10-20",
    total: 156.0,
    estado: "Entregado",
    articulos: 5,
  },
]

export default function HistorialOrdenesPage() {
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS)
  const [loading, setLoading] = useState(false)

  const getEstadoColor = (estado: Order["estado"]) => {
    switch (estado) {
      case "Entregado":
        return "bg-green-100 text-green-800"
      case "Enviado":
        return "bg-blue-100 text-blue-800"
      case "Procesando":
        return "bg-yellow-100 text-yellow-800"
      case "Pendiente":
        return "bg-gray-100 text-gray-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cuenta">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historial de Órdenes</h1>
            <p className="text-muted">Revisa el estado de todas tus compras</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Cargando órdenes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border border-border p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No tienes órdenes aún</h3>
            <p className="text-muted mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
            <Link href="/catalogo">
              <Button>Explorar Productos</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{order.numero}</h3>
                    <p className="text-sm text-muted">
                      {new Date(order.fecha).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div>
                      <p className="text-sm text-muted">Artículos</p>
                      <p className="font-semibold text-foreground">{order.articulos}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted">Total</p>
                      <p className="font-semibold text-foreground text-lg">${order.total.toFixed(2)}</p>
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(order.estado)}`}
                      >
                        {order.estado}
                      </span>
                    </div>

                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Eye className="w-4 h-4" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
