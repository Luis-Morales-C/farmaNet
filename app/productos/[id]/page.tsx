"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, Shield, Truck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { type Producto, productService } from "@/lib/products"
import { CommentForm } from "@/components/products/comment-form"
import { CommentsSection } from "@/components/products/comments-section"

export default function ProductoPage() {
  const params = useParams()
  const { toast } = useToast()
  const { addToCart } = useCart()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cantidad, setCantidad] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [refreshComments, setRefreshComments] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadProducto(params.id as string)
    }
  }, [params.id])

  const loadProducto = async (id: string) => {
    try {
      const data = await productService.getProducto(id)
      setProducto(data)
    } catch (error) {
      console.error("Error loading product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCantidadChange = (delta: number) => {
    setCantidad((prev) => Math.max(1, Math.min(producto?.stock || 1, prev + delta)))
  }

  const handleAddToCart = () => {
    if (!producto || producto.stock === 0) return

    addToCart(producto, cantidad)
    toast({
      title: "Producto agregado",
      description: `${cantidad} ${cantidad === 1 ? "unidad" : "unidades"} de ${producto.nombre} agregadas al carrito`,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Producto no encontrado</h1>
            <p className="text-muted-foreground">El producto que buscas no existe o ha sido eliminado.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const precioFinal = producto.precioOferta || producto.precio || 0
  const tieneOferta = !!(producto.precioOferta && producto.precioOferta > 0)
  const descuento = tieneOferta && producto.precio && producto.precio > 0 ? Math.round(((producto.precio - precioFinal) / producto.precio) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={producto.imagen || "/placeholder.svg"}
                  alt={producto.nombre}
                  className="w-full h-96 object-cover rounded-lg"
                />
                {tieneOferta && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                    -{descuento}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{producto.marca}</Badge>
                  {producto.requiereReceta && <Badge variant="destructive">Requiere Receta Médica</Badge>}
                </div>

                <h1 className="text-3xl font-bold mb-2 font-space-grotesk">{producto.nombre}</h1>
                <p className="text-muted-foreground mb-4">{producto.descripcion}</p>

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(producto.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{producto.rating}</span>
                  <span className="text-muted-foreground">({producto.totalReviews} reseñas)</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  {tieneOferta && producto.precio && producto.precio > 0 && (
                    <span className="text-xl text-muted-foreground line-through">${(producto.precio || 0).toFixed(2)}</span>
                  )}
                  <span className="text-3xl font-bold text-primary">${(precioFinal || 0).toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{producto.presentacion}</p>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${producto.stock > 10 ? "bg-green-500" : producto.stock > 0 ? "bg-yellow-500" : "bg-red-500"}`}
                />
                <span className="text-sm">
                  {producto.stock > 10
                    ? "En stock"
                    : producto.stock > 0
                      ? `Solo ${producto.stock} disponibles`
                      : "Agotado"}
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Cantidad:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCantidadChange(-1)}
                      disabled={cantidad <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{cantidad}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCantidadChange(1)}
                      disabled={cantidad >= producto.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" size="lg" disabled={producto.stock === 0} onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {producto.stock === 0 ? "Agotado" : "Agregar al Carrito"}
                  </Button>

                  <Button variant="outline" size="lg" onClick={() => setIsFavorite(!isFavorite)}>
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>

                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Producto Certificado</p>
                </div>
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Envío Gratis +$50</p>
                </div>
                <div className="text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-xs text-muted-foreground">Entrega 24-48h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="descripcion" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="descripcion">Descripción</TabsTrigger>
              <TabsTrigger value="informacion">Información</TabsTrigger>
              <TabsTrigger value="comentarios">Comentarios</TabsTrigger>
            </TabsList>

            <TabsContent value="descripcion" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Descripción del Producto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{producto.descripcion}</p>
                  {producto.instrucciones && (
                    <div>
                      <h4 className="font-semibold mb-2">Instrucciones de Uso:</h4>
                      <p className="text-muted-foreground">{producto.instrucciones}</p>
                    </div>
                  )}
                  {producto.contraindicaciones && (
                    <div>
                      <h4 className="font-semibold mb-2">Contraindicaciones:</h4>
                      <p className="text-muted-foreground">{producto.contraindicaciones}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="informacion" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información Técnica</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Detalles del Producto</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Marca:</span>
                          <span>{producto.marca}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Presentación:</span>
                          <span>{producto.presentacion}</span>
                        </div>
                        {producto.ingredienteActivo && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ingrediente Activo:</span>
                            <span>{producto.ingredienteActivo}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Requiere Receta:</span>
                          <span>{producto.requiereReceta ? "Sí" : "No"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha de Vencimiento:</span>
                          <span>{new Date(producto.fechaVencimiento).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Etiquetas</h4>
                      <div className="flex flex-wrap gap-2">
                        {producto.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comentarios" className="mt-6 space-y-6">
              <CommentForm 
                productoId={producto.id} 
                onCommentAdded={() => setRefreshComments(!refreshComments)}
              />
              <CommentsSection 
                productoId={producto.id}
                triggerRefresh={refreshComments}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
