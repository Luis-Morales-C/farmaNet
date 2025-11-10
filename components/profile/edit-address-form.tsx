"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { type UserProfile } from "@/lib/user"
import { usuariosService } from "@/lib/usuarios"
import { useAuth } from "@/lib/auth"

interface EditAddressFormProps {
  profile: UserProfile
  onUpdate: (profile: UserProfile) => void
}

export function EditAddressForm({ profile, onUpdate }: EditAddressFormProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    direccion: profile.direcciones[0]?.direccion || "",
    ciudad: profile.direcciones[0]?.ciudad || "",
    estado: "", // Se obtiene del backend
    codigoPostal: profile.direcciones[0]?.codigoPostal || "",
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

    // Validación
    if (!formData.direccion.trim() || !formData.ciudad.trim() || !formData.codigoPostal.trim()) {
      toast({
        title: "Error de validación",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const resultado = await usuariosService.actualizarDireccion(user.id, {
        ...formData,
        estado: formData.estado || "N/A",
      })

      const perfilActualizado: UserProfile = {
        ...profile,
        direcciones: [
          {
            ...profile.direcciones[0],
            direccion: resultado.direccion,
            ciudad: resultado.ciudad,
            codigoPostal: resultado.codigoPostal,
          },
        ],
      }

      onUpdate(perfilActualizado)
      toast({
        title: "Dirección actualizada",
        description: "Tu dirección de entrega se ha actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar la dirección",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección Completa</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className="pl-10"
            placeholder="Calle, número, colonia"
            required
            minLength={5}
            maxLength={100}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleInputChange}
              className="pl-10"
              required
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado/Provincia</Label>
          <Input
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            placeholder="Opcional"
            minLength={2}
            maxLength={50}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="codigoPostal">Código Postal</Label>
        <Input
          id="codigoPostal"
          name="codigoPostal"
          value={formData.codigoPostal}
          onChange={handleInputChange}
          required
          placeholder="5-10 dígitos"
          pattern="^\d{5,10}$"
        />
        <p className="text-xs text-muted-foreground">
          Formato: 5-10 dígitos numéricos
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  )
}