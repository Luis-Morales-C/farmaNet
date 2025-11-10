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
      setUsuarios(response.usuarios || []) // Asegurarse de que sea un array
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cargar los usuarios",
        variant: "destructive",
      })
      setUsuarios([]) // En caso de error, establecer un array vacío
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Removida la verificación de rol aquí ya que se hace en el nivel superior
    cargarUsuarios()
  }, [])

  const handleBuscar = async () => {
    if (!searchTerm.trim()) {
      cargarUsuarios()
      return
    }

    try {
      setLoading(true)
      const response = await usuariosService.buscarUsuarios(searchTerm)
      setUsuarios(response.usuarios || []) // Asegurarse de que sea un array
    } catch (error) {
      toast({
        title: "Error en la búsqueda",
        description: error instanceof Error ? error.message : "No se pudo realizar la búsqueda",
        variant: "destructive",
      })
      setUsuarios([]) // En caso de error, establecer un array vacío
    } finally {
      setLoading(false)
    }
  }

  // Removida la verificación de acceso denegado aquí ya que se hace en el nivel superior

  const usuariosFiltrados = (usuarios || []).filter( // Asegurarse de que usuarios sea un array
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
          <CardTitle>Usuarios ({usuariosFiltrados.length} de {usuarios?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserList usuarios={usuariosFiltrados} onRefresh={cargarUsuarios} isLoading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}