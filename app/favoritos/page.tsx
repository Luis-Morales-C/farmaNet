"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, ArrowLeft, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProtectedRoute } from "@/components/auth/protected-route"

// Mock data para favoritos
const mockFavoritos = [
  {
    id: "1",
    nombre: "Paracetamol 500mg",
    precio: 15.99,
    precioOferta: 11.99,
    imagen: "/paracetamol-tablets.jpg",
    categoria: "Medicamentos",
    rating: 4.5,
    reviews: 128,
    stock: 45,
    marca: "Genérico",
    presentacion: "Caja x 20 tabletas",
    requiereReceta: false,
  },
  {
    id: "2",
    nombre: "Vitamina C 1000mg",
    precio: 24.99,
    imagen: "/vitamin-c-tablets.jpg",
    categoria: "Vitaminas",
    rating: 4.7,
    reviews: 89,
    stock: 32,
    marca: "VitaHealth",
    presentacion: "Frasco x 60 cápsulas",
    requiereReceta: false,
  },
  {
    id: "3",
    nombre: "Crema Hidratante Facial",
    precio: 32.99,
    imagen: "/facial-moisturizer.jpg",
    categoria: "Cuidado Personal",
    rating: 4.3,
    reviews: 156,
    stock: 28,
    marca: "DermaPlus",
    presentacion: "Tubo 50ml",
    requiereReceta: false,
  },
]

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState(mockFavoritos)
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleAddToCart = (producto: any) => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      precioOferta: producto.precioOferta,
      imagen: producto.imagen,
      marca: producto.marca,
      presentacion: producto.presentacion,
      stock: producto.stock,
      requiereReceta: producto.requiereReceta,
    })
  }

  const handleRemoveFromFavorites = (productoId: string, nombre: string) => {
    setFavoritos((prev) => prev.filter((item) => item.id !== productoId))
    toast({
      title: "Eliminado de favoritos",
      description: `${nombre} se eliminó de tus favoritos`,
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/perfil">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold font-space-grotesk flex items-center gap-2">
                  <Heart className="h-8 w-8 text-red-500" />
                  Mis Favoritos
                </h1>
                <p className="text-muted-foreground">
                  {favoritos.length} {favoritos.length === 1 ? "producto favorito" : "productos favoritos"}
                </p>
              </div>
            </div>

            {favoritos.length === 0 ? (
              <div className="text-center max-w-md mx-auto py-16">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-12 w-12 text-muted-foreground" />
                </div>

                <h2 className="text-2xl font-bold mb-2 font-space-grotesk">No tienes favoritos</h2>
                <p className="text-muted-foreground mb-8">
                  Agrega productos a tus favoritos para encontrarlos fácilmente más tarde
                </p>

                <div className="space-y-3">
                  <Button size="lg" asChild className="w-full">
                    <Link href="/catalogo">Explorar Productos</Link>
                  </Button>

                  <Button variant="outline" size="lg" asChild className="w-full bg-transparent">
                    <Link href="/categorias">Ver Categorías</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoritos.map((producto) => (
                  <Card key={producto.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="relative p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={producto.imagen || "/placeholder.svg"}
                          alt={producto.nombre}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {producto.precioOferta && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold">
                              -{Math.round(((producto.precio - producto.precioOferta) / producto.precio) * 100)}%
                            </Badge>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 hover:text-red-600"
                          onClick={() => handleRemoveFromFavorites(producto.id, producto.nombre)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {producto.categoria}
                        </Badge>
                        <div className="flex items-center gap-1 ml-auto">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {producto.rating} ({producto.reviews})
                          </span>
                        </div>
                      </div>

                      <CardTitle className="text-lg mb-2 line-clamp-2">{producto.nombre}</CardTitle>

                      <div className="text-sm text-muted-foreground mb-2">
                        <p>{producto.marca}</p>
                        <p>{producto.presentacion}</p>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {producto.precioOferta ? (
                          <>
                            <span className="text-2xl font-bold text-primary">${producto.precioOferta}</span>
                            <span className="text-lg text-gray-400 line-through">${producto.precio}</span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-primary">${producto.precio}</span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600">Stock disponible: {producto.stock} unidades</div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button
                        onClick={() => handleAddToCart(producto)}
                        className="w-full"
                        disabled={producto.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {producto.stock > 0 ? "Agregar al Carrito" : "Sin Stock"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
