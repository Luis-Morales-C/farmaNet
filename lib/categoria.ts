//lib/categorias.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

import { api } from './api'

// ==================== INTERFACES ====================

export interface CategoriaDTO {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl?: string;
  keywords?: string[];
  orden?: number;
  esCategoriaRaiz: boolean;
  categoriaPadreId?: string;
  categoriaPadreNombre?:string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  imagenUrl?: string;
  imagen?: string;
  keywords?: string[];
  orden?: number;
  esCategoriaRaiz: boolean;
  categoriaPadreId?: string;
  categoriaPadreNombre?:string;
 productCount?: number;
  subcategorias?: string[];
  subcategoriasCompletas?: Categoria[];
}

export interface CategoriaJerarquia extends Categoria {
  nivel:number;
  hijos: CategoriaJerarquia[];
}

export interface ResultadoBusqueda {
  categorias: Categoria[];
  total: number;
  termino:string;
}

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

//Funcin para manejar llamadas API con autenticacin
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token =localStorage.getItem('auth-token');
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // Importante para las cookies/sesiones
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

  // Si recibimosun401, probablemente el token haya expirado
  if (response.status === 401) {
    // Redirigir a login o mostrar mensaje
    localStorage.removeItem('auth-token');
   localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
      window.location.href= '/login';
    }
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }

  return response;
}

// ==================== SERVICIO ====================

class CategoriaService{
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

 constructor(){
    this.baseURL = api.categories.getAll.replace(/\/obtener$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
 }

  // Método privado para hacer fetch
private async fetchAPI<T>(
    endpoint: string,
    options: FetchOptions = {}
 ): Promise<T> {
    const url = `${endpoint.startsWith('http') ? endpoint : endpoint}`;

    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        ...this.defaultHeaders,
       ...options.headers,
      },
      signal: options.signal,
    };

    if (options.body){
      config.body= options.body;
    }

    try {
      const response = await apiCall(url, config);

      if (!response.ok) {
        const errorText =await response.text().catch(() => 'Errordesconocido');
        throw new Error(
          `Error ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const text = await response.text();
      if (!text) {
        return null as T;
      }

      return JSON.parse(text) as T;
    } catch (error){
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
throw new Error('La petición fue cancelada');
        }
        throw error;
      }
      throw new Error('Error desconocido al realizar la petición');
   }
  }

  // Transformar DTO aCategoria
  private transformCategoria(dto: CategoriaDTO): Categoria {
    return {
      id: dto.id,
      nombre:dto.nombre,
      descripcion: dto.descripcion || '',
      imagenUrl: dto.imagenUrl,
      imagen: dto.imagenUrl,
      keywords: dto.keywords || [],
      orden: dto.orden|| 0,
      esCategoriaRaiz: dto.esCategoriaRaiz,
      categoriaPadreId: dto.categoriaPadreId,
      categoriaPadreNombre: dto.categoriaPadreNombre,
      productCount: 0,
      subcategorias: [],
      subcategoriasCompletas: [],
    };
 }

  private transformCategorias(dtos: CategoriaDTO[]): Categoria[] {
    return dtos.map((dto) => this.transformCategoria(dto));
  }

  // ==================== MÉTODOS PÚBLICOS ====================

  /**
   * Obtener todas las categorías activas
   */
  async getCategorias(signal?: AbortSignal): Promise<Categoria[]> {
    try {
      const dtos = await this.fetchAPI<CategoriaDTO[]>(api.categories.getAll, { signal });
      return this.transformCategorias(dtos);
    } catch (error) {
      console.error('Error al obtener todas las categorías:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías raíz (principales)
   */
  async getCategoriasRaiz(signal?: AbortSignal): Promise<Categoria[]> {
    try {
      const dtos = await this.fetchAPI<CategoriaDTO[]>(api.categories.raiz, { signal });
      return this.transformCategorias(dtos);
    } catch (error) {
      console.error('Error al obtener categorías raíz:', error);
      throw error;
    }
  }

  /**
   * Obtener subcategorías de una categoría padre
   */
  async getSubcategorias(
    categoriaPadreId: string,
    signal?: AbortSignal
  ): Promise<Categoria[]> {
    if (!categoriaPadreId?.trim()) {
      throw new Error('ID de categoría padre requerido');
    }

    try {
      const dtos = await this.fetchAPI<CategoriaDTO[]>(
        api.categories.subcategories(categoriaPadreId),
        { signal }
      );
      return this.transformCategorias(dtos);
    } catch (error) {
      console.error(`Error al obtener subcategorías de ${categoriaPadreId}:`, error);
      throw error;
    }
  }

  /**
   * Buscar categorías por nombre
   */
  async buscarCategorias(
    nombre: string,
    signal?: AbortSignal
  ): Promise<ResultadoBusqueda> {
    if (!nombre?.trim()) {
      return {
        categorias: [],
        total: 0,
        termino: nombre,
      };
    }

    try {
      const dtos = await this.fetchAPI<CategoriaDTO[]>(
        `${api.categories.search}?nombre=${encodeURIComponent(nombre)}`,
        { signal }
      );

      const categorias = this.transformCategorias(dtos);

      return {
        categorias,
        total: categorias.length,
        termino: nombre,
      };
    } catch (error) {
      console.error(`Error al buscar categorías con término "${nombre}":`, error);
      throw error;
    }
  }

  /**
   * Obtener una categoría por ID
   */
  async getCategoriaPorId(id: string, signal?: AbortSignal): Promise<Categoria | null> {
    if (!id?.trim()) {
      throw new Error('ID de categoría requerido');
    }

    try {
      const todas = await this.getCategorias(signal);
      const categoria = todas.find((c) => c.id === id);
      return categoria || null;
    } catch (error) {
      console.error(`Error al obtener categoría con ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener una categoría con sus subcategorías
   */
  async getCategoriaConSubcategorias(
    categoriaId: string,
    signal?: AbortSignal
  ): Promise<Categoria> {
    if (!categoriaId?.trim()) {
      throw new Error('ID de categoría requerido');
    }

    try {
      const categoria = await this.getCategoriaPorId(categoriaId, signal);

      if (!categoria) {
        throw new Error(`Categoría con ID ${categoriaId} no encontrada`);
      }

      const subcategorias = await this.getSubcategorias(categoriaId, signal);

      return {
        ...categoria,
        subcategorias: subcategorias.map((s) => s.nombre),
        subcategoriasCompletas: subcategorias,
      };
    } catch (error) {
      console.error(`Error al obtener categoría ${categoriaId} con subcategorías:`, error);
      throw error;
    }
  }

  /**
   * Enriquecer categorías con subcategorías
   */
  async enriquecerConSubcategorias(
    categorias: Categoria[],
    signal?: AbortSignal
  ): Promise<Categoria[]> {
    try {
      const promesas = categorias.map(async (categoria) => {
        try {
          const subcategorias = await this.getSubcategorias(categoria.id, signal);
          return {
            ...categoria,
            subcategorias: subcategorias.map((s) => s.nombre),
            subcategoriasCompletas: subcategorias,
          };
        } catch (error) {
          console.error(`Error enriqueciendo categoría ${categoria.id}:`, error);
          return categoria;
        }
      });

      return await Promise.all(promesas);
    } catch (error) {
      console.error('Error al enriquecer categorías:', error);
      throw error;
    }
  }

  /**
   * Construir jerarquía de categorías
   */
  construirJerarquia(categorias: Categoria[]): CategoriaJerarquia[] {
    const mapa = new Map<string, CategoriaJerarquia>();
    const raices: CategoriaJerarquia[] = [];

    categorias.forEach((categoria) => {
      mapa.set(categoria.id, {
        ...categoria,
        nivel: 0,
        hijos: [],
      });
    });

    mapa.forEach((categoria) => {
      if (categoria.categoriaPadreId && mapa.has(categoria.categoriaPadreId)) {
        const padre = mapa.get(categoria.categoriaPadreId)!;
        categoria.nivel = padre.nivel + 1;
        padre.hijos.push(categoria);
      } else {
        raices.push(categoria);
      }
    });

    const ordenarPorOrden = (cats: CategoriaJerarquia[]) => {
      cats.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      cats.forEach((cat) => ordenarPorOrden(cat.hijos));
    };

    ordenarPorOrden(raices);

    return raices;
  }

  /**
   * Obtener árbol completo de categorías
   */
  async getArbolCompleto(signal?: AbortSignal): Promise<CategoriaJerarquia[]> {
    try {
      const todas = await this.getCategorias(signal);
      return this.construirJerarquia(todas);
    } catch (error) {
      console.error('Error al obtener árbol de categorías:', error);
      throw error;
    }
  }

  /**
   * Obtener ruta breadcrumb de una categoría
   */
  async getBreadcrumb(
    categoriaId: string,
    signal?: AbortSignal
  ): Promise<Categoria[]> {
    if (!categoriaId?.trim()) {
      return [];
    }

    try {
      const todas = await this.getCategorias(signal);
      const mapa = new Map(todas.map((c) => [c.id, c]));
      const ruta: Categoria[] = [];

      let categoriaActual = mapa.get(categoriaId);

      while (categoriaActual) {
        ruta.unshift(categoriaActual);

        if (categoriaActual.categoriaPadreId) {
          categoriaActual = mapa.get(categoriaActual.categoriaPadreId);
        } else {
          categoriaActual = undefined as any;
        }
      }

      return ruta;
    } catch (error) {
      console.error(`Error al obtener breadcrumb para ${categoriaId}:`, error);
      throw error;
    }
  }
}

export const categoriaService = new CategoriaService()
