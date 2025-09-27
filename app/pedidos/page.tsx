"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { ordersApi, type Order } from "@/lib/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Package, Truck, CheckCircle, X, Eye, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const statusIcons = {
  pending: Package,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: X,
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return

      try {
        const userOrders = await ordersApi.getUserOrders(user.id)
        setOrders(userOrders)
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Inicia Sesión</h2>
              <p className="text-muted-foreground mb-4">Debes iniciar sesión para ver tus pedidos</p>
              <Button asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/perfil" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Perfil
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
        <p className="text-gray-600">Revisa el estado de tus compras</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes pedidos aún</h3>
              <p className="text-muted-foreground mb-4">Cuando realices tu primera compra, aparecerá aquí</p>
              <Button asChild>
                <Link href="/catalogo">Explorar Productos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status]
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Realizado el {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[order.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusLabels[order.status]}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/pedidos/${order.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden">
                            <Image
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-sm text-muted-foreground">
                              Cantidad: {item.quantity} × ${item.price}
                            </div>
                          </div>
                          <div className="font-medium">${item.total.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                        </div>
                        {order.trackingNumber && (
                          <div className="text-sm text-muted-foreground">Seguimiento: {order.trackingNumber}</div>
                        )}
                        {order.estimatedDelivery && order.status !== "delivered" && (
                          <div className="text-sm text-muted-foreground">
                            Entrega estimada: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${order.total.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Total</div>
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
  )
}
