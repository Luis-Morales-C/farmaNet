"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { api } from '@/lib/api'

interface Category {
  id: string
  nombre: string
  descripcion: string
}

export default function CategoriesPage() {
  const [categories, setCategories]= useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorias/obtener`)
      const result = await response.json()
      if (Array.isArray(result)) {
        setCategories(result)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Categorías de Productos</h1>
          <p className="text-muted text-lg">
            Explora nuestras categorías organizadas para encontrar exactamente lo que necesitas
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Cargando categorías...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categorias/${category.id}`}>
                <div className="bg-gradient-to-br from-white to-background border border-border rounded-lg p-8 hover:shadow-lg transition group cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition">
                        {category.nombre}
                      </h3>
                      <p className="text-muted mb-4">{category.descripcion}</p>
                      <div className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition">
                        Ver productos
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-5xl">💊</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
