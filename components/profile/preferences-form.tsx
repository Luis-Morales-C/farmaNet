"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MessageSquare, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { type UserProfile, userService } from "@/lib/user"

interface PreferencesFormProps {
  preferences: UserProfile["preferencias"]
  onUpdate: (profile: UserProfile) => void
}

export function PreferencesForm({ preferences, onUpdate }: PreferencesFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(preferences)

  const handleSwitchChange = (name: keyof typeof preferences, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedProfile = await userService.updateProfile({ preferencias: formData })
      onUpdate(updatedProfile)
      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias de notificación se han guardado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar las preferencias. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Notificaciones por Email
            </CardTitle>
            <CardDescription>Recibe actualizaciones importantes en tu correo electrónico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notificacionesEmail" className="flex-1">
                Notificaciones generales
              </Label>
              <Switch
                id="notificacionesEmail"
                checked={formData.notificacionesEmail}
                onCheckedChange={(checked) => handleSwitchChange("notificacionesEmail", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="newsletter" className="flex-1">
                Newsletter y novedades
              </Label>
              <Switch
                id="newsletter"
                checked={formData.newsletter}
                onCheckedChange={(checked) => handleSwitchChange("newsletter", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Notificaciones por SMS
            </CardTitle>
            <CardDescription>Recibe alertas importantes en tu teléfono móvil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="notificacionesSMS" className="flex-1">
                Mensajes de texto
              </Label>
              <Switch
                id="notificacionesSMS"
                checked={formData.notificacionesSMS}
                onCheckedChange={(checked) => handleSwitchChange("notificacionesSMS", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Promociones y Ofertas
            </CardTitle>
            <CardDescription>Mantente informado sobre descuentos y ofertas especiales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="ofertas" className="flex-1">
                Ofertas y descuentos
              </Label>
              <Switch
                id="ofertas"
                checked={formData.ofertas}
                onCheckedChange={(checked) => handleSwitchChange("ofertas", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar Preferencias"}
      </Button>
    </form>
  )
}
