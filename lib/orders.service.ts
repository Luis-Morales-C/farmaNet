// lib/orders.service.ts
import { Order, CheckoutData } from './orders'
import { authService } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

class OrdersService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('auth-token')

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...options.headers,
      },
    })

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
        `/api/pedidos/crear`,
        {
          method: "POST",
          body: JSON.stringify(checkoutData),
        }
      )

      if (!response.success) {
        throw new Error(response.message || "Error al crear el pedido")
      }

      return response.data
    } catch (error) {
      console.error("Error creating order:", error)
      throw error
    }
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const response = await this.request<{ success: boolean; data: Order[]; message: string }>(
        `/api/pedidos/usuario/${userId}`
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener pedidos")
      }

      return response.data
    } catch (error) {
      console.error("Error getting user orders:", error)
      throw error
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const response = await this.request<{ success: boolean; data: Order; message: string }>(
        `/api/pedidos/${orderId}`
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener pedido")
      }

      return response.data
    } catch (error) {
      console.error("Error getting order:", error)
      if (error.message.includes('404') || error.message.includes('not found')) {
        return null
      }
      throw error
    }
  }
}

export const ordersService = new OrdersService()