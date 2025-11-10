"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { usuariosService, type UsuarioDetalleDTO } from "@/lib/usuarios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Search } from "lucide-react"
import Link from "next/link"
import { UserList } from "@/components/admin/user-list"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsers() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [usuarios, setUsuarios] = useState<UsuarioDetalleDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const cargarUsuarios = async () => {
    try {
      setLoading(true)
      const response = await usuariosService.listarUsuarios()
      setUsuarios(response.usuarios)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.rol === "ADMIN") {
      cargarUsuarios()
    }
  }, [user])

  const handleBuscar = async () => {
    if (!searchTerm.trim()) {
      cargarUsuarios()
      return
    }

    try {
      setLoading(true)
      const response = await usuariosService.buscarUsuarios(searchTerm)
      setUsuarios(response.usuarios)
    } catch (error) {
      toast({
        title: "Error en la búsqueda",
        description: error instanceof Error ? error.message : "No se pudo realizar la búsqueda",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
                <Link href="/admin">Volver al Panel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra las cuentas de usuario y consulta su historial de compras</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre, apellido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleBuscar()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleBuscar}>Buscar</Button>
            <Button variant="outline" onClick={() => { setSearchTerm(""); cargarUsuarios() }}>Limpiar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({usuariosFiltrados.length} de {usuarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList usuarios={usuariosFiltrados} onRefresh={cargarUsuarios} isLoading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
