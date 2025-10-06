"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { carritoService, type Carrito as CarritoBackend } from "@/lib/services/carrito.services"

export interface CartItem {
  id: string
  productoId: string
  nombre: string
  precio: number
  precioOferta?: number
  cantidad: number
  imagen?: string
  marca?: string
  presentacion?: string
  stock: number
  requiereReceta?: boolean
}

interface CartState {
  items: CartItem[]
  total: number
  subtotal: number
  descuentos: number
  impuestos: number
  envio: number
  itemCount: number
  loading: boolean
}

type CartAction =
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_CART" }

const initialState: CartState = {
  items: [],
  total: 0,
  subtotal: 0,
  descuentos: 0,
  impuestos: 0,
  envio: 0,
  itemCount: 0,
  loading: false,
}

function calculateTotals(items: CartItem[]): Omit<CartState, "items" | "loading"> {
  const subtotal = items.reduce((sum, item) => {
    const price = item.precioOferta || item.precio
    return sum + price * item.cantidad
  }, 0)

  const descuentos = items.reduce((sum, item) => {
    if (item.precioOferta) {
      return sum + (item.precio - item.precioOferta) * item.cantidad
    }
    return sum
  }, 0)

  const impuestos = subtotal * 0.16
  const envio = subtotal >= 50 ? 0 : 5.99
  const total = subtotal + impuestos + envio
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0)

  return {
    subtotal,
    descuentos,
    impuestos,
    envio,
    total,
    itemCount,
  }
}

function mapBackendToCartItems(carrito: CarritoBackend): CartItem[] {
  return carrito.items.map((item) => ({
    id: item.id,
    productoId: item.productoId,
    nombre: item.nombre,
    precio: item.precio,
    precioOferta: item.precioOferta,
    cantidad: item.cantidad,
    imagen: item.imagen,
    marca: item.marca,
    presentacion: item.presentacion,
    stock: item.stock,
    requiereReceta: item.requiereReceta,
  }))
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS": {
      return {
        ...state,
        items: action.payload,
        ...calculateTotals(action.payload),
      }
    }

    case "SET_LOADING": {
      return {
        ...state,
        loading: action.payload,
      }
    }

    case "CLEAR_CART": {
      return {
        ...initialState,
      }
    }

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  addToCart: (item: Omit<CartItem, "cantidad">) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, cantidad: number) => Promise<void>
  clearCart: () => Promise<void>
  syncCart: () => Promise<void>
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { toast } = useToast()

  const getUserId = (): string | null => {
    if (typeof window === "undefined") return null
    
    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.id
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error)
    }
    
    return null
  }

  const syncCart = async () => {
    const userId = getUserId()
    if (!userId) {
      dispatch({ type: "CLEAR_CART" })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const carrito = await carritoService.obtenerCarrito(userId)
      const items = mapBackendToCartItems(carrito)
      dispatch({ type: "SET_ITEMS", payload: items })
    } catch (error) {
      console.error("Error al sincronizar carrito:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  useEffect(() => {
    syncCart()
  }, [])

  const addToCart = async (item: Omit<CartItem, "cantidad">) => {
    const userId = getUserId()
    if (!userId) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive",
      })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const carrito = await carritoService.agregarProducto(userId, {
        productoId: item.id,
        cantidad: 1,
      })

      const items = mapBackendToCartItems(carrito)
      dispatch({ type: "SET_ITEMS", payload: items })

      toast({
        title: "Producto agregado",
        description: `${item.nombre} se agregó al carrito`,
      })
    } catch (error: any) {
      console.error("Error al agregar al carrito:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo agregar el producto",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const removeFromCart = async (productoId: string) => {
    const userId = getUserId()
    if (!userId) return

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const carrito = await carritoService.eliminarProducto(userId, {
        productoId,
      })

      const items = mapBackendToCartItems(carrito)
      dispatch({ type: "SET_ITEMS", payload: items })
    } catch (error: any) {
      console.error("Error al eliminar del carrito:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el producto",
        variant: "destructive",
      })
      await syncCart()
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const updateQuantity = async (productoId: string, cantidad: number) => {
    const userId = getUserId()
    if (!userId) return

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      const carrito = await carritoService.actualizarCantidad(userId, {
        productoId,
        cantidad,
      })

      const items = mapBackendToCartItems(carrito)
      dispatch({ type: "SET_ITEMS", payload: items })
    } catch (error: any) {
      console.error("Error al actualizar cantidad:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la cantidad",
        variant: "destructive",
      })
      await syncCart()
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const clearCart = async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      await carritoService.limpiarCarrito(userId)
      dispatch({ type: "CLEAR_CART" })

      toast({
        title: "Carrito vaciado",
        description: "Todos los productos se eliminaron del carrito",
      })
    } catch (error: any) {
      console.error("Error al limpiar carrito:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo limpiar el carrito",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return {
    items: context.state.items,
    total: context.state.total,
    subtotal: context.state.subtotal,
    descuentos: context.state.descuentos,
    impuestos: context.state.impuestos,
    envio: context.state.envio,
    itemCount: context.state.itemCount,
    loading: context.state.loading,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    syncCart: context.syncCart,
  }
}