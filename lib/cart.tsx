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
    const price = item.precioOferta || item.precio || 0
    const quantity = item.cantidad || 0
    const itemTotal = Number(price) * Number(quantity)
    return sum + (isNaN(itemTotal) ? 0 : itemTotal)
  }, 0)

  const descuentos = items.reduce((sum, item) => {
    if (item.precioOferta && item.precio && item.precio > item.precioOferta) {
      const discount = (item.precio - item.precioOferta) * (item.cantidad || 0)
      return sum + (isNaN(discount) ? 0 : discount)
    }
    return sum
  }, 0)

  const impuestos = Number(subtotal) * 0.16
  const envio = Number(subtotal) >= 50 ? 0 : 5.99
  const total = Number(subtotal) + Number(impuestos) + Number(envio)
  const itemCount = items.reduce((sum, item) => sum + (item.cantidad || 0), 0)

  return {
    subtotal: isNaN(subtotal) ? 0 : subtotal,
    descuentos: isNaN(descuentos) ? 0 : descuentos,
    impuestos: isNaN(impuestos) ? 0 : impuestos,
    envio: isNaN(envio) ? 0 : envio,
    total: isNaN(total) ? 0 : total,
    itemCount: isNaN(itemCount) ? 0 : itemCount,
  }
}

function mapBackendToCartItems(carrito: CarritoBackend): CartItem[] {
  console.log("Mapeando items del carrito:", carrito.items)
  
  return carrito.items.map((item) => {
    const mappedItem = {
      id: item.id,
      productoId: item.productoId,
      nombre: item.nombre || "Producto sin nombre",
      precio: Number(item.precio) || 0,
      precioOferta: item.precioOferta ? Number(item.precioOferta) : undefined,
      cantidad: Number(item.cantidad) || 1,
      imagen: item.imagen,
      marca: item.marca,
      presentacion: item.presentacion,
      stock: Number(item.stock) || 0,
      requiereReceta: item.requiereReceta || false,
    }
    
    console.log("Item mapeado:", mappedItem)
    return mappedItem
  })
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

  // Obtener el ID del usuario desde localStorage (auth)
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

  // Sincronizar carrito con el backend
  const syncCart = async () => {
    const userId = getUserId()
    if (!userId) {
      dispatch({ type: "CLEAR_CART" })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const carrito = await carritoService.obtenerCarrito(userId)
        const items = mapBackendToCartItems(carrito)
        dispatch({ type: "SET_ITEMS", payload: items })
      } catch (backendError) {
        console.warn("Backend no disponible, cargando desde localStorage:", backendError)
        // Fallback a localStorage
        const localCartKey = `cart_${userId}`
        const existingCart = localStorage.getItem(localCartKey)
        let cartItems: CartItem[] = []

        if (existingCart) {
          try {
            cartItems = JSON.parse(existingCart)
          } catch (e) {
            cartItems = []
          }
        }

        dispatch({ type: "SET_ITEMS", payload: cartItems })
      }
    } catch (error) {
      console.error("Error al sincronizar carrito:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  // Cargar carrito al montar el componente y cuando cambie el usuario
  useEffect(() => {
    syncCart()
    
    // Escuchar evento de login
    const handleUserLogin = () => {
      console.log("Usuario ha iniciado sesión, sincronizando carrito...")
      syncCart()
    }
    
    // Escuchar evento de logout
    const handleUserLogout = () => {
      console.log("Usuario ha cerrado sesión, limpiando carrito...")
      dispatch({ type: "CLEAR_CART" })
    }
    
    window.addEventListener("user-login", handleUserLogin)
    window.addEventListener("user-logout", handleUserLogout)
    
    return () => {
      window.removeEventListener("user-login", handleUserLogin)
      window.removeEventListener("user-logout", handleUserLogout)
    }
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

      // Intentar usar el backend primero
      try {
        const carrito = await carritoService.agregarProducto(userId, {
          productoId: item.id,
          cantidad: 1,
        })

        const items = mapBackendToCartItems(carrito)
        dispatch({ type: "SET_ITEMS", payload: items })
      } catch (backendError) {
        console.warn("Backend no disponible, usando localStorage:", backendError)
        // Fallback a localStorage si el backend falla
        const localCartKey = `cart_${userId}`
        const existingCart = localStorage.getItem(localCartKey)
        let cartItems: CartItem[] = []

        if (existingCart) {
          try {
            cartItems = JSON.parse(existingCart)
          } catch (e) {
            cartItems = []
          }
        }

        // Verificar si el producto ya existe
        const existingItem = cartItems.find(cartItem => cartItem.productoId === item.id)
        if (existingItem) {
          existingItem.cantidad += 1
        } else {
          cartItems.push({
            ...item,
            productoId: item.id,
            cantidad: 1,
          })
        }

        localStorage.setItem(localCartKey, JSON.stringify(cartItems))
        dispatch({ type: "SET_ITEMS", payload: cartItems })
      }

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

      try {
        const carrito = await carritoService.eliminarProducto(userId, {
          productoId,
        })

        const items = mapBackendToCartItems(carrito)
        dispatch({ type: "SET_ITEMS", payload: items })
      } catch (backendError) {
        console.warn("Backend no disponible, eliminando desde localStorage:", backendError)
        // Fallback a localStorage
        const localCartKey = `cart_${userId}`
        const existingCart = localStorage.getItem(localCartKey)
        let cartItems: CartItem[] = []

        if (existingCart) {
          try {
            cartItems = JSON.parse(existingCart)
          } catch (e) {
            cartItems = []
          }
        }

        cartItems = cartItems.filter(item => item.productoId !== productoId)
        localStorage.setItem(localCartKey, JSON.stringify(cartItems))
        dispatch({ type: "SET_ITEMS", payload: cartItems })
      }
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

      try {
        const carrito = await carritoService.actualizarCantidad(userId, {
          productoId,
          cantidad,
        })

        const items = mapBackendToCartItems(carrito)
        dispatch({ type: "SET_ITEMS", payload: items })
      } catch (backendError) {
        console.warn("Backend no disponible, actualizando desde localStorage:", backendError)
        // Fallback a localStorage
        const localCartKey = `cart_${userId}`
        const existingCart = localStorage.getItem(localCartKey)
        let cartItems: CartItem[] = []

        if (existingCart) {
          try {
            cartItems = JSON.parse(existingCart)
          } catch (e) {
            cartItems = []
          }
        }

        const itemToUpdate = cartItems.find(item => item.productoId === productoId)
        if (itemToUpdate) {
          itemToUpdate.cantidad = cantidad
          localStorage.setItem(localCartKey, JSON.stringify(cartItems))
          dispatch({ type: "SET_ITEMS", payload: cartItems })
        }
      }
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

      try {
        await carritoService.limpiarCarrito(userId)
        dispatch({ type: "CLEAR_CART" })
      } catch (backendError) {
        console.warn("Backend no disponible, limpiando desde localStorage:", backendError)
        // Fallback a localStorage
        const localCartKey = `cart_${userId}`
        localStorage.removeItem(localCartKey)
        dispatch({ type: "CLEAR_CART" })
      }

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