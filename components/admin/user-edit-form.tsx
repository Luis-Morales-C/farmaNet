"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { UsuarioDetalleDTO, ActualizarUsuarioAdminDTO } from "@/lib/usuarios"
import { usuariosService } from "@/lib/usuarios"

interface UserEditFormProps {
  usuario: UsuarioDetalleDTO
  onSuccess: () => void
  onCancel: () => void
}

export function UserEditForm({ usuario, onSuccess, onCancel }: UserEditFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ActualizarUsuarioAdminDTO>({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: usuario.telefono || "",
    direccion: usuario.direccion || "",
    ciudad: usuario.ciudad || "",
    estado: usuario.estado || "",
    codigoPostal: usuario.codigoPostal || "",
    activo: usuario.activo,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await usuariosService.actualizarUsuarioAdmin(usuario.id, formData)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el usuario",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <Input
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleInputChange}
            placeholder="10-15 dígitos"
          />
        </div>

        <div className="space-y-2">
          <Label>Estado</Label>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleInputChange}
              className="rounded"
            />
            <Label htmlFor="activo" className="text-sm cursor-pointer">
              Usuario Activo
            </Label>
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            placeholder="Dirección completa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado/Provincia</Label>
          <Input
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="codigoPostal">Código Postal</Label>
          <Input
            id="codigoPostal"
            name="codigoPostal"
            value={formData.codigoPostal}
            onChange={handleInputChange}
            placeholder="5-10 dígitos"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Guardando..." : "Guardar Cambios"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  )
}