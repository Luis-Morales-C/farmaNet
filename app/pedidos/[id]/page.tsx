"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { ordersApi, type Order } from "@/lib/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, X, ArrowLeft, MapPin, CreditCard, Calendar, Phone } from "lucide-react"
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

const paymentMethodLabels = {
  credit_card: "Tarjeta de Crédito",
  debit_card: "Tarjeta Débito",
  paypal: "PayPal",
  cash_on_delivery: "Pago Contra Entrega",
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrder = async () => {
      if (!user || !params.id) return

      try {
        const orderData = await ordersApi.getOrderById(params.id as string)
        if (!orderData) {
          router.push("/pedidos")
          return
        }
        setOrder(orderData)
      } catch (error) {
        console.error("Error loading order:", error)
        router.push("/pedidos")
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [user, params.id, router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Inicia Sesión</h2>
              <p className="text-muted-foreground mb-4">Debes iniciar sesión para ver los detalles del pedido</p>
              <Button asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Cargando detalles del pedido...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <X className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Pedido No Encontrado</h2>
              <p className="text-muted-foreground mb-4">
                El pedido que buscas no existe o no tienes permisos para verlo
              </p>
              <Button asChild>
                <Link href="/pedidos">Ver Mis Pedidos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const StatusIcon = statusIcons[order.status]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/pedidos" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Mis Pedidos
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pedido #{order.id}</h1>
            <p className="text-gray-600">Realizado el {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <Badge className={`${statusColors[order.status]} text-base px-4 py-2`}>
            <StatusIcon className="h-4 w-4 mr-2" />
            {statusLabels[order.status]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={item.productImage || "/placeholder.svg"}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">Cantidad: {item.quantity}</div>
                      <div className="text-sm text-muted-foreground">Precio unitario: ${item.price}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.total.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Dirección de Envío
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">{order.shippingAddress.fullName}</div>
                <div>{order.shippingAddress.street}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {order.shippingAddress.phone}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{paymentMethodLabels[order.paymentMethod]}</div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Tracking */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{order.shipping === 0 ? "Gratis" : `$${order.shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Número de Seguimiento</div>
                  <div className="font-medium">{order.trackingNumber}</div>
                </div>
                {order.estimatedDelivery && order.status !== "delivered" && (
                  <div>
                    <div className="text-sm text-muted-foreground">Entrega Estimada</div>
                    <div className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${order.status === "pending" ? "bg-emerald-100" : "bg-gray-100"}`}>
                    <Package
                      className={`h-4 w-4 ${order.status === "pending" ? "text-emerald-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div>
                    <div className="font-medium">Pedido Recibido</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {["processing", "shipped", "delivered"].includes(order.status) && (
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${order.status === "processing" ? "bg-emerald-100" : "bg-gray-100"}`}
                    >
                      <Package
                        className={`h-4 w-4 ${order.status === "processing" ? "text-emerald-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <div className="font-medium">En Preparación</div>
                      <div className="text-sm text-muted-foreground">Procesando tu pedido</div>
                    </div>
                  </div>
                )}

                {["shipped", "delivered"].includes(order.status) && (
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${order.status === "shipped" ? "bg-emerald-100" : "bg-gray-100"}`}
                    >
                      <Truck
                        className={`h-4 w-4 ${order.status === "shipped" ? "text-emerald-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <div className="font-medium">En Camino</div>
                      <div className="text-sm text-muted-foreground">Tu pedido está en camino</div>
                    </div>
                  </div>
                )}

                {order.status === "delivered" && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-100">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium">Entregado</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
