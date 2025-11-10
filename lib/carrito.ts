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
    const usuarioId = this.getUsuarioId();
    const response = await apiCall<Carrito>(`${api.cart.get}/${usuarioId}`);

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener el carrito');
    }

    return response.data!;
  }

  async obtenerResumen(): Promise<CarritoResumen> {
    const usuarioId = this.getUsuarioId();
    const response = await apiCall<CarritoResumen>(`${api.cart.resumen}/${usuarioId}`);

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener el resumen del carrito');
    }

    return response.data!;
  }

  async agregarProducto(productoId: string, cantidad: number = 1): Promise<Carrito> {
    const usuarioId = this.getUsuarioId();
    const response = await apiCall<Carrito>(api.cart.add, {
      method: 'POST',
      body: JSON.stringify({ usuarioId, productoId, cantidad }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Error al agregar producto');
    }

    return response.data!;
  }

  async actualizarCantidad(productoId: string, cantidad: number): Promise<Carrito> {
    const usuarioId = this.getUsuarioId();
    const response = await apiCall<Carrito>(api.cart.update, {
      method: 'POST',
      body: JSON.stringify({ usuarioId, productoId, cantidad }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Error al actualizar cantidad');
    }

    return response.data!;
  }

  async eliminarProducto(productoId: string): Promise<Carrito> {
    const usuarioId = this.getUsuarioId();
    const response = await apiCall<Carrito>(api.cart.remove, {
      method: 'POST',
      body: JSON.stringify({ usuarioId, productoId }),
    });

    if (!response.success) {
      throw new Error(response.error || 'Error al eliminar producto');
    }

    return response.data!;
  }

  async limpiarCarrito(): Promise<void> {
    const usuarioId = this.getUsuarioId();
    const response = await apiCall<null>(`${api.cart.get}/limpiar/${usuarioId}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.error || 'Error al limpiar carrito');
    }
  }

  async verificarDisponibilidad(): Promise<{ disponible: boolean; mensaje: string }> {
    const usuarioId = this.getUsuarioId();
    const response = await apiCall<{ disponible: boolean; mensaje: string }>(`${api.cart.get}/verificar/${usuarioId}`);

    if (!response.success) {
      throw new Error(response.error || 'Error al verificar disponibilidad');
    }

    return response.data!;
  }
}

export const carritoService = new CarritoService();