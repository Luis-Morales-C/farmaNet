"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Ban, CheckCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { UsuarioDetalleDTO } from "@/lib/usuarios"
import { usuariosService } from "@/lib/usuarios"
import { UserDetailModal } from "./user-detail-modal"

interface UserListProps {
  usuarios: UsuarioDetalleDTO[]
  onRefresh: () => void
  isLoading?: boolean
}

export function UserList({ usuarios, onRefresh, isLoading = false }: UserListProps) {
  const { toast } = useToast()
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId)
    try {
      if (currentStatus) {
        await usuariosService.desactivarUsuario(userId)
        toast({
          title: "Usuario desactivado",
          description: "El usuario ha sido desactivado correctamente",
        })
      } else {
        await usuariosService.activarUsuario(userId)
        toast({
          title: "Usuario activado",
          description: "El usuario ha sido activado correctamente",
        })
      }
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cambiar el estado del usuario",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando usuarios...</p>
      </div>
    )
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay usuarios para mostrar</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Compras</TableHead>
          <TableHead>Total Gastado</TableHead>
          <TableHead>Registro</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map((usuario) => (
          <TableRow key={usuario.id}>
            <TableCell>
              <div>
                <div className="font-medium">
                  {usuario.nombre} {usuario.apellido}
                </div>
                <div className="text-sm text-muted-foreground">{usuario.email}</div>
              </div>
            </TableCell>

            <TableCell>
              <Badge variant={usuario.rol === "ADMIN" ? "default" : "secondary"}>
                {usuario.rol}
              </Badge>
            </TableCell>

            <TableCell>
              <Badge variant={usuario.activo ? "default" : "destructive"}>
                {usuario.activo ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>

            <TableCell>{usuario.totalCompras}</TableCell>

            <TableCell>${usuario.montoTotalCompras.toFixed(2)}</TableCell>

            <TableCell>{new Date(usuario.fechaRegistro).toLocaleDateString()}</TableCell>

            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <UserDetailModal usuario={usuario} onUpdate={onRefresh} />
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleToggleStatus(usuario.id, usuario.activo)}
                    disabled={actionLoading === usuario.id}
                    className={!usuario.activo ? "text-green-600" : "text-red-600"}
                  >
                    {usuario.activo ? (
                      <>
                        <Ban className="mr-2 h-4 w-4" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activar
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}