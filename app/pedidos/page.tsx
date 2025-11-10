"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/cuenta" className="flex items-center gap-2 text-primary hover:gap-3 transition mb-6">
          <ChevronLeft className="w-5 h-5" />
          Volver al Perfil
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Pedidos</h1>
        <p className="text-muted mb-8">Revisa el estado de tus compras</p>

        <div className="bg-white rounded-lg border border-border p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-muted mb-4 opacity-50" />
          <p className="text-muted text-lg mb-4">No tienes pedidos aún</p>
          <p className="text-muted text-sm mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
          <Link href="/catalogo">
            <Button>Explorar Productos</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
