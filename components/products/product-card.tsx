"use client"

import Link from "next/link"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart"
import type { Producto } from "@/lib/products"

interface ProductCardProps {
  producto: Producto
  viewMode?: "grid" | "list"
}

export function ProductCard({ producto, viewMode = "grid" }: ProductCardProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const precioFinal = producto.precioOferta || producto.precio
  const tieneOferta = !!producto.precioOferta

  const handleAddToCart = () => {
    if (producto.stock === 0) return

    addToCart(producto, 1)
    toast({
      title: "Producto agregado",
      description: `${producto.nombre} se agregó al carrito`,
    })
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <img
                src={producto.imagen || "/placeholder.svg"}
                alt={producto.nombre}
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Link href={`/productos/${producto.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                      {producto.nombre}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-1">{producto.marca}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{producto.descripcion}</p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{producto.rating}</span>
                    <span className="text-sm text-muted-foreground">({producto.totalReviews})</span>
                  </div>

                  {producto.requiereReceta && (
                    <Badge variant="outline" className="text-xs">
                      Requiere Receta
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {tieneOferta && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${producto.precio.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-primary">${precioFinal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{producto.presentacion}</p>
                  </div>

                  <Button size="sm" disabled={producto.stock === 0} onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    {producto.stock === 0 ? "Agotado" : "Agregar"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={producto.imagen || "/placeholder.svg"}
          alt={producto.nombre}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {tieneOferta && (
          <Badge className="absolute top-2 left-2 bg-destructive">
            -{Math.round(((producto.precio - precioFinal) / producto.precio) * 100)}%
          </Badge>
        )}

        {producto.requiereReceta && (
          <Badge variant="outline" className="absolute top-2 right-2 bg-background">
            Requiere Receta
          </Badge>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-1">
            <Button variant="secondary" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8" asChild>
              <Link href={`/productos/${producto.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <Link href={`/productos/${producto.id}`}>
            <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2 mb-1">{producto.nombre}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{producto.marca}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{producto.descripcion}</p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{producto.rating}</span>
          <span className="text-sm text-muted-foreground">({producto.totalReviews})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            {tieneOferta && (
              <span className="text-sm text-muted-foreground line-through block">${producto.precio.toFixed(2)}</span>
            )}
            <span className="text-lg font-bold text-primary">${precioFinal.toFixed(2)}</span>
          </div>
          <span className="text-xs text-muted-foreground">{producto.presentacion}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={producto.stock === 0}
          variant={producto.stock === 0 ? "secondary" : "default"}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {producto.stock === 0 ? "Agotado" : "Agregar al Carrito"}
        </Button>
      </CardFooter>
    </Card>
  )
}
