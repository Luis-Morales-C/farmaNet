const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

class AdminService {
  public async request<T>(
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
      const errorText = await response.text()
      console.error(`Error en la solicitud a ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`)
    }

    const text = await response.text()
    if (!text){
      return {} as T
    }

    const data = JSON.parse(text)
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
      console.log("Intentando obtener estadísticas desde: /api/admin/dashboard/stats")
      const response = await adminService.request<any>(`/api/admin/dashboard/stats`)

      //Transformar la respuesta al formato esperado
      const stats: AdminStats = {
        totalProducts: response.totalProducts || 0,
        totalUsers: response.totalUsers || 0,
        totalOrders: response.totalOrders || 0,
        totalRevenue: response.totalRevenue || 0,
        lowStockProducts: response.lowStockProducts || 0,
        pendingOrders: response.pendingOrders || 0,
      }

      console.log("Estadísticas obtenidas exitosamente")
      return stats
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
      console.log("Intentando obtener usuarios desde: /api/admin/usuarios")
      const response = await adminService.request<any>(`/api/admin/usuarios`)

      // Transformar la respuesta al formato esperado
      let users: any[] = []
      if (Array.isArray(response)) {
        users = response
      } else if (response.data && Array.isArray(response.data)) {
        users = response.data
      } else if (response.usuarios && Array.isArray(response.usuarios)) {
        users = response.usuarios
      }

      const mappedUsers: AdminUser[] = users.map((user: any) => ({
        id: user.id?.toString() || '',
        name: user.nombre || user.name || '',
        email: user.email || '',
        role: (user.rol || user.role || 'user') as "user" | "admin",
        status: user.activo ? 'active' : 'inactive',
        createdAt: user.fechaRegistro || user.createdAt || '',
        lastLogin: user.ultimoLogin || user.lastLogin || undefined,
      }))

      console.log("Usuarios obtenidos exitosamente")
      return mappedUsers
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
      console.log("Intentando obtener pedidos desde: /api/admin/pedidos")
      const response = await adminService.request<any>(`/api/admin/pedidos`)

      // Transformar la respuesta al formato esperado
      let orders: any[] = []
      if (Array.isArray(response)) {
        orders = response
      } else if (response.data && Array.isArray(response.data)) {
        orders = response.data
      } else if (response.pedidos && Array.isArray(response.pedidos)) {
        orders = response.pedidos
      }

      const mappedOrders = orders.map((order: any) => ({
        id: order.id,
        userId: order.usuario?.id || order.userId || '',
        userName: order.usuario?.nombre || order.userName || '',
        userEmail: order.usuario?.email || order.userEmail || '',
        items: Array.isArray(order.items) ? order.items.map((item: any) => ({
          productId: item.producto?.id || item.productId || '',
          productName: item.producto?.nombre || item.productName || '',
          quantity: item.cantidad || item.quantity || 0,
          price: item.precio || item.price || 0,
        })) : [],
        total: order.total || 0,
        status: order.estado || order.status || 'pending',
        createdAt: order.fecha || order.createdAt || '',
        shippingAddress: order.direccionEnvio || order.shippingAddress || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
      }))

      console.log("Pedidos obtenidos exitosamente")
      return mappedOrders
} catch (error) {
      console.error("Error getting orders:",error)
      // Fallback to mock data
      return [
        {
          id: "1",
          userId: "1",
          userName: "Juan Pérez",
          userEmail: "juan@email.com",
          items: [
            { productId: "1", productName: "Paracetamol 500mg", quantity: 2, price: 8.5 },
            { productId: "2", productName:"Vitamina C", quantity: 1, price: 15.99 },
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
      console.log("Intentando obtener productos desde: /api/admin/productos")
      const response = await adminService.request<any>(`/api/admin/productos`)

      // Transformar la respuesta al formato esperado
      let products: any[] = []
      if (Array.isArray(response)) {
        products = response
      } else if (response.data && Array.isArray(response.data)) {
        products = response.data
      } else if (response.productos && Array.isArray(response.productos)) {
        products = response.productos
      }

      const mappedProducts: AdminProduct[] = products.map((product: any) => ({
        id: product.id?.toString() || '',
        name: product.nombre || product.name || '',
        description: product.descripcion || product.description || '',
        price: product.precio || product.price || 0,
        stock: product.stock || product.cantidad || 0,
        category: product.categoria?.nombre || product.category || '',
        image: product.imagenUrl || product.image || '',
        status: (product.activo ? 'active' : 'inactive') as "active" | "inactive",
        createdAt: product.fechaRegistro || product.createdAt || '',
      }))

      console.log("Productos obtenidos exitosamente")
return mappedProducts
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
      console.log("Intentando obtener categorías desde: /api/categorias/obtener")
      const response = await adminService.request<any>(`/api/categorias/obtener`)

      // Transformar la respuesta al formato esperado
      let categories: any[] = []
      if (Array.isArray(response)) {
        categories = response
      } else if (response.data && Array.isArray(response.data)) {
        categories = response.data
      } else if (response.categorias && Array.isArray(response.categorias)) {
        categories = response.categorias
      }

      const mappedCategories: Category[] = categories.map((cat: any) => ({
        id: cat.id?.toString() || '',
        name: cat.nombre || cat.name || '',
        description: cat.descripcion || cat.description || '',
        productCount: cat.productCount !== undefined ? cat.productCount : (cat.cantidadProductos || 0),
        status: (cat.activo ? 'active' : 'inactive') as "active" | "inactive",
      }))

      console.log("Categorías obtenidas exitosamente:", mappedCategories)
      return mappedCategories
   } catch (error) {
      console.error("Error getting categories:", error)
      throw error
}
  },

async getPromotions(): Promise<Promotion[]> {
    try {
      console.log("Intentando obtener promociones desde: /api/ofertas")
      const response = await adminService.request<any>(`/api/ofertas`)

      // Transformar la respuesta al formato esperado
      let promotions: any[] = []
      if (Array.isArray(response)) {
        promotions = response
      } else if (response.data && Array.isArray(response.data)) {
        promotions = response.data
      } else if (response.ofertas && Array.isArray(response.ofertas)) {
        promotions = response.ofertas
      }

      const mappedPromotions: Promotion[] = promotions.map((promo: any) => ({
        id: promo.id?.toString() || '',
        name: promo.nombre || promo.name || '',
        description: promo.descripcion || promo.description || '',
        type: (promo.tipo || promo.type || 'percentage') as "percentage" | "fixed",
        value: promo.valor || promo.value || 0,
        startDate: promo.fechaInicio || promo.startDate || '',
        endDate: promo.fechaFin || promo.endDate || '',
        status: (promo.activo ? 'active' : 'inactive') as "active" | "inactive",
        applicableProducts: Array.isArray(promo.productosAplicables) 
          ? promo.productosAplicables.map((p: any) => (p.id || p).toString()) 
          : []
      }))

      console.log("Promociones obtenidas exitosamente")
      return mappedPromotions
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
      console.log("Intentando crear producto en: /api/productos/crear")
      const response = await adminService.request<any>(
        `/api/productos/crear`,
        {
          method: "POST",
          body: JSON.stringify(product),
        }
      )

      console.log("Producto creado exitosamente")
      return response
    } catch (error) {
      console.error("Error creating product:", error)
      throw error
    }
},
}