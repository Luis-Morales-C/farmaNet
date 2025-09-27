"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import { userService } from "@/lib/user"

export function DeleteAccountDialog() {
  const { toast } = useToast()
  const { logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const handleDelete = async () => {
    if (confirmText !== "ELIMINAR") {
      toast({
        title: "Confirmación incorrecta",
        description: "Debes escribir 'ELIMINAR' para confirmar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await userService.deleteAccount()
      await logout()

      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta ha sido eliminada permanentemente",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la cuenta. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar Cuenta
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Cuenta
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>¡Advertencia!</strong> Esta acción eliminará:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Tu perfil y información personal</li>
              <li>Historial de pedidos</li>
              <li>Direcciones guardadas</li>
              <li>Productos favoritos</li>
              <li>Todas las preferencias</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm">
              Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading || confirmText !== "ELIMINAR"}>
            {isLoading ? "Eliminando..." : "Eliminar Cuenta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
