import { type Order, type CheckoutData } from './orders.service'

export type { Order, CheckoutData }

// API functions using real backend
import { ordersService } from './orders.service'

export const ordersApi = {
  async createOrder(checkoutData: CheckoutData): Promise<Order> {
    return await ordersService.createOrder(checkoutData)
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    return await ordersService.getUserOrders(userId)
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    return await ordersService.getOrder(orderId)
  },
}
