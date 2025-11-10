"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  nombre: string
  descripcion: string
  precio: number
  precioOferta?: number
  enOferta: boolean
  imagen?: string
  stock: number
}

const DEMO_OFFERS: Product[] = [
  {
    id: "2",
    nombre: "Vitamina C 1000mg",
    descripcion: "Suplemento de vitamina C",
    precio: 12.5,
    precioOferta: 9.99,
    enOferta: true,
    stock: 30,
  },
  {
    id: "6",
    nombre: "Omega 3 1000mg",
    descripcion: "Ácidos grasos omega 3",
    precio: 19.99,
    precioOferta: 14.99,
    enOferta: true,
    stock: 35,
  },
  {
    id: "9",
    nombre: "Complejo B",
    descripcion: "Complejo vitamínico B completo",
    precio: 14.99,
    precioOferta: 11.49,
    enOferta: true,
    stock: 40,
  },
  {
    id: "10",
    nombre: "Zinc 30mg",
    descripcion: "Mineral inmunológico",
    precio: 11.99,
    precioOferta: 8.99,
    enOferta: true,
    stock: 50,
  },
]

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      console.log("[v0] Fetching offers from:", apiUrl)

      if (!apiUrl) {
        throw new Error("API URL no configurada")
      }

      const response = await fetch(`${apiUrl}/api/catalogo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      })

      console.log("[v0] Offers response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("[v0] Offers data received:", result.data?.length)

      if (result.success && Array.isArray(result.data)) {
        const offers = result.data.filter((p: Product) => p.enOferta)
        setProducts(offers.length > 0 ? offers : DEMO_OFFERS)
      } else {
        throw new Error("Formato de respuesta inválido")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      console.error("[v0] Error fetching offers:", errorMessage)
      setError(errorMessage)
      setProducts(DEMO_OFFERS)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Ofertas Especiales</h1>
        <p className="text-muted text-lg mb-8">Aprovecha nuestras mejores promociones</p>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <p className="font-medium">⚠️ Datos de demostración</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Cargando ofertas...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-background rounded-lg border border-border p-12 text-center">
            <p className="text-muted text-lg">No hay ofertas disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/productos/${product.id}`}>
      <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition group cursor-pointer">
        <div className="relative aspect-square bg-background flex items-center justify-center overflow-hidden">
          <img
            src={product.imagen || "/placeholder.svg?height=200&width=200&query=medicine"}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
          {product.enOferta && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Oferta
            </div>
          )}
          <button className="absolute top-2 left-2 p-2 bg-white rounded-full shadow hover:shadow-lg transition opacity-0 group-hover:opacity-100">
            <Heart className="w-5 h-5 text-red-500" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition">
            {product.nombre}
          </h3>
          <p className="text-sm text-muted mb-3 line-clamp-1">{product.descripcion}</p>

          <div className="flex items-center gap-2 mb-3">
            {product.enOferta && product.precioOferta ? (
              <>
                <span className="text-xl font-bold text-primary">${product.precioOferta.toFixed(2)}</span>
                <span className="text-sm text-muted line-through">${product.precio.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-xl font-bold text-foreground">${product.precio.toFixed(2)}</span>
            )}
          </div>

          <div className="text-sm text-muted mb-4">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">En Stock</span>
            ) : (
              <span className="text-red-600 font-medium">Agotado</span>
            )}
          </div>

          <Button className="w-full gap-2" disabled={product.stock === 0}>
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </Button>
        </div>
      </div>
    </Link>
  )
}
