"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from '@/lib/api'

interface Product {
  id: string
  nombre: string
  descripcion: string
  precio: number;
  precioOferta?: number;
  enOferta: boolean
  imagen?: string
  stock: number
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    nombre: "Ibuprofeno 400mg",
    descripcion: "Analgésico y antiinflamatorio",
    precio: 8.99,
    enOferta: false,
    stock: 50,
  },
  {
    id: "2",
    nombre: "Vitamina C 1000mg",
    descripcion: "Suplemento devitamina C",
    precio: 12.5,
    precioOferta: 9.99,
    enOferta: true,
    stock: 30,
  },
  {
    id: "3",
    nombre: "Protector Solar SPF50",
    descripcion: "ProtecciónUV completa",
    precio: 18.99,
    enOferta: false,
    stock: 25,
  },
  {
    id: "4",
    nombre: "Multivitamínico Diario",
    descripcion: "Complejo vitamínico completo",
    precio:15.99,
    enOferta: false,
    stock: 40,
  },
  {
    id: "5",
    nombre: "Paracetamol 500mg",
    descripcion: "Analgésico y antipirético",
    precio: 7.5,
    enOferta: false,
    stock: 60,
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
    id: "7",
    nombre: "Gel de Aloe Vera",
    descripcion: "Para irritaciones de piel",
    precio: 11.99,
enOferta: false,
    stock: 45,
  },
  { id: "8", nombre: "Magnesio 300mg", descripcion: "Mineral esencial", precio: 13.5, enOferta: false, stock: 50 },
]

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("relevancia")

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, sortBy])

  const fetchProducts = async () => {
try{
      console.log("[v0] Fetching catalog from API")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await api.fetch(api.catalog.getAll, {
       method:"GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("[v0] Catalog response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
}

      const result = await response.json()
      console.log("[v0] Catalog data received:", result.data?.length)

      if (result.success && Array.isArray(result.data)) {
        setProducts(result.data)
      } else {
        throw new Error("Formato de respuesta inválido")
      }
   } catch(error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      console.error("[v0] Error fetching products:", errorMessage)
      setError(errorMessage)
      setProducts(DEMO_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts= ()=> {
    let filtered = products

    if (searchTerm) {
      filtered = products.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

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
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-white">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Catálogo deProductos</h1>

          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <p className="font-medium">⚠️ Datos de demostración</p>
<p className="text-xs mt-1">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative md:col-span-2">
              <input
                type="text"
                placeholder="Buscar medicamentos, vitaminas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute right-3 top-3.5 w-5 h-5 text-muted" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2focus:ring-primary"
           >
              <option value="relevancia">Ordenar por: Relevancia</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
<option value="nombre">Nombre: A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Cargando productos...</p>
          </div>
        ) :filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
{filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center text-sm text-muted">
              Mostrando {filteredProducts.length} de {products.length} productos
            </div>
          </>
       )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const[isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      try {
        const response = await api.fetch(api.favorites.check(product.id))

        if (response.ok) {
          const result = await response.json();
          setIsFavorite(result.data);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [product.id]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
     // Redirect to login or show login prompt
      return;
    }

    setFavoriteLoading(true);
    try {
      let response;
      if (isFavorite) {
        // Remove from favorites
        response = await api.fetch(api.favorites.remove(product.id), {
          method: 'DELETE'
        });
      } else {
        // Add to favorites
        response = await api.fetch(api.favorites.add(product.id), {
          method: 'POST'
        });
      }

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }finally {
      setFavoriteLoading(false);
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("auth-token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      // Redirect to login or show login prompt
      return;
    }

try{
      const userData = JSON.parse(user);
      const response = await api.fetch(api.cart.add, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productoId: product.id, cantidad: 1, usuarioId: userData.id })
      });

      if (response.ok) {
        // Show success message or update cart count
        console.log("Product added to cart");
      }
    } catch (error) {
      console.error("Error addingto cart:", error);
    }
  };

  return (
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
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite();
          }}
          className="absolute top-2 left-2 p-2 bg-white rounded-full shadow hover:shadow-lg transition opacity-0 group-hover:opacity-100"
          disabled={favoriteLoading}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-red-500'}`} />
        </button>
      </div>

      <Link href={`/productos/${product.id}`} className="p-4 block">
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

        <Button 
          className="w-full gap-2" 
          disabled={product.stock === 0}
          onClick={(e) => {
            e.preventDefault();
            addToCart();
          }}
        >
          <ShoppingCart className="w-4 h-4" />
Agregar
        </Button>
      </Link>
    </div>
  )
}
