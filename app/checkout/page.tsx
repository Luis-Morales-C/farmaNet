"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"
import { ordersApi, type CheckoutData } from "@/lib/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Truck, MapPin, ShoppingBag, ArrowLeft, Lock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, total, subtotal, impuestos: tax, envio: shipping, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [sameAsBilling, setSameAsBilling] = useState(true)

  const [formData, setFormData] = useState<CheckoutData>({
    items: items.map((item) => ({ productId: item.productoId, quantity: item.cantidad })),
    shippingAddress: {
      fullName: user?.name || "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
    },
    billingAddress: {
      fullName: user?.name || "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    paymentMethod: "credit_card",
    paymentDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: user?.name || "",
    },
  })

  // Update formData items when cart items change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      items: items.map((item) => ({ productId: item.productoId, quantity: item.cantidad }))
    }))
  }, [items])

  const handleInputChange = (section: keyof CheckoutData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSubmitOrder = async () => {
    console.log("🟢 handleSubmitOrder ejecutado")
    if (!user) {
      toast.error("Debes iniciar sesión para realizar una compra")
      router.push("/login")
      return
    }

    console.log("👤 Usuario:", user)
    console.log("📦 FormData enviado:", formData)

    setLoading(true)
    try {
      console.log("➡️ Intentando crear orden...")
      const order = await ordersApi.createOrder(formData)
      console.log("✅ Respuesta del backend:", order)
      clearCart()
      toast.success("¡Pedido realizado exitosamente!")
      router.push(`/pedidos/${order.id}`)
    } catch (error) {
      console.error("❌ Error al procesar pedido:", error)
      toast.error("Error al procesar el pedido. Inténtalo de nuevo.")
    } finally {
      console.log("🔚 handleSubmitOrder finalizado")
      setLoading(false)
    }
  }


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Inicia Sesión</h2>
              <p className="text-muted-foreground mb-4">Debes iniciar sesión para continuar con tu compra</p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/registro">Crear Cuenta</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Carrito Vacío</h2>
              <p className="text-muted-foreground mb-4">No tienes productos en tu carrito para procesar</p>
              <Button asChild>
                <Link href="/catalogo">Explorar Productos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/carrito" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Carrito
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
        <p className="text-gray-600">Completa tu pedido de forma segura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Dirección de Envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    value={formData.shippingAddress.fullName}
                    onChange={(e) => handleInputChange("shippingAddress", "fullName", e.target.value)}
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.shippingAddress.phone}
                    onChange={(e) => handleInputChange("shippingAddress", "phone", e.target.value)}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="street">Dirección</Label>
                <Input
                  id="street"
                  value={formData.shippingAddress.street}
                  onChange={(e) => handleInputChange("shippingAddress", "street", e.target.value)}
                  placeholder="Calle, número, apartamento"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleInputChange("shippingAddress", "city", e.target.value)}
                    placeholder="Ciudad"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Departamento</Label>
                  <Input
                    id="state"
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleInputChange("shippingAddress", "state", e.target.value)}
                    placeholder="Departamento"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Código Postal</Label>
                  <Input
                    id="zipCode"
                    value={formData.shippingAddress.zipCode}
                    onChange={(e) => handleInputChange("shippingAddress", "zipCode", e.target.value)}
                    placeholder="110111"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value as any }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card">Tarjeta de Crédito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="debit_card" id="debit_card" />
                  <Label htmlFor="debit_card">Tarjeta Débito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                  <Label htmlFor="cash_on_delivery">Pago Contra Entrega</Label>
                </div>
              </RadioGroup>

              {(formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card") && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="cardholderName">Nombre del Titular</Label>
                    <Input
                      id="cardholderName"
                      value={formData.paymentDetails?.cardholderName || ""}
                      onChange={(e) => handleInputChange("paymentDetails", "cardholderName", e.target.value)}
                      placeholder="Nombre como aparece en la tarjeta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input
                      id="cardNumber"
                      value={formData.paymentDetails?.cardNumber || ""}
                      onChange={(e) => handleInputChange("paymentDetails", "cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                      <Input
                        id="expiryDate"
                        value={formData.paymentDetails?.expiryDate || ""}
                        onChange={(e) => handleInputChange("paymentDetails", "expiryDate", e.target.value)}
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={formData.paymentDetails?.cvv || ""}
                        onChange={(e) => handleInputChange("paymentDetails", "cvv", e.target.value)}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-md overflow-hidden">
                    <Image src={item.imagen || "/placeholder.svg"} alt={item.nombre} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.nombre}</div>
                    <div className="text-sm text-muted-foreground">Cantidad: {item.cantidad}</div>
                  </div>
                  <div className="font-medium">${((item.precioOferta || item.precio) * item.cantidad).toFixed(2)}</div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                  onClick={() => {
                    console.log("✅ Click detectado");
                    handleSubmitOrder();
                  }}
                  disabled={loading}
                  className="w-full"
                  size="lg"
              >
                {loading ? "Procesando..." : "Confirmar Pedido"}
              </Button>


              <div className="text-xs text-muted-foreground text-center">
                Al confirmar tu pedido, aceptas nuestros términos y condiciones
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Entrega estimada: 2-3 días hábiles</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
