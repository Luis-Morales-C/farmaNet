const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

import { api } from './api'

export interface ApiResponse<T> {
  success: boolean;
  mensaje: string;
  data?: T;
  error?: string;
}

export interface CarritoResponse {
  success: boolean;
  mensaje?: string;
  data?: any;
  error?: string;
}

export interface ItemCarrito {
  productoId: string;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  imagenUrl?: string;
  fechaAgregado: string;
}

export interface Carrito {
  id: string;
  usuarioId: string;
  items: ItemCarrito[];
  subtotal: number;
  total: number;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  cantidadTotalItems: number;
}

export interface CarritoResumen {
  cantidadItems: number;
  subtotal: number;
  total: number;
  tieneItems: boolean;
}

// Funcin para manejar llamadas API con autenticacin
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth-token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await api.fetch(endpoint.startsWith('http') ? endpoint : endpoint, {
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

  const result: ApiResponse<T> = await response.json();
  return result;
}

class CarritoService {
  private getUsuarioId(): string {
    const userId = localStorage.getItem('usuarioId');
    if (!userId) {
      // Para usuarios no autenticados, usar un ID temporal
      const tempId = `guest_${Date.now()}`;
      localStorage.setItem('usuarioId', tempId);
      return tempId;
    }
    return userId;
  }

  async obtenerCarrito(): Promise<Carrito> {
    // Según la documentación del backend el endpoint para obtener el carrito
    // es GET /api/carrito (usa sesión o token para identificar al usuario)
    const response = await apiCall<Carrito>(api.cart.get);

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener el carrito');
    }

    return response.data!;
  }

  async obtenerResumen(): Promise<CarritoResumen> {
    // GET /api/carrito/resumen según documentación
    const response = await apiCall<CarritoResumen>(api.cart.resumen);

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener el resumen del carrito');
    }

    return response.data!;
  }

  async agregarProducto(productoId: string, cantidad: number = 1): Promise<Carrito> {
    // POST /api/carrito/agregar -> body: { productoId, cantidad }
    // El backend debe identificar al usuario por sesión/cookie o token.
    const response = await apiCall<Carrito>(api.cart.add, {
      method: 'POST',
      body: JSON.stringify({ productoId, cantidad }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Error al agregar producto');
    }

    return response.data!;
  }

  async actualizarCantidad(productoId: string, cantidad: number): Promise<Carrito> {
    // POST /api/carrito/actualizar -> body: { productoId, cantidad }
    const response = await apiCall<Carrito>(api.cart.update, {
      method: 'POST',
      body: JSON.stringify({ productoId, cantidad }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Error al actualizar cantidad');
    }

    return response.data!;
  }

  async eliminarProducto(productoId: string): Promise<Carrito> {
    // POST /api/carrito/eliminar -> body: { productoId }
    const response = await apiCall<Carrito>(api.cart.remove, {
      method: 'POST',
      body: JSON.stringify({ productoId }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Error al eliminar producto');
    }

    return response.data!;
  }

  async limpiarCarrito(): Promise<void> {
    // Endpoint de 'limpiar carrito' no aparece en la documentación proporcionada.
    // Opción A: Implementar en backend un endpoint DELETE /api/carrito/limpiar
    // Opción B: En el frontend iterar y eliminar cada item usando /api/carrito/eliminar
    throw new Error('Endpoint para limpiar carrito no implementado en backend. Ver plan de corrección en la documentación.');
  }

  async verificarDisponibilidad(): Promise<{ disponible: boolean; mensaje: string }> {
    // Endpoint de 'verificar disponibilidad' no está documentado.
    // Si necesitas verificar stock, utiliza el endpoint de producto (/api/productos/{id})
    throw new Error('Endpoint para verificar disponibilidad no implementado en backend.');
  }
}

export const carritoService = new CarritoService();