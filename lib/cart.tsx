"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

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
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "cantidad"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; cantidad: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  total: 0,
  subtotal: 0,
  descuentos: 0,
  impuestos: 0,
  envio: 0,
  itemCount: 0,
}

function calculateTotals(items: CartItem[]): Omit<CartState, "items"> {
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

  const impuestos = subtotal * 0.16 // IVA 16%
  const envio = subtotal >= 50 ? 0 : 5.99 // Envío gratis en compras +$50
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

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.productoId === action.payload.id)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.productoId === action.payload.id ? { ...item, cantidad: Math.min(item.cantidad + 1, item.stock) } : item,
        )
      } else {
        const newItem: CartItem = {
          ...action.payload,
          productoId: action.payload.id,
          cantidad: 1,
        }
        newItems = [...state.items, newItem]
      }

      return {
        items: newItems,
        ...calculateTotals(newItems),
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.productoId !== action.payload)
      return {
        items: newItems,
        ...calculateTotals(newItems),
      }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.productoId === action.payload.id
            ? { ...item, cantidad: Math.max(0, Math.min(action.payload.cantidad, item.stock)) }
            : item,
        )
        .filter((item) => item.cantidad > 0)

      return {
        items: newItems,
        ...calculateTotals(newItems),
      }
    }

    case "CLEAR_CART": {
      return {
        ...initialState,
      }
    }

    case "LOAD_CART": {
      return {
        items: action.payload,
        ...calculateTotals(action.payload),
      }
    }

    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  addToCart: (item: Omit<CartItem, "cantidad">) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, cantidad: number) => void
  clearCart: () => void
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("farmanet-cart")
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: items })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("farmanet-cart", JSON.stringify(state.items))
  }, [state.items])

  const addToCart = (item: Omit<CartItem, "cantidad">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
    toast({
      title: "Producto agregado",
      description: `${item.nombre} se agregó al carrito`,
    })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, cantidad: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, cantidad } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
  }
}
