"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { adminApi, type AdminStats } from "@/lib/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Download,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function AdminReports() {
  const { user } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminApi.getStats()
        setStats(data)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === "admin") {
      loadStats()
    }
  }, [user])

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
              <p className="text-muted-foreground mb-4">No tienes permisos para acceder a esta sección.</p>
              <Button asChild>
                <Link href="/admin">Volver al Panel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reportes y Análisis</h1>
          <p className="text-gray-600">Analiza el rendimiento de tu farmacia</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Filtrar Período
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Cargando reportes...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.totalRevenue?.toLocaleString()}</div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+8.2% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Completados</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalOrders}</div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+15% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">234</div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+5.8% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Productos Más Vendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Paracetamol 500mg</div>
                      <div className="text-sm text-muted-foreground">45 unidades</div>
                    </div>
                    <Badge>$382.50</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Vitamina C 1000mg</div>
                      <div className="text-sm text-muted-foreground">32 unidades</div>
                    </div>
                    <Badge>$511.68</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Ibuprofeno 400mg</div>
                      <div className="text-sm text-muted-foreground">28 unidades</div>
                    </div>
                    <Badge>$294.00</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Clientes Frecuentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">María García</div>
                      <div className="text-sm text-muted-foreground">12 pedidos</div>
                    </div>
                    <Badge>$1,245.50</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Juan Pérez</div>
                      <div className="text-sm text-muted-foreground">8 pedidos</div>
                    </div>
                    <Badge>$892.30</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Ana López</div>
                      <div className="text-sm text-muted-foreground">6 pedidos</div>
                    </div>
                    <Badge>$567.80</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Alerts */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertTriangle className="h-5 w-5" />
                Alertas de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-orange-800">Vitamina C 1000mg</div>
                    <div className="text-sm text-orange-600">Stock: 5 unidades</div>
                  </div>
                  <Badge variant="destructive">Stock Bajo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-orange-800">Crema Hidratante</div>
                    <div className="text-sm text-orange-600">Stock: 3 unidades</div>
                  </div>
                  <Badge variant="destructive">Stock Bajo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
