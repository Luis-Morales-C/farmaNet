"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ordersService, type Order } from "@/lib/orders.service"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface UserOrdersProps {
  userId: string
}

export function UserOrders({ userId }: UserOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserOrders = async () => {
      try {
        setLoading(true)
        const userOrders = await ordersService.getUserOrders(userId)
        setOrders(userOrders)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los pedidos")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadUserOrders()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Cargando historial de compras...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No se encontraron compras para este usuario</p>
      </div>
    )
  }

  // Calcular estadísticas
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">En {totalOrders} pedido(s)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Última Compra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              ${orders[0]?.total.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              {orders[0]?.createdAt 
                ? format(new Date(orders[0].createdAt), "dd MMM yyyy", { locale: es }) 
                : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Compras</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "dd MMM yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>{order.items.length} producto(s)</TableCell>
                  <TableCell className="text-right font-medium">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === "delivered" ? "default" :
                        order.status === "cancelled" ? "destructive" :
                        "secondary"
                      }
                    >
                      {order.status === "pending" && "Pendiente"}
                      {order.status === "processing" && "Procesando"}
                      {order.status === "shipped" && "Enviado"}
                      {order.status === "delivered" && "Entregado"}
                      {order.status === "cancelled" && "Cancelado"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}