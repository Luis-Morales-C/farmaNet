"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { adminApi, type AdminOrder } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Truck, CheckCircle, X, AlertTriangle } from "lucide-react"
import Link from "next/link"

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

export default function AdminOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Verificar permisos de admin
  if (!user || user.rol !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
              <p className="text-muted-foreground mb-4">No tienes permisos para acceder a esta sección.</p>
              <Button asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await adminApi.getOrders()
        setOrders(data)
      } catch (error) {
        console.error("Error loading orders:", error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const filteredOrders = orders.filter(
    (order) =>
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Pedidos</h1>
          <p className="text-gray-600">Administra los pedidos de tus clientes</p>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Filtros</Button>
              <Button variant="outline">Exportar</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p>Cargando pedidos...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">#{order.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.userName}</div>
                        <div className="text-sm text-muted-foreground">{order.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} producto{order.items.length !== 1 ? "s" : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.items[0]?.productName}
                        {order.items.length > 1 && ` +${order.items.length - 1} más`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">${order.total}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          {order.status === "pending" && (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Procesar
                            </DropdownMenuItem>
                          )}
                          {order.status === "processing" && (
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Marcar como enviado
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
