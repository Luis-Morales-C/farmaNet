"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function CarritoPage() {
  const { toast } = useToast()
  const { items, total, subtotal, descuentos, impuestos, envio, itemCount, updateQuantity, removeFromCart, clearCart } =
    useCart()
  const [codigoCupon, setCodigoCupon] = useState("")

  const handleQuantityChange = (productoId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productoId)
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del carrito",
      })
    } else {
      updateQuantity(productoId, newQuantity)
    }
  }

  const handleRemoveItem = (productoId: string, nombre: string) => {
    removeFromCart(productoId)
    toast({
      title: "Producto eliminado",
      description: `${nombre} se eliminó del carrito`,
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos se eliminaron del carrito",
    })
  }

  const aplicarCupon = () => {
    // Mock coupon functionality
    if (codigoCupon.toLowerCase() === "descuento10") {
      toast({
        title: "Cupón aplicado",
        description: "Se aplicó un descuento del 10%",
      })
    } else {
      toast({
        title: "Cupón inválido",
        description: "El código de cupón no es válido",
        variant: "destructive",
      })
    }
    setCodigoCupon("")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>

              <h1 className="text-2xl font-bold mb-2 font-space-grotesk">Tu carrito está vacío</h1>
              <p className="text-muted-foreground mb-8">
                Agrega algunos productos a tu carrito para continuar con tu compra
              </p>

              <div className="space-y-3">
                <Button size="lg" asChild className="w-full">
                  <Link href="/catalogo">Explorar Productos</Link>
                </Button>

                <Button variant="outline" size="lg" asChild className="w-full bg-transparent">
                  <Link href="/categorias">Ver Categorías</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/catalogo">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-space-grotesk">Carrito de Compras</h1>
              <p className="text-muted-foreground">
                {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Productos</h2>
                <Button variant="ghost" size="sm" onClick={handleClearCart}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar Carrito
                </Button>
              </div>

              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.imagen || "/placeholder.svg"}
                          alt={item.nombre}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold line-clamp-1">{item.nombre}</h3>
                            <p className="text-sm text-muted-foreground">{item.marca}</p>
                            <p className="text-xs text-muted-foreground">{item.presentacion}</p>
                            {item.requiereReceta && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Requiere Receta
                              </Badge>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.productoId, item.nombre)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.productoId, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-2 min-w-[2.5rem] text-center text-sm">{item.cantidad}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.productoId, item.cantidad + 1)}
                              disabled={item.cantidad >= item.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              {item.precioOferta && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${(item.precio * item.cantidad).toFixed(2)}
                                </span>
                              )}
                              <span className="font-semibold text-primary">
                                ${((item.precioOferta || item.precio) * item.cantidad).toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              ${(item.precioOferta || item.precio).toFixed(2)} c/u
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Coupon Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Código de Descuento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ingresa tu código"
                      value={codigoCupon}
                      onChange={(e) => setCodigoCupon(e.target.value)}
                    />
                    <Button onClick={aplicarCupon} disabled={!codigoCupon}>
                      Aplicar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Prueba con: <code className="bg-muted px-1 rounded">DESCUENTO10</code>
                  </p>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({itemCount} productos)</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    {descuentos > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Descuentos</span>
                        <span>-${descuentos.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Impuestos (IVA 16%)</span>
                      <span>${impuestos.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <span>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>

                  <Button size="lg" className="w-full" asChild>
                    <Link href="/checkout">Proceder al Pago</Link>
                  </Button>

                  <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                    <Link href="/catalogo">Continuar Comprando</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Compra 100% segura</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>Envío gratis en compras +$50</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Tag className="h-4 w-4 text-primary" />
                      <span>Mejores precios garantizados</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
