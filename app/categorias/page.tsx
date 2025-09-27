"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { type Categoria, productService } from "@/lib/products"

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    try {
      const data = await productService.getCategorias()
      setCategorias(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando categorías...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-space-grotesk">Categorías de Productos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora nuestras categorías organizadas para encontrar exactamente lo que necesitas
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorias.map((categoria) => (
              <Card key={categoria.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div className="relative">
                  <img
                    src={categoria.imagen || "/placeholder.svg"}
                    alt={categoria.nombre}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <Badge className="absolute top-4 right-4 bg-primary">{categoria.productCount} productos</Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-space-grotesk">{categoria.nombre}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{categoria.descripcion}</p>

                  {categoria.subcategorias && categoria.subcategorias.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Subcategorías:</h4>
                      <div className="flex flex-wrap gap-1">
                        {categoria.subcategorias.slice(0, 4).map((sub) => (
                          <Badge key={sub} variant="secondary" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                        {categoria.subcategorias.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{categoria.subcategorias.length - 4} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button asChild className="w-full group">
                    <Link href={`/catalogo?categoria=${categoria.id}`}>
                      Ver Productos
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
