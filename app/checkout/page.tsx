"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    numeroTarjeta: "",
    nombreTarjeta: "",
    vencimiento: "",
    cvv: "",
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const cart = localStorage.getItem("cart")

    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
      if (cart) {
        setCartItems(JSON.parse(cart))
      }
      setLoading(false)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Clear cart and redirect
      localStorage.removeItem("cart")
      router.push("/pedidos?exito=true")
    } finally {
      setProcessing(false)
    }
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const shipping = subtotal > 50 ? 0 : 5
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/carrito" className="flex items-center gap-2 text-primary hover:gap-3 transition mb-6">
          <ChevronLeft className="w-5 h-5" />
          Volver al Carrito
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Dirección de Envío</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle y número"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Ciudad</label>
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      placeholder="Ciudad"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Código Postal</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      placeholder="Código postal"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Información de Pago</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nombre en la Tarjeta</label>
                  <input
                    type="text"
                    name="nombreTarjeta"
                    value={formData.nombreTarjeta}
                    onChange={handleChange}
                    placeholder="Como aparece en la tarjeta"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Número de Tarjeta</label>
                  <input
                    type="text"
                    name="numeroTarjeta"
                    value={formData.numeroTarjeta}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Vencimiento</label>
                    <input
                      type="text"
                      name="vencimiento"
                      value={formData.vencimiento}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={processing} className="w-full mt-6">
                  {processing ? "Procesando..." : "Completar Compra"}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg border border-border p-6 h-fit">
            <h2 className="text-xl font-bold text-foreground mb-6">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.nombre} x{item.cantidad}
                  </span>
                  <span className="font-medium">${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted text-sm">
                <span>Envío</span>
                <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-muted text-sm">
                <span>Impuestos</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
