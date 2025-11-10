"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { UsuarioDetalleDTO } from "@/lib/usuarios"
import { UserEditForm } from "./user-edit-form"

interface UserDetailModalProps {
  usuario: UsuarioDetalleDTO
  onUpdate: () => void
}

export function UserDetailModal({ usuario, onUpdate }: UserDetailModalProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleEditSuccess = () => {
    setIsEditing(false)
    onUpdate()
    toast({
      title: "Usuario actualizado",
      description: "La información del usuario se ha actualizado correctamente",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalles
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          {/* Tab Información */}
          <TabsContent value="info" className="space-y-4">
            {isEditing ? (
              <UserEditForm usuario={usuario} onSuccess={handleEditSuccess} onCancel={() => setIsEditing(false)} />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                      <p className="font-semibold">{usuario.nombre}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Apellido</p>
                      <p className="font-semibold">{usuario.apellido}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-semibold">{usuario.email}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                      <p className="font-semibold">{usuario.telefono || "No especificado"}</p>
                    </CardContent>
                  </Card>

                  <Card className="col-span-2">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Dirección</p>
                      <p className="font-semibold">{usuario.direccion || "No especificada"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Ciudad</p>
                      <p className="font-semibold">{usuario.ciudad || "No especificada"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Estado</p>
                      <p className="font-semibold">{usuario.estado || "No especificado"}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">Código Postal</p>
                      <p className="font-semibold">{usuario.codigoPostal || "No especificado"}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(true)} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Información
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* Tab Cuenta */}
          <TabsContent value="cuenta" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rol</p>
                    <Badge>{usuario.rol}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estado</p>
                    <Badge variant={usuario.activo ? "default" : "destructive"}>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha de Registro</p>
                    <p className="font-semibold text-sm">
                      {new Date(usuario.fechaRegistro).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Última Actualización</p>
                    <p className="font-semibold text-sm">
                      {new Date(usuario.fechaUltimaActualizacion).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Historial */}
          <TabsContent value="historial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estadísticas de Compras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{usuario.totalCompras}</p>
                    <p className="text-sm text-muted-foreground">Total de Compras</p>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary">${usuario.montoTotalCompras.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Monto Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {usuario.prescripciones && usuario.prescripciones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Prescripciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {usuario.prescripciones.map((prescripcion, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg text-sm">
                        {prescripcion}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}