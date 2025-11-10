"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { type UserProfile } from "@/lib/user"
import { usuariosService } from "@/lib/usuarios"
import { useAuth } from "@/lib/auth"

interface EditProfileFormProps {
  profile: UserProfile
  onUpdate: (profile: UserProfile) => void
}

export function EditProfileForm({ profile, onUpdate }: EditProfileFormProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: profile.nombre,
    apellido: profile.apellido,
    telefono: profile.telefono || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      toast({
        title: "Error",
        description: "No se pudo identificar tu usuario",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const resultado = await usuariosService.actualizarPerfil(user.id, formData)
      const perfilActualizado: UserProfile = {
        ...profile,
        nombre: resultado.nombre,
        apellido: resultado.apellido,
        telefono: resultado.telefono,
      }
      onUpdate(perfilActualizado)
      toast({
        title: "Perfil actualizado",
        description: "Tu información personal se ha actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el perfil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="pl-10"
              required
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className="pl-10"
              required
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" value={profile.email} className="pl-10" disabled />
        </div>
        <p className="text-xs text-muted-foreground">
          El email no se puede cambiar. Contacta soporte si necesitas actualizarlo.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="10-15 dígitos"
            pattern="^\d{10,15}$"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Formato: 10-15 dígitos (ej: 1234567890)
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  )
}
