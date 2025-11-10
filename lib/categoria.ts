// lib/categorias.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
  categoriaPadreNombre?: string;
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
  categoriaPadreNombre?: string;
  productCount?: number;
  subcategorias?: string[];
  subcategoriasCompletas?: Categoria[];
}

export interface CategoriaJerarquia extends Categoria {
  nivel: number;
  hijos: CategoriaJerarquia[];
}

export interface ResultadoBusqueda {
  categorias: Categoria[];
  total: number;
  termino: string;
}

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

// ==================== SERVICIO ====================

class CategoriaService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = `${API_BASE_URL}/categorias`;
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
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      signal: options.signal,
    };

    if (options.body) {
      config.body = options.body;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Error desconocido');
        throw new Error(
          `Error ${response.status}: ${response.statusText}. ${errorText}`
        );
      }

      const text = await response.text();
      if (!text) {
        return null as T;
      }

      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('La petición fue cancelada');
        }
        throw error;
      }
      throw new Error('Error desconocido al realizar la petición');
    }
  }

  // Transformar DTO a Categoria
  private transformCategoria(dto: CategoriaDTO): Categoria {
    return {
      id: dto.id,
      nombre: dto.nombre,
      descripcion: dto.descripcion || '',
      imagenUrl: dto.imagenUrl,
      imagen: dto.imagenUrl,
      keywords: dto.keywords || [],
      orden: dto.orden || 0,
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
      const dtos = await this.fetchAPI<CategoriaDTO[]>('/obtener', { signal });
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
      // Usar el mismo endpoint que getCategorias pero filtrar solo las raíz localmente
      const dtos = await this.fetchAPI<CategoriaDTO[]>('/obtener', { signal });
      const categoriasRaiz = dtos.filter(cat => cat.esCategoriaRaiz);
      return this.transformCategorias(categoriasRaiz);
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
        `/subcategorias/${categoriaPadreId}`,
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
        `/buscar?nombre=${encodeURIComponent(nombre)}`,
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
          break;
        }
      }

      return ruta;
    } catch (error) {
      console.error(`Error al obtener ruta de breadcrumb para ${categoriaId}:`, error);
      throw error;
    }
  }

  /**
   * Filtrar categorías localmente
   */
  filtrarLocal(
    categorias: Categoria[],
    filtros: {
      nombre?: string;
      esCategoriaRaiz?: boolean;
      categoriaPadreId?: string;
      keywords?: string[];
    }
  ): Categoria[] {
    return categorias.filter((categoria) => {
      if (filtros.nombre) {
        const nombreLower = categoria.nombre.toLowerCase();
        const filtroLower = filtros.nombre.toLowerCase();
        if (!nombreLower.includes(filtroLower)) {
          return false;
        }
      }

      if (filtros.esCategoriaRaiz !== undefined) {
        if (categoria.esCategoriaRaiz !== filtros.esCategoriaRaiz) {
          return false;
        }
      }

      if (filtros.categoriaPadreId !== undefined) {
        if (categoria.categoriaPadreId !== filtros.categoriaPadreId) {
          return false;
        }
      }

      if (filtros.keywords && filtros.keywords.length > 0) {
        const categoriaKeywords = categoria.keywords || [];
        const tieneKeyword = filtros.keywords.some((k) =>
          categoriaKeywords.some((ck) =>
            ck.toLowerCase().includes(k.toLowerCase())
          )
        );
        if (!tieneKeyword) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Ordenar categorías
   */
  ordenar(
    categorias: Categoria[],
    campo: keyof Categoria = 'nombre',
    orden: 'asc' | 'desc' = 'asc'
  ): Categoria[] {
    return [...categorias].sort((a, b) => {
      const valorA = a[campo];
      const valorB = b[campo];

      if (valorA === undefined || valorA === null) return 1;
      if (valorB === undefined || valorB === null) return -1;

      let comparacion = 0;
      
      if (typeof valorA === 'string' && typeof valorB === 'string') {
        comparacion = valorA.localeCompare(valorB);
      } else if (typeof valorA === 'number' && typeof valorB === 'number') {
        comparacion = valorA - valorB;
      } else if (typeof valorA === 'boolean' && typeof valorB === 'boolean') {
        comparacion = (valorA === valorB) ? 0 : valorA ? 1 : -1;
      }

      return orden === 'asc' ? comparacion : -comparacion;
    });
  }

  /**
   * Agrupar categorías por campo
   */
  agrupar(
    categorias: Categoria[],
    campo: keyof Categoria
  ): Record<string, Categoria[]> {
    return categorias.reduce((grupos, categoria) => {
      const valor = categoria[campo];
      const clave = String(valor ?? 'sin-valor');
      
      if (!grupos[clave]) {
        grupos[clave] = [];
      }
      
      grupos[clave].push(categoria);
      return grupos;
    }, {} as Record<string, Categoria[]>);
  }

  /**
   * Verificar si tiene subcategorías
   */
  async tieneSubcategorias(
    categoriaId: string,
    signal?: AbortSignal
  ): Promise<boolean> {
    try {
      const subcategorias = await this.getSubcategorias(categoriaId, signal);
      return subcategorias.length > 0;
    } catch (error) {
      console.error(`Error al verificar subcategorías de ${categoriaId}:`, error);
      return false;
    }
  }

  /**
   * Contar descendientes de una categoría
   */
  async contarDescendientes(
    categoriaId: string,
    signal?: AbortSignal
  ): Promise<number> {
    try {
      const todas = await this.getCategorias(signal);
      const descendientes = new Set<string>();

      const buscarDescendientes = (id: string) => {
        todas.forEach((cat) => {
          if (cat.categoriaPadreId === id && !descendientes.has(cat.id)) {
            descendientes.add(cat.id);
            buscarDescendientes(cat.id);
          }
        });
      };

      buscarDescendientes(categoriaId);
      return descendientes.size;
    } catch (error) {
      console.error(`Error al contar descendientes de ${categoriaId}:`, error);
      return 0;
    }
  }
}



export const categoriaService = new CategoriaService();
export { CategoriaService };
export default categoriaService;