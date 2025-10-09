export interface Order {
  id: string
  userId: string
  items: Array<{
    productId: string
    productName: string
    productImage: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery"
  shippingAddress: {
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  billingAddress: {
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

export interface CheckoutData {
  items: Array<{
    productId: string
    quantity: number
  }>
  shippingAddress: {
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
    phone: string
  }
  billingAddress: {
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "cash_on_delivery"
  paymentDetails?: {
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    cardholderName?: string
  }
}

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
    return await ordersService.getOrderById(orderId)
  },
}
