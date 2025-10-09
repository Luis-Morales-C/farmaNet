// lib/services/carrito.service.ts
import { CartItem } from "@/lib/cart"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface AgregarItemDTO {
  productoId: string
  cantidad: number
}

export interface ActualizarCantidadDTO {
  productoId: string
  cantidad: number
}

export interface EliminarItemDTO {
  productoId: string
}

export interface CarritoItem {
  id: string
  productoId: string
  nombre: string
  marca?: string
  presentacion?: string
  precio: number
  precioOferta?: number
  cantidad: number
  subtotal: number
  imagen?: string
  stock: number
  requiereReceta?: boolean
}

export interface Carrito {
  id: string
  usuarioId: string
  items: CarritoItem[]
  subtotal: number
  total: number
  activo: boolean
  fechaCreacion: string
  fechaActualizacion: string
}

export interface ApiResponse<T> {
  success: boolean
  mensaje?: string
  data?: T
  error?: string
}

class CarritoService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
          ...options.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error en la petición")
      }

      return data
    } catch (error) {
      console.error("Error en request:", error)
      throw error
    }
  }

  async obtenerCarrito(usuarioId: string): Promise<Carrito> {
    const response = await this.request<Carrito>(
      `/api/carrito/obtener/${usuarioId}`
    )
    console.log("Carrito obtenido del backend:", response.data)
    return response.data!
  }

  async agregarProducto(
    usuarioId: string,
    dto: AgregarItemDTO
  ): Promise<Carrito> {
    const response = await this.request<Carrito>(
      `/api/carrito/agregar-producto/${usuarioId}`,
      {
        method: "POST",
        body: JSON.stringify(dto),
      }
    )
    return response.data!
  }

  async actualizarCantidad(
    usuarioId: string,
    dto: ActualizarCantidadDTO
  ): Promise<Carrito> {
    const response = await this.request<Carrito>(
      `/api/carrito/actualizar-cantidad/${usuarioId}`,
      {
        method: "PUT",
        body: JSON.stringify(dto),
      }
    )
    return response.data!
  }

  async eliminarProducto(
    usuarioId: string,
    dto: EliminarItemDTO
  ): Promise<Carrito> {
    const response = await this.request<Carrito>(
      `/api/carrito/eliminar-producto/${usuarioId}`,
      {
        method: "DELETE",
        body: JSON.stringify(dto),
      }
    )
    return response.data!
  }

  async limpiarCarrito(usuarioId: string): Promise<void> {
    await this.request<void>(`/api/carrito/limpiar-carrito/${usuarioId}`, {
      method: "DELETE",
    })
  }

  async eliminarCarrito(usuarioId: string): Promise<void> {
    await this.request<void>(`/api/carrito/eliminar-carrito/${usuarioId}`, {
      method: "DELETE",
    })
  }
}

export const carritoService = new CarritoService()