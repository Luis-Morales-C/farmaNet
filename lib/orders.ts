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

// Mock API functions
export const ordersApi = {
  async createOrder(checkoutData: CheckoutData): Promise<Order> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const orderId = Math.random().toString(36).substr(2, 9)
    const subtotal = 85.5 // Mock calculation
    const tax = subtotal * 0.08
    const shipping = subtotal > 50 ? 0 : 5.99
    const total = subtotal + tax + shipping

    return {
      id: orderId,
      userId: "current-user",
      items: [
        {
          productId: "1",
          productName: "Paracetamol 500mg",
          productImage: "/paracetamol-tablets.jpg",
          quantity: 2,
          price: 8.5,
          total: 17.0,
        },
        {
          productId: "2",
          productName: "Vitamina C 1000mg",
          productImage: "/vitamin-c-tablets.jpg",
          quantity: 1,
          price: 15.99,
          total: 15.99,
        },
      ],
      subtotal,
      tax,
      shipping,
      total,
      status: "pending",
      paymentMethod: checkoutData.paymentMethod,
      shippingAddress: checkoutData.shippingAddress,
      billingAddress: checkoutData.billingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "ORD-001",
        userId,
        items: [
          {
            productId: "1",
            productName: "Paracetamol 500mg",
            productImage: "/paracetamol-tablets.jpg",
            quantity: 2,
            price: 8.5,
            total: 17.0,
          },
        ],
        subtotal: 17.0,
        tax: 1.36,
        shipping: 5.99,
        total: 24.35,
        status: "delivered",
        paymentMethod: "credit_card",
        shippingAddress: {
          fullName: "Juan Pérez",
          street: "Calle 123 #45-67",
          city: "Bogotá",
          state: "Cundinamarca",
          zipCode: "110111",
          phone: "+57 300 123 4567",
        },
        billingAddress: {
          fullName: "Juan Pérez",
          street: "Calle 123 #45-67",
          city: "Bogotá",
          state: "Cundinamarca",
          zipCode: "110111",
        },
        createdAt: "2024-03-15T10:30:00Z",
        updatedAt: "2024-03-18T14:20:00Z",
        trackingNumber: "TRK123456789",
      },
      {
        id: "ORD-002",
        userId,
        items: [
          {
            productId: "2",
            productName: "Vitamina C 1000mg",
            productImage: "/vitamin-c-tablets.jpg",
            quantity: 1,
            price: 15.99,
            total: 15.99,
          },
          {
            productId: "3",
            productName: "Crema Hidratante",
            productImage: "/facial-moisturizer.jpg",
            quantity: 1,
            price: 24.99,
            total: 24.99,
          },
        ],
        subtotal: 40.98,
        tax: 3.28,
        shipping: 0,
        total: 44.26,
        status: "shipped",
        paymentMethod: "debit_card",
        shippingAddress: {
          fullName: "Juan Pérez",
          street: "Calle 123 #45-67",
          city: "Bogotá",
          state: "Cundinamarca",
          zipCode: "110111",
          phone: "+57 300 123 4567",
        },
        billingAddress: {
          fullName: "Juan Pérez",
          street: "Calle 123 #45-67",
          city: "Bogotá",
          state: "Cundinamarca",
          zipCode: "110111",
        },
        createdAt: "2024-03-20T15:45:00Z",
        updatedAt: "2024-03-22T09:15:00Z",
        estimatedDelivery: "2024-03-25T18:00:00Z",
        trackingNumber: "TRK987654321",
      },
    ]
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const orders = await this.getUserOrders("current-user")
    return orders.find((order) => order.id === orderId) || null
  },
}
