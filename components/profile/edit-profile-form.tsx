"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Phone, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { type UserProfile, userService } from "@/lib/user"

interface EditProfileFormProps {
  profile: UserProfile
  onUpdate: (profile: UserProfile) => void
}

export function EditProfileForm({ profile, onUpdate }: EditProfileFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: profile.nombre,
    apellido: profile.apellido,
    telefono: profile.telefono || "",
    fechaNacimiento: profile.fechaNacimiento || "",
    genero: profile.genero || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedProfile = await userService.updateProfile(formData)
      onUpdate(updatedProfile)
      toast({
        title: "Perfil actualizado",
        description: "Tu información personal se ha actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Intenta nuevamente.",
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
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="genero">Género</Label>
          <Select value={formData.genero} onValueChange={(value) => handleSelectChange("genero", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="femenino">Femenino</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  )
}
