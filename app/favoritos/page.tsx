"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react"

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated favorites - connect to backend API when ready
    const mockFavorites = [
      {
        id: 1,
        nombre: "Ibuprofeno 400mg",
        precio: 12.99,
        stock: 45,
        imagen: "/ibuprofeno.jpg",
        descripcion: "Analgésico y antiinflamatorio",
        rating: 4.5,
      },
      {
        id: 2,
        nombre: "Vitamina C 1000mg",
        precio: 15.99,
        stock: 120,
        imagen: "/vitamina-c.jpg",
        descripcion: "Vitamina C pura en tabletas",
        rating: 4.8,
      },
      {
        id: 3,
        nombre: "Paracetamol 500mg",
        precio: 9.99,
        stock: 85,
        imagen: "/paracetamol_tablet.png",
        descripcion: "Analgésico y antipirético",
        rating: 4.6,
      },
    ]
    setFavorites(mockFavorites)
    setLoading(false)
  }, [])

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id))
  }

  const addToCart = (product: any) => {
    console.log("Agregado al carrito:", product)
    // TODO: Integrate with cart system
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <h1 className="heading-2 text-foreground">Mis Favoritos</h1>
          <p className="text-muted-foreground mt-2">Productos guardados para comprar después</p>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
            <h2 className="heading-3 text-foreground mb-2">No tienes favoritos aún</h2>
            <p className="text-muted-foreground mb-6">Comienza a guardar tus productos favoritos</p>
            <Link
              href="/catalogo"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-card overflow-hidden">
                  <img
                    src={product.imagen || "/placeholder.svg"}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-destructive hover:text-white transition"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{product.nombre}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.descripcion}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.rating})</span>
                  </div>

                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="heading-3 text-primary">${product.precio}</span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {product.stock} en stock
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
