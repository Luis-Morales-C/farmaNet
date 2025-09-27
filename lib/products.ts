// Product types and mock data
export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  precioOferta?: number
  imagen: string
  categoria: string
  marca: string
  stock: number
  requiereReceta: boolean
  ingredienteActivo?: string
  presentacion: string
  contraindicaciones?: string
  instrucciones?: string
  fechaVencimiento: string
  rating: number
  totalReviews: number
  tags: string[]
}

export interface Categoria {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  productCount: number
  subcategorias?: string[]
}

// Mock categories data
export const categorias: Categoria[] = [
  {
    id: "medicamentos",
    nombre: "Medicamentos",
    descripcion: "Medicamentos con y sin receta médica",
    imagen: "/medicine-pills.png",
    productCount: 1234,
    subcategorias: ["Analgésicos", "Antibióticos", "Antihistamínicos", "Vitaminas"],
  },
  {
    id: "vitaminas",
    nombre: "Vitaminas y Suplementos",
    descripcion: "Vitaminas, minerales y suplementos nutricionales",
    imagen: "/assorted-vitamin-bottles.png",
    productCount: 456,
    subcategorias: ["Multivitamínicos", "Vitamina C", "Vitamina D", "Omega 3"],
  },
  {
    id: "cuidado-personal",
    nombre: "Cuidado Personal",
    descripcion: "Productos de higiene y cuidado personal",
    imagen: "/personal-care-products-collection.png",
    productCount: 789,
    subcategorias: ["Higiene Bucal", "Cuidado de la Piel", "Desodorantes", "Champús"],
  },
  {
    id: "bebe-mama",
    nombre: "Bebé y Mamá",
    descripcion: "Productos para el cuidado de bebés y madres",
    imagen: "/baby-care-products.png",
    productCount: 234,
    subcategorias: ["Pañales", "Alimentación", "Cuidado de la Piel", "Juguetes"],
  },
  {
    id: "primeros-auxilios",
    nombre: "Primeros Auxilios",
    descripcion: "Productos para primeros auxilios y emergencias",
    imagen: "/first-aid-kit.png",
    productCount: 123,
    subcategorias: ["Vendajes", "Antisépticos", "Termómetros", "Gasas"],
  },
  {
    id: "equipos-medicos",
    nombre: "Equipos Médicos",
    descripción: "Equipos y dispositivos médicos",
    imagen: "/diverse-medical-equipment.png",
    productCount: 89,
    subcategorias: ["Tensiómetros", "Glucómetros", "Nebulizadores", "Oxímetros"],
  },
]

// Mock products data
export const productos: Producto[] = [
  {
    id: "1",
    nombre: "Paracetamol 500mg",
    descripcion: "Analgésico y antipirético para el alivio del dolor y la fiebre",
    precio: 12.5,
    precioOferta: 10.0,
    imagen: "/paracetamol-tablets.jpg",
    categoria: "medicamentos",
    marca: "Genérico",
    stock: 150,
    requiereReceta: false,
    ingredienteActivo: "Paracetamol",
    presentacion: "Caja x 20 tabletas",
    contraindicaciones: "No usar en caso de alergia al paracetamol",
    instrucciones: "Tomar 1-2 tabletas cada 6-8 horas según necesidad",
    fechaVencimiento: "2025-12-31",
    rating: 4.5,
    totalReviews: 128,
    tags: ["analgésico", "antipirético", "dolor", "fiebre"],
  },
  {
    id: "2",
    nombre: "Vitamina C 1000mg",
    descripcion: "Suplemento de vitamina C para fortalecer el sistema inmunológico",
    precio: 25.0,
    imagen: "/vitamin-c-tablets.jpg",
    categoria: "vitaminas",
    marca: "VitaHealth",
    stock: 80,
    requiereReceta: false,
    ingredienteActivo: "Ácido Ascórbico",
    presentacion: "Frasco x 60 tabletas",
    instrucciones: "Tomar 1 tableta diaria con las comidas",
    fechaVencimiento: "2026-06-30",
    rating: 4.8,
    totalReviews: 95,
    tags: ["vitamina", "inmunidad", "antioxidante"],
  },
  {
    id: "3",
    nombre: "Crema Hidratante Facial",
    descripcion: "Crema hidratante para todo tipo de piel con protección UV",
    precio: 35.0,
    precioOferta: 28.0,
    imagen: "/facial-moisturizer.jpg",
    categoria: "cuidado-personal",
    marca: "Dermacare",
    stock: 45,
    requiereReceta: false,
    presentacion: "Tubo x 50ml",
    instrucciones: "Aplicar en rostro limpio, mañana y noche",
    fechaVencimiento: "2025-08-15",
    rating: 4.3,
    totalReviews: 67,
    tags: ["hidratante", "facial", "protección", "piel"],
  },
  {
    id: "4",
    nombre: "Pañales Talla M",
    descripcion: "Pañales ultra absorbentes para bebés de 6-10 kg",
    precio: 18.5,
    imagen: "/baby-diapers.jpg",
    categoria: "bebe-mama",
    marca: "BabyCare",
    stock: 200,
    requiereReceta: false,
    presentacion: "Paquete x 30 unidades",
    instrucciones: "Cambiar frecuentemente para mantener la higiene del bebé",
    fechaVencimiento: "2027-01-01",
    rating: 4.6,
    totalReviews: 156,
    tags: ["pañales", "bebé", "absorbente", "talla M"],
  },
  {
    id: "5",
    nombre: "Vendas Elásticas",
    descripcion: "Vendas elásticas para soporte y compresión",
    precio: 8.0,
    imagen: "/elastic-bandages.jpg",
    categoria: "primeros-auxilios",
    marca: "MedSupply",
    stock: 75,
    requiereReceta: false,
    presentacion: "Paquete x 3 vendas",
    instrucciones: "Aplicar con presión moderada, no muy ajustado",
    fechaVencimiento: "2028-12-31",
    rating: 4.2,
    totalReviews: 43,
    tags: ["vendas", "soporte", "compresión", "primeros auxilios"],
  },
  {
    id: "6",
    nombre: "Tensiómetro Digital",
    descripcion: "Tensiómetro digital automático para medición de presión arterial",
    precio: 85.0,
    precioOferta: 75.0,
    imagen: "/digital-blood-pressure-monitor.jpg",
    categoria: "equipos-medicos",
    marca: "HealthTech",
    stock: 25,
    requiereReceta: false,
    presentacion: "1 unidad con estuche",
    instrucciones: "Seguir las instrucciones del manual para uso correcto",
    fechaVencimiento: "2030-01-01",
    rating: 4.7,
    totalReviews: 89,
    tags: ["tensiómetro", "presión arterial", "digital", "salud"],
  },
]

// Product service functions
export const productService = {
  async getProductos(filters?: {
    categoria?: string
    busqueda?: string
    precioMin?: number
    precioMax?: number
    requiereReceta?: boolean
    ordenarPor?: "precio-asc" | "precio-desc" | "nombre" | "rating"
  }): Promise<Producto[]> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    let result = [...productos]

    if (filters) {
      if (filters.categoria) {
        result = result.filter((p) => p.categoria === filters.categoria)
      }

      if (filters.busqueda) {
        const search = filters.busqueda.toLowerCase()
        result = result.filter(
          (p) =>
            p.nombre.toLowerCase().includes(search) ||
            p.descripcion.toLowerCase().includes(search) ||
            p.tags.some((tag) => tag.toLowerCase().includes(search)),
        )
      }

      if (filters.precioMin !== undefined) {
        result = result.filter((p) => (p.precioOferta || p.precio) >= filters.precioMin!)
      }

      if (filters.precioMax !== undefined) {
        result = result.filter((p) => (p.precioOferta || p.precio) <= filters.precioMax!)
      }

      if (filters.requiereReceta !== undefined) {
        result = result.filter((p) => p.requiereReceta === filters.requiereReceta)
      }

      // Sorting
      if (filters.ordenarPor) {
        switch (filters.ordenarPor) {
          case "precio-asc":
            result.sort((a, b) => (a.precioOferta || a.precio) - (b.precioOferta || b.precio))
            break
          case "precio-desc":
            result.sort((a, b) => (b.precioOferta || b.precio) - (a.precioOferta || a.precio))
            break
          case "nombre":
            result.sort((a, b) => a.nombre.localeCompare(b.nombre))
            break
          case "rating":
            result.sort((a, b) => b.rating - a.rating)
            break
        }
      }
    }

    return result
  },

  async getProducto(id: string): Promise<Producto | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return productos.find((p) => p.id === id) || null
  },

  async getCategorias(): Promise<Categoria[]> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return categorias
  },

  async getProductosPorCategoria(categoriaId: string): Promise<Producto[]> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return productos.filter((p) => p.categoria === categoriaId)
  },
}
