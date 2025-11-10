// lib/orders.service.ts
import { Order, CheckoutData } from './orders'
import { authService } from './auth'
import { api } from './api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Función para manejar llamadas API con autenticación
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth-token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await api.fetch(endpoint, {
    ...defaultOptions,
    ...options,
  });

  // Si recibimos un 401, probablemente el token haya expirado
  if (response.status === 401) {
    // Redirigir a login o mostrar mensaje
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }

  return response;
}

class OrdersService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await apiCall(endpoint, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }

  async createOrder(checkoutData: CheckoutData): Promise<Order> {
    try {
      const response = await this.request<{ success: boolean; data: Order; message: string }>(
        api.orders.create,
        {
          method: "POST",
          body: JSON.stringify(checkoutData),
        }
      )

      if (!response.success) {
        throw new Error(response.message || "Error al crear el pedido")
      }

      return response.data
    } catch (err) {
      const error = err as any
      console.error("Error creating order:", error)
      throw error
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await this.request<{ success: boolean; data: Order[]; message: string }>(
        api.orders.getUserOrders(userId)
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener pedidos")
      }

      return response.data
    } catch (err) {
      const error = err as any
      console.error("Error getting user orders:", error)
      throw error
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await this.request<{ success: boolean; data: Order; message: string }>(
        api.orders.get(orderId)
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener pedido")
      }

      return response.data
    } catch (err) {
      const error = err as any
      console.error("Error getting order:", error)
      if (typeof error?.message === 'string' && (error.message.includes('404') || error.message.includes('not found'))) {
        return null
      }
      throw error
    }
  }
}

export const ordersService = new OrdersService()