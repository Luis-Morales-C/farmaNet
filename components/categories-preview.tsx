"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  nombre: string
  descripcion: string
}

// Demo data for development/preview
const DEMO_CATEGORIES: Category[] = [
  { id: "1", nombre: "Medicamentos", descripcion: "1,234 productos" },
  { id: "2", nombre: "Vitaminas", descripcion: "456 productos" },
  { id: "3", nombre: "Cuidado Personal", descripcion: "789 productos" },
  { id: "4", nombre: "Bebé y Mamá", descripcion: "234 productos" },
  { id: "5", nombre: "Primeros Auxilios", descripcion: "123 productos" },
  { id: "6", nombre: "Equipos Médicos", descripcion: "89 productos" },
]

export default function CategoriesPreview() {
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
    // API calls can be uncommented when backend is ready
  }, [])

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">Categorías Principales</h2>
          <p className="text-muted text-balance">Encuentra lo que necesitas</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Cargando categorías...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/categorias/${category.id}`} className="group">
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition border border-border group-hover:border-primary">
                  <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💊</span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1 group-hover:text-primary transition">
                    {category.nombre}
                  </h3>
                  <p className="text-xs text-muted">{category.descripcion}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/categorias">
            <Button variant="outline">Ver Todas las Categorías</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
