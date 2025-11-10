"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Search, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categoriaService, Categoria } from '@/lib/categoria'
import { api } from '@/lib/api'

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

export default function CategoryProductsPage({ params }: { params: { id: string } }) {
  const [category, setCategory] = useState<Categoria | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchCategoryAndProducts()
  }, [params.id])

  const fetchCategoryAndProducts = async () => {
    try {
      const categoriaData = await categoriaService.getCategoriaConSubcategorias(params.id)
      setCategory(categoriaData)
      // Nota: En una implementación completa, aquí se cargarían los productos de esta categoría
    } catch (error) {
      console.error("Error fetching category:", error)
    } finally {
      setLoading(false)
    }
  }

  // Esta función es solo un placeholder - en una implementación real se conectaría al servicio de productos
  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/categorias" className="flex items-center gap-2 text-primary hover:gap-3 transition mb-6">
          <ChevronLeft className="w-5 h-5" />
          Volver a Categorías
        </Link>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Cargando...</p>
          </div>
        ) : (
          <>
            {category && (
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">{category.nombre}</h1>
                <p className="text-muted">{category.descripcion}</p>
              </div>
            )}

            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar en esta categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute right-3 top-3.5 w-5 h-5 text-muted" />
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted text-lg">No se encontraron productos en esta categoría</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="text-center text-sm text-muted">Mostrando {filteredProducts.length} productos</div>
              </>
            )}
          </>
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
            src={product.imagen || "/placeholder.svg?height=200&width=200&query=pharmacy"}
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
