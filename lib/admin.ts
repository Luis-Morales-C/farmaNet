import { api } from './api'

export interface AdminStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  lowStockProducts: number
  pendingOrders: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  status: "active" | "inactive"
  createdAt: string
  lastLogin?: string
}

export interface AdminOrder {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
}

export interface AdminProduct {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
  status: "active" | "inactive"
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  productCount: number
  status: "active" | "inactive"
}

export interface Promotion {
  id: string
  name: string
  description: string
  type: "percentage" | "fixed"
  value: number
  startDate: string
  endDate: string
  status: "active" | "inactive"
  applicableProducts: string[]
}
export interface ProductoForm {
  nombre: string
  descripcion: string
  precio: number
  precioOferta?: number
  enOferta?: boolean
  categoria: { id: string }
  imagenUrl: string
  stock: number
  activo: boolean
  laboratorio?: string
  principioActivo?: string
  codigoBarras?: string
  requiereReceta?: boolean
}
// Frontend product form (coincide con tu backend)
export interface ProductoForm {
  nombre: string
  descripcion: string
  precio: number
  precioOferta?: number
  enOferta?: boolean
  categoria: { id: string }
  imagenUrl: string
  stock: number
  activo: boolean
  laboratorio?: string
  principioActivo?: string
  codigoBarras?: string
  requiereReceta?: boolean
}
// Mock API functions
export const adminApi = {
  async getStats(): Promise<AdminStats> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      totalProducts: 156,
      totalUsers: 1247,
      totalOrders: 89,
      totalRevenue: 15420.5,
      lowStockProducts: 12,
      pendingOrders: 8,
    }
  },

  async getUsers(): Promise<AdminUser[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: "1",
        name: "Juan Pérez",
        email: "juan@email.com",
        role: "user",
        status: "active",
        createdAt: "2024-01-15",
        lastLogin: "2024-03-20",
      },
      {
        id: "2",
        name: "María García",
        email: "maria@email.com",
        role: "admin",
        status: "active",
        createdAt: "2024-01-10",
        lastLogin: "2024-03-22",
      },
    ]
  },

  async getOrders(): Promise<AdminOrder[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: "1",
        userId: "1",
        userName: "Juan Pérez",
        userEmail: "juan@email.com",
        items: [
          { productId: "1", productName: "Paracetamol 500mg", quantity: 2, price: 8.5 },
          { productId: "2", productName: "Vitamina C", quantity: 1, price: 15.99 },
        ],
        total: 32.99,
        status: "pending",
        createdAt: "2024-03-22",
        shippingAddress: {
          street: "Calle 123 #45-67",
          city: "Bogotá",
          state: "Cundinamarca",
          zipCode: "110111",
        },
      },
    ]
  },

  async getProducts(): Promise<AdminProduct[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: "1",
        name: "Paracetamol 500mg",
        description: "Analgésico y antipirético",
        price: 8.5,
        stock: 150,
        category: "Medicamentos",
        image: "/paracetamol-tablets.jpg",
        status: "active",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        name: "Vitamina C 1000mg",
        description: "Suplemento vitamínico",
        price: 15.99,
        stock: 5,
        category: "Vitaminas",
        image: "/vitamin-c-tablets.jpg",
        status: "active",
        createdAt: "2024-01-20",
      },
    ]
  },

 async getCategories(): Promise<Category[]> {
  const response = await api.fetch(api.categories.getAll)
  if (!response.ok) throw new Error('Error al cargar categorías')
  const data = await response.json()
  
  return data.map((cat: any) => ({
    id: cat.id,
    name: cat.nombre,  // Mapear nombre del backend a name del frontend
    description: cat.descripcion || '',
    productCount: 0,
    status: "active" as const
   }))
  },

  async getPromotions(): Promise<Promotion[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      {
        id: "1",
        name: "Descuento Vitaminas",
        description: "20% de descuento en todas las vitaminas",
        type: "percentage",
        value: 20,
        startDate: "2024-03-01",
        endDate: "2024-03-31",
        status: "active",
        applicableProducts: ["2", "3", "4"],
      },
    ]
  },
  
 async createProduct(product: ProductoForm) {
    const res = await api.fetch(api.products.list, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
    if (!res.ok) throw new Error("Error al crear el producto")
    return res.json()
  },
}