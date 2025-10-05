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

  imagen: string
  ingredienteActivo?: string
  instrucciones?: string
  contraindicaciones?: string
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


const generarTags = (dto: any): string[] => {
  const tags: string[] = []
  
  if (dto.principioActivo) tags.push(dto.principioActivo)
  if (dto.laboratorio) tags.push(dto.laboratorio)
  if (dto.requiereReceta) tags.push('Receta Médica')
  if (dto.enOferta) tags.push('Oferta Especial')
  if (dto.categoriaNombre) tags.push(dto.categoriaNombre)
  

  if (dto.nombre?.toLowerCase().includes('paracetamol')) tags.push('Analgésico', 'Antipirético')
  if (dto.nombre?.toLowerCase().includes('ibuprofeno')) tags.push('Antiinflamatorio', 'Analgésico')
  if (dto.nombre?.toLowerCase().includes('vitamina')) tags.push('Suplemento', 'Vitaminas')
  if (dto.nombre?.toLowerCase().includes('jarabe')) tags.push('Jarabe')
  if (dto.nombre?.toLowerCase().includes('tableta') || dto.nombre?.toLowerCase().includes('comprimido')) tags.push('Tabletas')
  
  return tags.slice(0, 5) 
}

const generarInstrucciones = (dto: any): string => {
  let instrucciones = 'Siga las indicaciones de su médico o farmacéutico. '
  
  if (dto.principioActivo) {
    instrucciones += `Este medicamento contiene ${dto.principioActivo}. `
  }
  
  if (dto.requiereReceta) {
    instrucciones += 'Uso exclusivamente bajo prescripción médica. No exceder la dosis indicada por su médico. '
  } else {
    instrucciones += 'Lea cuidadosamente las instrucciones del empaque. No exceder la dosis recomendada. '
  }
  
  instrucciones += 'Conservar en lugar fresco y seco. Mantener fuera del alcance de los niños.'
  
  return instrucciones
}

const generarContraindicaciones = (dto: any): string => {
  let contraindicaciones = ''
  
  if (dto.requiereReceta) {
    contraindicaciones = 'No usar sin prescripción médica. Consulte a su médico antes de usar si está embarazada, amamantando, o tiene condiciones médicas preexistentes. '
  } else {
    contraindicaciones = 'No usar si es alérgico a alguno de los componentes. '
  }
  
  contraindicaciones += 'No usar después de la fecha de vencimiento. Si presenta efectos adversos, suspenda el uso y consulte a su médico.'
  
  if (dto.principioActivo?.toLowerCase().includes('paracetamol')) {
    contraindicaciones += ' No exceder 4 gramos diarios. No combinar con otros medicamentos que contengan paracetamol.'
  }
  
  if (dto.principioActivo?.toLowerCase().includes('ibuprofeno')) {
    contraindicaciones += ' No usar en caso de úlceras gástricas. Tomar con alimentos.'
  }
  
  return contraindicaciones
}


export const productService = {

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

  
      const url = `http://localhost:8080/api/productos/obtener-productos${params.toString() ? '?' + params.toString() : ''}`
      console.log('Fetching products from:', url)
      
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
      console.log('Products received:', data)
      
      return data.map(this.mapearProductoDTO)
    } catch (error) {
      console.error('Error al obtener productos:', error)
      throw new Error('No se pudieron cargar los productos. Por favor, intenta de nuevo.')
    }
  },

  
  async getProducto(id: string): Promise<Producto> {
    return this.getProductoPorId(id);
  },


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


  async getCategorias(): Promise<CategoriaDTO[]> {
    try {
      const response = await fetch('http://localhost:8080/api/categorias/obtener')
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Categories received:', data)
      
     
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
        productCount: 0 
      }))
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      throw new Error('No se pudieron cargar las categorías.')
    }
  },


  mapearProductoDTO(dto: any): Producto {
    return {
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion || 'Información del producto disponible próximamente.',
      precio: parseFloat(dto.precio) || 0,
      precioOferta: dto.precioOferta ? parseFloat(dto.precioOferta) : undefined,
      imagenUrl: dto.imagenUrl || '/placeholder-product.jpg',
      categoriaId: dto.categoriaId || '',
      categoriaNombre: dto.categoriaNombre || 'Sin categoría',
      laboratorio: dto.laboratorio || 'Genérico',
      stock: dto.stock || 0,
      activo: dto.activo !== false,
      requiereReceta: dto.requiereReceta || false,
      principioActivo: dto.principioActivo,
      codigoBarras: dto.codigoBarras,
      enOferta: dto.enOferta || false,
      
      
      categoria: {
        id: dto.categoriaId || '',
        nombre: dto.categoriaNombre || 'Sin categoría'
      },
      marca: dto.laboratorio || 'Genérico',
      rating: 4.5, 
      totalReviews: 0,
      tags: generarTags(dto),
      presentacion: dto.presentacion || 'Unidad',
      fechaVencimiento: '2025-12-31',
      
   
      imagen: dto.imagenUrl || '/placeholder-product.jpg',
      ingredienteActivo: dto.principioActivo,
      instrucciones: generarInstrucciones(dto),
      contraindicaciones: generarContraindicaciones(dto)
    }
  }
}