import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-primary">Acceso Denegado</h1>
          <p className="text-muted-foreground">
            No tienes permisos suficientes para acceder a esta página. 
            Si crees que esto es un error, contacta con un administrador.
          </p>
          <div className="pt-4">
            <Button asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}