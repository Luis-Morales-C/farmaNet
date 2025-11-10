// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {
  // Generic fetch function with credentials
  fetch: async (url: string, options: RequestInit = {}) => {
    return await fetch(url, {
      credentials: 'include',
      ...options,
    });
  },
  
  // Auth endpoints (documentación: /api/auth/...)
  auth: {
    register: `${API_BASE_URL}/api/auth/registro`,
    login: `${API_BASE_URL}/api/auth/login`,
    logout: `${API_BASE_URL}/api/auth/logout`,
  },

  // User endpoints (some backends usan /api/usuarios/...)
  user: {
    get: (id: string) => `${API_BASE_URL}/api/usuarios/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/usuarios/${id}`,
    changePassword: `${API_BASE_URL}/api/usuarios/cambiar-password`,
    deleteAccount: `${API_BASE_URL}/api/usuarios/cuenta`,
    checkEmail: (email: string) => `${API_BASE_URL}/api/usuarios/existe/${email}`,
  },

  // Products (Product Controller)
  products: {
    list: `${API_BASE_URL}/api/productos`, // GET (opcional con query params)
    get: (id: string) => `${API_BASE_URL}/api/productos/${id}`,
    byCategory: (categoryId: string) => `${API_BASE_URL}/api/productos/categoria/${categoryId}`,
  },

  // Catalog endpoints (catalogo controller)
  catalog: {
    getAll: `${API_BASE_URL}/api/catalogo`,
    search: (term: string) => `${API_BASE_URL}/api/catalogo/buscar?nombre=${encodeURIComponent(term)}`,
    offers: `${API_BASE_URL}/api/catalogo/ofertas`,
    byCategory: (categoryId: string) => `${API_BASE_URL}/api/catalogo/categoria/${categoryId}`,
  },
  
  // Cart endpoints (según documentación)
  cart: {
    get: `${API_BASE_URL}/api/carrito`, // GET obtiene el carrito del usuario (sesión/cookie)
    add: `${API_BASE_URL}/api/carrito/agregar`, // POST
    update: `${API_BASE_URL}/api/carrito/actualizar`, // POST
    remove: `${API_BASE_URL}/api/carrito/eliminar`, // POST
    resumen: `${API_BASE_URL}/api/carrito/resumen`, // GET
  },
  
  // Categories endpoints (Categoria Controller)
  categories: {
    getAll: `${API_BASE_URL}/api/categorias/obtener`,
    raiz: `${API_BASE_URL}/api/categorias/raiz`,
    subcategories: (parentId: string) => `${API_BASE_URL}/api/categorias/subcategorias/${parentId}`,
    search: `${API_BASE_URL}/api/categorias/buscar`,
    get: (id: string) => `${API_BASE_URL}/api/categorias/${id}`,
  },

  // Comments (si el backend tiene comentarios)
  comments: {
    base: `${API_BASE_URL}/api/comments`,
    forProduct: (productId: string) => `${API_BASE_URL}/api/comments/product/${productId}`,
    create: `${API_BASE_URL}/api/comments`,
    markHelpful: (commentId: string) => `${API_BASE_URL}/api/comments/${commentId}/helpful`,
  },
  
  // Favorites endpoints
  favorites: {
    getAll: `${API_BASE_URL}/api/favoritos`,
    check: (productId: string) => `${API_BASE_URL}/api/favoritos/verificar/${productId}`,
    add: (productId: string) => `${API_BASE_URL}/api/favoritos/${productId}`,
    remove: (productId: string) => `${API_BASE_URL}/api/favoritos/${productId}`,
  },
  
  // Orders endpoints
  orders: {
    create: `${API_BASE_URL}/api/pedidos/crear`,
    getUserOrders: (userId: string) => `${API_BASE_URL}/api/pedidos/usuario/${userId}`,
    get: (orderId: string) => `${API_BASE_URL}/api/pedidos/${orderId}`,
  },

  // Notifications (por si se usan directamente)
  notifications: {
    list: `${API_BASE_URL}/api/notificaciones`,
    unreadCount: `${API_BASE_URL}/api/notificaciones/no-leidas`,
    markRead: (id: string) => `${API_BASE_URL}/api/notificaciones/${id}/marcar-leida`,
    markAllRead: `${API_BASE_URL}/api/notificaciones/marcar-todas-leidas`,
    delete: (id: string) => `${API_BASE_URL}/api/notificaciones/${id}`,
  }
};