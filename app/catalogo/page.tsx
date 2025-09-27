"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/products/product-card"
import { type Producto, type Categoria, productService } from "@/lib/products"

export default function CatalogoPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filters
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
  const [rangoPrecios, setRangoPrecios] = useState([0, 100])
  const [soloSinReceta, setSoloSinReceta] = useState(false)
  const [ordenarPor, setOrdenarPor] = useState<"precio-asc" | "precio-desc" | "nombre" | "rating">("nombre")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadProductos()
  }, [busqueda, categoriaSeleccionada, rangoPrecios, soloSinReceta, ordenarPor])

  const loadData = async () => {
    try {
      const [productosData, categoriasData] = await Promise.all([
        productService.getProductos(),
        productService.getCategorias(),
      ])
      setProductos(productosData)
      setCategorias(categoriasData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadProductos = async () => {
    try {
      const filters = {
        busqueda: busqueda || undefined,
        categoria: categoriaSeleccionada || undefined,
        precioMin: rangoPrecios[0],
        precioMax: rangoPrecios[1],
        requiereReceta: soloSinReceta ? false : undefined,
        ordenarPor,
      }
      const data = await productService.getProductos(filters)
      setProductos(data)
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const clearFilters = () => {
    setBusqueda("")
    setCategoriaSeleccionada("")
    setRangoPrecios([0, 100])
    setSoloSinReceta(false)
    setOrdenarPor("nombre")
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categorías</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="todas-categorias"
              checked={!categoriaSeleccionada}
              onCheckedChange={() => setCategoriaSeleccionada("")}
            />
            <Label htmlFor="todas-categorias" className="text-sm">
              Todas las categorías
            </Label>
          </div>
          {categorias.map((categoria) => (
            <div key={categoria.id} className="flex items-center space-x-2">
              <Checkbox
                id={categoria.id}
                checked={categoriaSeleccionada === categoria.id}
                onCheckedChange={() => setCategoriaSeleccionada(categoria.id)}
              />
              <Label htmlFor={categoria.id} className="text-sm">
                {categoria.nombre} ({categoria.productCount})
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Rango de Precios</h3>
        <div className="space-y-3">
          <Slider value={rangoPrecios} onValueChange={setRangoPrecios} max={100} step={5} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${rangoPrecios[0]}</span>
            <span>${rangoPrecios[1]}</span>
          </div>
        </div>
      </div>

      {/* Prescription Filter */}
      <div>
        <h3 className="font-semibold mb-3">Tipo de Producto</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sin-receta"
            checked={soloSinReceta}
            onCheckedChange={(checked) => setSoloSinReceta(checked as boolean)}
          />
          <Label htmlFor="sin-receta" className="text-sm">
            Solo productos sin receta
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        Limpiar Filtros
      </Button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando productos...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 font-space-grotesk">Catálogo de Productos</h1>
            <p className="text-muted-foreground">Encuentra todos los medicamentos y productos de salud que necesitas</p>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos, medicamentos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Sort */}
            <Select value={ordenarPor} onValueChange={(value: any) => setOrdenarPor(value)}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nombre">Nombre A-Z</SelectItem>
                <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="rating">Mejor Valorados</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Filtros</h2>
                    <Filter className="h-4 w-4" />
                  </div>
                  <FiltersContent />
                </CardContent>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {productos.length} producto{productos.length !== 1 ? "s" : ""} encontrado
                  {productos.length !== 1 ? "s" : ""}
                </p>
                {(busqueda || categoriaSeleccionada || soloSinReceta) && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filtros activos:</span>
                    {busqueda && (
                      <Badge variant="secondary" className="text-xs">
                        Búsqueda: {busqueda}
                      </Badge>
                    )}
                    {categoriaSeleccionada && (
                      <Badge variant="secondary" className="text-xs">
                        {categorias.find((c) => c.id === categoriaSeleccionada)?.nombre}
                      </Badge>
                    )}
                    {soloSinReceta && (
                      <Badge variant="secondary" className="text-xs">
                        Sin receta
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Products */}
              {productos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                  <p className="text-muted-foreground mb-4">Intenta ajustar tus filtros o términos de búsqueda</p>
                  <Button onClick={clearFilters}>Limpiar Filtros</Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {productos.map((producto) => (
                    <ProductCard key={producto.id} producto={producto} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
