"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, ShoppingCart, Users, BarChart3, Plus, Edit2, Trash2, Eye } from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("productos")
  const [productos, setProductos] = useState<any[]>([])
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Simulated data - connect to backend API when ready
    const mockProductos = [
      {
        id: 1,
        nombre: "Ibuprofeno 400mg",
        precio: 12.99,
        stock: 45,
        categoria: "Medicamentos",
        estatus: "activo",
      },
      {
        id: 2,
        nombre: "Vitamina C 1000mg",
        precio: 15.99,
        stock: 0,
        categoria: "Vitaminas",
        estatus: "agotado",
      },
      {
        id: 3,
        nombre: "Paracetamol 500mg",
        precio: 9.99,
        stock: 85,
        categoria: "Medicamentos",
        estatus: "activo",
      },
    ]

    const mockPedidos = [
      {
        id: "ORD-001",
        usuario: "Juan Pérez",
        total: 89.99,
        fecha: "2024-01-15",
        estatus: "enviado",
        items: 3,
      },
      {
        id: "ORD-002",
        usuario: "María García",
        total: 45.5,
        fecha: "2024-01-14",
        estatus: "procesando",
        items: 2,
      },
      {
        id: "ORD-003",
        usuario: "Carlos López",
        total: 120.0,
        fecha: "2024-01-13",
        estatus: "entregado",
        items: 5,
      },
    ]

    setProductos(mockProductos)
    setPedidos(mockPedidos)
    setLoading(false)
  }, [])

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case "activo":
        return "bg-green-100 text-green-800"
      case "agotado":
        return "bg-red-100 text-red-800"
      case "enviado":
        return "bg-blue-100 text-blue-800"
      case "procesando":
        return "bg-yellow-100 text-yellow-800"
      case "entregado":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk">Panel de Administración</h1>
              <p className="opacity-90 mt-1">Gestiona tu farmacia online</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-primary-foreground text-primary rounded-lg font-medium hover:opacity-90 transition"
            >
              Ir a Tienda
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Productos</p>
                <p className="text-3xl font-bold text-foreground">2,847</p>
              </div>
              <Package className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pedidos Hoy</p>
                <p className="text-3xl font-bold text-foreground">24</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Clientes Activos</p>
                <p className="text-3xl font-bold text-foreground">1,234</p>
              </div>
              <Users className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Ingresos</p>
                <p className="text-3xl font-bold text-foreground">$12,450</p>
              </div>
              <BarChart3 className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-border">
          {/* Tab Navigation */}
          <div className="border-b border-border">
            <div className="flex">
              <button
                onClick={() => setActiveTab("productos")}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === "productos"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Productos ({productos.length})
              </button>
              <button
                onClick={() => setActiveTab("pedidos")}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === "pedidos"
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pedidos ({pedidos.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : activeTab === "productos" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="heading-3 text-foreground">Gestionar Productos</h2>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Producto
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Producto</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Precio</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Stock</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Categoría</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Estado</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((producto) => (
                        <tr key={producto.id} className="border-b border-border hover:bg-card transition">
                          <td className="py-3 px-4 text-foreground">{producto.nombre}</td>
                          <td className="py-3 px-4 text-foreground font-medium">${producto.precio}</td>
                          <td className="py-3 px-4 text-foreground">{producto.stock}</td>
                          <td className="py-3 px-4 text-muted-foreground">{producto.categoria}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getEstatusColor(producto.estatus)}`}
                            >
                              {producto.estatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="p-1 hover:bg-background rounded transition">
                                <Edit2 className="w-4 h-4 text-primary" />
                              </button>
                              <button className="p-1 hover:bg-background rounded transition">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="heading-3 text-foreground mb-4">Gestionar Pedidos</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Pedido</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Cliente</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Fecha</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Estado</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id} className="border-b border-border hover:bg-card transition">
                          <td className="py-3 px-4 font-medium text-foreground">{pedido.id}</td>
                          <td className="py-3 px-4 text-foreground">{pedido.usuario}</td>
                          <td className="py-3 px-4 font-medium text-primary">${pedido.total}</td>
                          <td className="py-3 px-4 text-muted-foreground">{pedido.fecha}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getEstatusColor(pedido.estatus)}`}
                            >
                              {pedido.estatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="p-1 hover:bg-background rounded transition">
                              <Eye className="w-4 h-4 text-primary" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
