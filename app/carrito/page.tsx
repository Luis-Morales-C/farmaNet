"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: string
  nombre: string
  precio: number
  cantidad: number
  imagen?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const user = localStorage.getItem("user");
        
        if (token && user) {
          const userData = JSON.parse(user);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carrito/obtener/${userData.id}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data && Array.isArray(result.data.items)) {
             setCartItems(result.data.items);
              return;
            }
          }
        }
        
        // Fallback to localStorage if API fails or user not logged in
        const cart = localStorage.getItem("cart");
        if (cart) {
          setCartItems(JSON.parse(cart));
        }
      } catch (error) {
       console.error("Error fetching cart:", error);
        // Fallback to localStorage on error
        const cart = localStorage.getItem("cart");
        if (cart) {
          setCartItems(JSON.parse(cart));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [])

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    const token = localStorage.getItem("auth-token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      try {
const userData = JSON.parse(user);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carrito/actualizar-cantidad/${userData.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
         },
          body: JSON.stringify({
            productoId: id,
            cantidad: quantity
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          setCartItems(result.data.items);
          return;
        }
      } catch (error) {
        console.error("Error updating cartitem:", error);
      }
    }
    
    // Fallback to localStorage if API fails or user not logged in
    const updated = cartItems.map((item) => (item.id === id ? { ...item, cantidad: quantity } : item));
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  const removeItem = async (id: string) => {
    const token = localStorage.getItem("auth-token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carrito/eliminar-producto/${userData.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            productoId: id
          })
        });
        
        if (response.ok) {
          const result =await response.json();
          setCartItems(result.data.items);
          return;
        }
      } catch (error) {
        console.error("Error removingcart item:", error);
      }
    }
    
    // Fallback to localStorage if API fails or user not logged in
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

const subtotal= cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const shipping = subtotal > 50 ? 0 : 5
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  if (loading)return <div className="text-center py-12">Cargando...</div>

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/catalogo" className="flex items-center gap-2 text-primary hover:gap-3 transition mb-6">
          <ChevronLeft className="w-5 h-5" />
          Continuar Comprando
        </Link>

        <h1 className="text-3xl font-bold text-foregroundmb-8">Mi Carrito</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <p className="text-muted text-lg mb-4">Tu carrito está vacío</p>
            <p className="text-muted text-sm mb-6">Agrega productos para comenzar tu compra</p>
            <Link href="/catalogo">
              <Button>Explorar Productos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id}className="bg-white rounded-lg border border-border p-6">
                  <div className="flex gap-4 md:flex-row flex-col">
                    <img
                      src={item.imagen || "/placeholder.svg?height=100&width=100&query=product"}
                      alt={item.nombre}
className="w-24 h-24 object-cover rounded-lg bg-background"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/productos/${item.id}`}
                        className="font-semibold text-foreground hover:text-primary transition"
                      >
                        {item.nombre}
                      </Link>
<p className="text-2xl font-bold text-primary mt-2">${item.precio.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:flex-col">
                      <div className="flex items-center gap-2 bg-background rounded-lg p-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          className="p-1 hover:bg-white rounded transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="p-1 hover:bg-white rounded transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
</div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-border p-6 h-fit">
              <h2 className="text-xl font-bold text-foreground mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Impuestos (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
             </div>

              <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              {subtotal < 50 && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-6">
                  Agrega ${(50 - subtotal).toFixed(2)} más para envío gratis
                </p>
              )}

              <Link href="/checkout">
                <Button className="w-full mb-3">Proceder al Pago</Button>
              </Link>

              <Button variant="outline" className="w-full bg-transparent">
                Seguir Comprando
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
