"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Heart, ShoppingCart, Search, ChevronLeft } from "lucide-react"
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchTerm, setSearchTerm] = useState(query)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(!!query)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("relevancia")

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  useEffect(() => {
    filterAndSort()
  }, [products, priceRange, sortBy])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      // Search in catalog
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/catalogo`)
      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        const filtered = result.data.filter(
          (p: Product) =>
            p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setProducts(filtered)
      }
    } catch (error) {
      console.error("Error searching:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSort = () => {
    const filtered = products.filter((p) => {
      const price = p.precioOferta || p.precio
      return price >= priceRange[0] && price <= priceRange[1]
    })

    switch (sortBy) {
      case "precio-asc":
        filtered.sort((a, b) => (a.precioOferta || a.precio) - (b.precioOferta || b.precio))
        break
      case "precio-desc":
        filtered.sort((a, b) => (b.precioOferta || b.precio) - (a.precioOferta || a.precio))
        break
      case "nombre":
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
        break
      case "ofertas":
        filtered.sort((a, b) => (b.enOferta ? 1 : 0) - (a.enOferta ? 1 : 0))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchTerm)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="flex items-center gap-2 text-primary hover:gap-3 transition mb-6">
          <ChevronLeft className="w-5 h-5" />
          Volver al Inicio
        </Link>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar medicamentos, vitaminas, productos..."
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            />
            <button type="submit" className="absolute right-4 top-3.5 p-2 hover:bg-background rounded-lg transition">
              <Search className="w-5 h-5 text-muted" />
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Buscando productos...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">{filteredProducts.length} resultados encontrados</h1>
              {query && <p className="text-muted">para: "{query}"</p>}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg border border-border p-12 text-center">
                <p className="text-muted text-lg mb-4">No se encontraron productos</p>
                <p className="text-muted text-sm">Intenta con otros términos de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1 bg-white rounded-lg border border-border p-6 h-fit">
                  <h2 className="font-bold text-foreground mb-4">Filtros</h2>

                  <div className="space-y-6">
                    {/* Price Filter */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Rango de Precio</h3>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                            placeholder="Min"
                            className="flex-1 px-2 py-2 border border-border rounded text-sm"
                          />
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                            placeholder="Max"
                            className="flex-1 px-2 py-2 border border-border rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sort */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Ordenar Por</h3>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="relevancia">Relevancia</option>
                        <option value="precio-asc">Precio: Menor a Mayor</option>
                        <option value="precio-desc">Precio: Mayor a Menor</option>
                        <option value="nombre">Nombre: A-Z</option>
                        <option value="ofertas">Ofertas</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
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
