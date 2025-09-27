"use client"

import type React from "react"

import { useState } from "react"
import { Plus, MapPin, Edit, Trash2, Home, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { type Direccion, userService } from "@/lib/user"

interface AddressManagerProps {
  addresses: Direccion[]
  onUpdate: () => void
}

export function AddressManager({ addresses, onUpdate }: AddressManagerProps) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Direccion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    tipo: "casa" as "casa" | "trabajo" | "otro",
    nombre: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    esPrincipal: false,
  })

  const resetForm = () => {
    setFormData({
      tipo: "casa",
      nombre: "",
      direccion: "",
      ciudad: "",
      codigoPostal: "",
      telefono: "",
      esPrincipal: false,
    })
    setEditingAddress(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (address: Direccion) => {
    setFormData({
      tipo: address.tipo,
      nombre: address.nombre,
      direccion: address.direccion,
      ciudad: address.ciudad,
      codigoPostal: address.codigoPostal,
      telefono: address.telefono || "",
      esPrincipal: address.esPrincipal,
    })
    setEditingAddress(address)
    setIsDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress.id, formData)
        toast({
          title: "Dirección actualizada",
          description: "La dirección se ha actualizado correctamente",
        })
      } else {
        await userService.addAddress(formData)
        toast({
          title: "Dirección agregada",
          description: "La nueva dirección se ha agregado correctamente",
        })
      }

      setIsDialogOpen(false)
      resetForm()
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la dirección. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, nombre: string) => {
    try {
      await userService.deleteAddress(id)
      toast({
        title: "Dirección eliminada",
        description: `La dirección "${nombre}" se ha eliminado correctamente`,
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la dirección. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const getAddressIcon = (tipo: string) => {
    switch (tipo) {
      case "casa":
        return <Home className="h-4 w-4" />
      case "trabajo":
        return <Building className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {addresses.length} {addresses.length === 1 ? "dirección" : "direcciones"} guardadas
        </p>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Dirección
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Editar Dirección" : "Nueva Dirección"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value: any) => handleSelectChange("tipo", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="trabajo">Trabajo</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Casa, Oficina, etc."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección Completa</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Calle, número, colonia"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoPostal">Código Postal</Label>
                  <Input
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono (opcional)</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="esPrincipal"
                  name="esPrincipal"
                  checked={formData.esPrincipal}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="esPrincipal" className="text-sm">
                  Establecer como dirección principal
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Guardando..." : editingAddress ? "Actualizar" : "Agregar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className={address.esPrincipal ? "border-primary" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getAddressIcon(address.tipo)}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{address.nombre}</h4>
                      {address.esPrincipal && (
                        <Badge variant="default" className="text-xs">
                          Principal
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">{address.direccion}</p>
                    <p className="text-sm text-muted-foreground">
                      {address.ciudad}, {address.codigoPostal}
                    </p>

                    {address.telefono && <p className="text-sm text-muted-foreground mt-1">Tel: {address.telefono}</p>}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(address)}>
                    <Edit className="h-4 w-4" />
                  </Button>

                  {!address.esPrincipal && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(address.id, address.nombre)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
