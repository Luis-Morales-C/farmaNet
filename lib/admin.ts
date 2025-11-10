const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

class AdminService {
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
}

const adminService = new AdminService()

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

// API functions with authentication
export const adminApi = {
  async getStats(): Promise<AdminStats> {
    try {
      const response = await adminService.request<{ success: boolean; data: AdminStats; message: string }>(
        `/api/admin/estadisticas`
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener estadísticas")
      }

      return response.data
    } catch (error) {
      console.error("Error getting admin stats:", error)
      // Fallback to mock data
      return {
        totalProducts: 156,
        totalUsers: 1247,
        totalOrders: 89,
        totalRevenue: 15420.5,
        lowStockProducts: 12,
        pendingOrders: 8,
      }
    }
  },

  async getUsers(): Promise<AdminUser[]> {
    try {
      const response = await adminService.request<{ success: boolean; data: AdminUser[]; message: string }>(
        `/api/admin/usuarios`
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener usuarios")
      }

      return response.data
    } catch (error) {
      console.error("Error getting users:", error)
      // Fallback to mock data
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
    }
  },

  async getOrders(): Promise<AdminOrder[]> {
    try {
      const response = await adminService.request<{ success: boolean; data: AdminOrder[]; message: string }>(
        `/api/admin/pedidos`
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener pedidos")
      }

      return response.data
    } catch (error) {
      console.error("Error getting orders:", error)
      // Fallback to mock data
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
    }
  },

  async getProducts(): Promise<AdminProduct[]> {
    try {
      const response = await adminService.request<{ success: boolean; data: AdminProduct[]; message: string }>(
        `/api/admin/productos`
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener productos")
      }

      return response.data
    } catch (error) {
      console.error("Error getting products:", error)
      // Fallback to mock data
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
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await adminService.request<{ success: boolean; data: any[]; message: string }>(
        `/api/categorias/obtener`
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener categorías")
      }

      return response.data.map((cat: any) => ({
        id: cat.id,
        name: cat.nombre,
        description: cat.descripcion || '',
        productCount: 0,
        status: "active" as const
      }))
    } catch (error) {
      console.error("Error getting categories:", error)
      throw error
    }
  },

  async getPromotions(): Promise<Promotion[]> {
    try {
      const response = await adminService.request<{ success: boolean; data: Promotion[]; message: string }>(
        `/api/admin/promociones`
      )

      if (!response.success) {
        throw new Error(response.message || "Error al obtener promociones")
      }

      return response.data
    } catch (error) {
      console.error("Error getting promotions:", error)
      // Fallback to mock data
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
    }
  },

  async createProduct(product: ProductoForm): Promise<any> {
    try {
      const response = await adminService.request<{ success: boolean; data: any; message: string }>(
        `/api/productos/crear`,
        {
          method: "POST",
          body: JSON.stringify(product),
        }
      )

      if (!response.success) {
        throw new Error(response.message || "Error al crear el producto")
      }

      return response.data
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
  },
}