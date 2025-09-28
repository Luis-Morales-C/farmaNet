// types/productos.ts
export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  precioOferta?: number
  imagenUrl: string
  categoriaId: string
  categoriaNombre: string
  laboratorio?: string
  stock: number
  activo: boolean
  requiereReceta: boolean
  principioActivo?: string
  codigoBarras?: string
  enOferta?: boolean
  // Campos adicionales para compatibilidad con el frontend existente
  categoria: {
    id: string
    nombre: string
  }
  marca: string
  rating: number
  totalReviews: number
  tags: string[]
  presentacion: string
  fechaVencimiento: string
}

export interface CategoriaDTO {
  id: string
  nombre: string
  descripcion: string
  imagenUrl?: string
  keywords?: string
  orden?: number
  esCategoriaRaiz: boolean
  categoriaPadreId?: string
  categoriaPadreNombre?: string
  // Para compatibilidad con el frontend existente
  productCount: number
}

export interface ProductoFiltros {
  busqueda?: string
  categoriaId?: string
  precioMin?: number
  precioMax?: number
  requiereReceta?: boolean
  activo?: boolean
  ordenarPor?: "precio-asc" | "precio-desc" | "nombre" | "rating"
}

// services/productService.ts
export const productService = {
  // Obtener productos con filtros
  async getProductos(filtros?: ProductoFiltros): Promise<Producto[]> {
    try {
      const params = new URLSearchParams()
      
      if (filtros?.busqueda) params.append('busqueda', filtros.busqueda)
      if (filtros?.categoriaId) params.append('categoriaId', filtros.categoriaId)
      if (filtros?.precioMin !== undefined) params.append('precioMin', filtros.precioMin.toString())
      if (filtros?.precioMax !== undefined) params.append('precioMax', filtros.precioMax.toString())
      if (filtros?.requiereReceta !== undefined) params.append('requiereReceta', filtros.requiereReceta.toString())
      if (filtros?.activo !== undefined) params.append('activo', filtros.activo.toString())
      if (filtros?.ordenarPor) params.append('ordenarPor', filtros.ordenarPor)

      const url = `http://localhost:8080/api/productos${params.toString() ? '?' + params.toString() : ''}`
      console.log('Fetching products from:', url) // Para debug
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Products received:', data) // Para debug
      
      return data.map(this.mapearProductoDTO)
    } catch (error) {
      console.error('Error al obtener productos:', error)
      throw new Error('No se pudieron cargar los productos. Por favor, intenta de nuevo.')
    }
  },

  // Obtener producto por ID
  async getProductoPorId(id: string): Promise<Producto> {
    try {
      const response = await fetch(`http://localhost:8080/api/productos/${id}`)
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      return this.mapearProductoDTO(data)
    } catch (error) {
      console.error('Error al obtener producto:', error)
      throw new Error('No se pudo cargar el producto.')
    }
  },

  // Obtener categorías
  async getCategorias(): Promise<CategoriaDTO[]> {
    try {
      const response = await fetch('http://localhost:8080/api/categorias/obtener')
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Categories received:', data) // Para debug
      
      // Mapear las categorías del backend al formato esperado por el frontend
      return data.map((cat: any) => ({
        id: cat.id,
        nombre: cat.nombre,
        descripcion: cat.descripcion || '',
        imagenUrl: cat.imagenUrl,
        keywords: cat.keywords,
        orden: cat.orden,
        esCategoriaRaiz: cat.esCategoriaRaiz,
        categoriaPadreId: cat.categoriaPadreId,
        categoriaPadreNombre: cat.categoriaPadreNombre,
        productCount: 0 // Por ahora en 0, podrías calcularlo si es necesario
      }))
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      throw new Error('No se pudieron cargar las categorías.')
    }
  },

  // Mapear DTO del backend a objeto del frontend
  mapearProductoDTO(dto: any): Producto {
    return {
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      precioOferta: dto.precioOferta,
      imagenUrl: dto.imagenUrl || '/placeholder-product.jpg',
      categoriaId: dto.categoriaId || '',
      categoriaNombre: dto.categoriaNombre || 'Sin categoría',
      laboratorio: dto.laboratorio,
      stock: dto.stock || 0,
      activo: dto.activo !== false,
      requiereReceta: dto.requiereReceta || false,
      principioActivo: dto.principioActivo,
      codigoBarras: dto.codigoBarras,
      enOferta: dto.enOferta || false,
      
      // Mapear para compatibilidad con el frontend existente
      categoria: {
        id: dto.categoriaId || '',
        nombre: dto.categoriaNombre || 'Sin categoría'
      },
      marca: dto.laboratorio || 'Genérico',
      rating: 4.0, // Valor por defecto
      totalReviews: 0, // Valor por defecto
      tags: [], // Podrías llenar esto basándote en principioActivo, laboratorio, etc.
      presentacion: 'Unidad', // Valor por defecto
      fechaVencimiento: '2025-12-31' // Valor por defecto
    }
  }
}