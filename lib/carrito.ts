const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

class CarritoService {
  private getUsuarioId(): string {

    const userId = localStorage.getItem('usuarioId');
    if (!userId) {
    
      const tempId = `guest_${Date.now()}`;
      localStorage.setItem('usuarioId', tempId);
      return tempId;
    }
    return userId;
  }

  async obtenerCarrito(): Promise<Carrito> {
    const usuarioId = this.getUsuarioId();
    const response = await fetch(`${API_BASE_URL}/carrito/obtener/${usuarioId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el carrito');
    }

    const data: CarritoResponse = await response.json();
    return data.data;
  }

  async obtenerResumen(): Promise<CarritoResumen> {
    const usuarioId = this.getUsuarioId();
    const response = await fetch(`${API_BASE_URL}/carrito/resumen/${usuarioId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el resumen del carrito');
    }

    const data: CarritoResponse = await response.json();
    return data.data;
  }

  async agregarProducto(productoId: string, cantidad: number = 1): Promise<Carrito> {
    const usuarioId = this.getUsuarioId();
    const response = await fetch(`${API_BASE_URL}/carrito/agregar-producto/${usuarioId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productoId, cantidad }),
    });

    if (!response.ok) {
      const errorData: CarritoResponse = await response.json();
      throw new Error(errorData.error || 'Error al agregar producto');
    }

    const data: CarritoResponse = await response.json();
    return data.data;
  }

  async actualizarCantidad(productoId: string, cantidad: number): Promise<Carrito> {
    const usuarioId = this.getUsuarioId();
    const response = await fetch(`${API_BASE_URL}/carrito/actualizar-cantidad/${usuarioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productoId, cantidad }),
    });

    if (!response.ok) {
      const errorData: CarritoResponse = await response.json();
      throw new Error(errorData.error || 'Error al actualizar cantidad');
    }

    const data: CarritoResponse = await response.json();
    return data.data;
  }

  async eliminarProducto(productoId: string): Promise<Carrito> {
    const usuarioId = this.getUsuarioId();
    const response = await fetch(`${API_BASE_URL}/carrito/eliminar-producto/${usuarioId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productoId }),
    });

    if (!response.ok) {
      const errorData: CarritoResponse = await response.json();
      throw new Error(errorData.error || 'Error al eliminar producto');
    }

    const data: CarritoResponse = await response.json();
    return data.data;
  }

  async limpiarCarrito(): Promise<void> {
    const usuarioId = this.getUsuarioId();
    const response = await fetch(`${API_BASE_URL}/carrito/limpiar-carrito/${usuarioId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData: CarritoResponse = await response.json();
      throw new Error(errorData.error || 'Error al limpiar carrito');
    }
  }

  async verificarDisponibilidad(): Promise<{ disponible: boolean; mensaje: string }> {
    const usuarioId = this.getUsuarioId();
    const response = await fetch(`${API_BASE_URL}/carrito/verificar-disponibilidad/${usuarioId}`);
    
    if (!response.ok) {
      throw new Error('Error al verificar disponibilidad');
    }

    const data: CarritoResponse = await response.json();
    return data.data;
  }
}

export const carritoService = new CarritoService();