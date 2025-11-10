// lib/catalogo.service.ts
import { Producto, ProductoFiltros } from './products'
import { api } from './api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Función para manejar llamadas API con autenticación
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth-token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await api.fetch(endpoint, {
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

  return response;
}

class CatalogoService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await apiCall(endpoint, options)

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  }

  async obtenerCatalogo(): Promise<Producto[]> {
    try {
      return await this.request<Producto[]>(api.catalog.getAll)
    } catch (error) {
      console.error('Error obteniendo catálogo:', error)
      throw new Error('No se pudo cargar el catálogo de productos')
    }
  }

  async buscarProductos(nombre: string): Promise<Producto[]> {
    try {
      const params = new URLSearchParams({ nombre })
      return await this.request<Producto[]>(`${api.catalog.search}`)
    } catch (error) {
      console.error('Error buscando productos:', error)
      throw new Error('Error al buscar productos')
    }
  }

  async buscarPorPrincipioActivo(principioActivo: string): Promise<Producto[]> {
    try {
      const params = new URLSearchParams({ principioActivo })
      return await this.request<Producto[]>(`${api.catalog.byCategory(principioActivo)}`)
    } catch (error) {
      console.error('Error buscando por principio activo:', error)
      throw new Error('Error al buscar productos por principio activo')
    }
  }

  async obtenerOfertas(): Promise<Producto[]> {
    try {
      return await this.request<Producto[]>(api.catalog.offers)
    } catch (error) {
      console.error('Error obteniendo ofertas:', error)
      throw new Error('Error al obtener productos en oferta')
    }
  }

  async obtenerProductosPorCategoria(categoriaId: string): Promise<Producto[]> {
    try {
      return await this.request<Producto[]>(api.catalog.byCategory(categoriaId))
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error)
      throw new Error('Error al obtener productos de la categoría')
    }
  }

  async obtenerProductosConFiltros(filtros?: ProductoFiltros): Promise<Producto[]> {
    try {
      // Usar el endpoint existente de productos con filtros
      const params = new URLSearchParams()

      if (filtros?.busqueda) params.append('busqueda', filtros.busqueda)
      if (filtros?.categoriaId) params.append('categoriaId', filtros.categoriaId)
      if (filtros?.precioMin !== undefined) params.append('precioMin', filtros.precioMin.toString())
      if (filtros?.precioMax !== undefined) params.append('precioMax', filtros.precioMax.toString())
      if (filtros?.requiereReceta !== undefined) params.append('requiereReceta', filtros.requiereReceta.toString())
      if (filtros?.activo !== undefined) params.append('activo', filtros.activo.toString())
      if (filtros?.ordenarPor) params.append('ordenarPor', filtros.ordenarPor)

      const url = `/api/productos/obtener-productos${params.toString() ? '?' + params.toString() : ''}`
      return await this.request<Producto[]>(url)
    } catch (error) {
      console.error('Error obteniendo productos con filtros:', error)
      // Fallback al catálogo completo
      return await this.obtenerCatalogo()
    }
  }
}

export const catalogoService = new CatalogoService()