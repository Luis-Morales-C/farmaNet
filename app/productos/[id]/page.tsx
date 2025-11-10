"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, ChevronLeft, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  marca: string
  presentacion: string
  laboratorio: string
  principioActivo: string
  requiereReceta: boolean
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await api.fetch(api.products.get(params.id))
      const result = await response.json()
      if (result.success) {
        setProduct(result.data)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-12">Cargando...</div>
  if (!product) return <div className="text-center py-12">Producto no encontrado</div>

  const finalPrice = product.enOferta && product.precioOferta ? product.precioOferta : product.precio
  const discount =
    product.enOferta && product.precioOferta
      ? Math.round(((product.precio - product.precioOferta) / product.precio) * 100)
      : 0

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/catalogo" className="flex items-center gap-2 text-primary hover:gap-3 transition mb-6">
          <ChevronLeft className="w-5 h-5" />
          Volver al Catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="bg-background rounded-lg p-8 flex items-center justify-center">
            <img
              src={product.imagen || "/placeholder.svg?height=400&width=400&query=medication"}
              alt={product.nombre}
              className="max-h-96 object-contain"
            />
          </div>

          {/* Product Info */}
          <div>
            {product.requiereReceta && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
                ⚠️ Este producto requiere receta médica
              </div>
            )}

            <h1 className="text-3xl font-bold text-foreground mb-2">{product.nombre}</h1>
            <p className="text-muted mb-4">{product.descripcion}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-muted">Marca</p>
                <p className="font-semibold text-foreground">{product.marca}</p>
              </div>
              <div>
                <p className="text-muted">Presentación</p>
                <p className="font-semibold text-foreground">{product.presentacion}</p>
              </div>
              <div>
                <p className="text-muted">Laboratorio</p>
                <p className="font-semibold text-foreground">{product.laboratorio}</p>
              </div>
              <div>
                <p className="text-muted">Principio Activo</p>
                <p className="font-semibold text-foreground">{product.principioActivo}</p>
              </div>
            </div>

            {/* Price */}
            <div className="bg-background rounded-lg p-6 mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-primary">${finalPrice.toFixed(2)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-muted line-through">${product.precio.toFixed(2)}</span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-{discount}%</span>
                  </>
                )}
              </div>
              <div className="text-sm text-muted">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">En Stock ({product.stock} unidades)</span>
                ) : (
                  <span className="text-red-600 font-medium">Agotado</span>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">Cantidad</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-border rounded-lg hover:bg-background transition"
                >
                  −
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 border border-border rounded-lg hover:bg-background transition disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button size="lg" className="flex-1 gap-2" disabled={product.stock === 0}>
                <ShoppingCart className="w-5 h-5" />
                Agregar al Carrito
              </Button>
              <button className="w-12 h-12 border border-border rounded-lg hover:bg-background transition flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </button>
            </div>

            {/* Benefits */}
            <div className="space-y-3 border-t border-b border-border py-6">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">Envío gratuito en compras mayores a $50</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">Productos 100% certificados y de confianza</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm">Devolución fácil dentro de 30 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
