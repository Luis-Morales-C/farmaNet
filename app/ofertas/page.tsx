"use client"

import { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Star, Clock, Percent } from "lucide-react"
import { useCart } from "@/lib/cart"
import Link from "next/link"

// Mock data para ofertas
const ofertas = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    originalPrice: 15.99,
    salePrice: 11.99,
    discount: 25,
    image: "/paracetamol-tablets.jpg",
    category: "Medicamentos",
    rating: 4.5,
    reviews: 128,
    stock: 45,
    expiresIn: "2 días",
    description: "Analgésico y antipirético para dolor y fiebre",
  },
  {
    id: "2",
    name: "Vitamina C 1000mg",
    originalPrice: 24.99,
    salePrice: 17.99,
    discount: 28,
    image: "/vitamin-c-tablets.jpg",
    category: "Vitaminas",
    rating: 4.7,
    reviews: 89,
    stock: 32,
    expiresIn: "5 días",
    description: "Suplemento vitamínico para fortalecer el sistema inmune",
  },
  {
    id: "3",
    name: "Crema Hidratante Facial",
    originalPrice: 32.99,
    salePrice: 22.99,
    discount: 30,
    image: "/facial-moisturizer.jpg",
    category: "Cuidado Personal",
    rating: 4.3,
    reviews: 156,
    stock: 28,
    expiresIn: "1 día",
    description: "Crema hidratante para todo tipo de piel",
  },
  {
    id: "4",
    name: "Pañales Bebé Talla M",
    originalPrice: 45.99,
    salePrice: 34.99,
    discount: 24,
    image: "/baby-diapers.jpg",
    category: "Bebé",
    rating: 4.6,
    reviews: 203,
    stock: 15,
    expiresIn: "3 días",
    description: "Pañales ultra absorbentes para bebés de 6-10 kg",
  },
  {
    id: "5",
    name: "Ibuprofeno 400mg",
    originalPrice: 18.99,
    salePrice: 13.99,
    discount: 26,
    image: "/medicine-pills.png",
    category: "Medicamentos",
    rating: 4.4,
    reviews: 94,
    stock: 38,
    expiresIn: "4 días",
    description: "Antiinflamatorio para dolor y inflamación",
  },
  {
    id: "6",
    name: "Protector Solar SPF 50",
    originalPrice: 28.99,
    salePrice: 19.99,
    discount: 31,
    image: "/personal-care-products-collection.png",
    category: "Cuidado Personal",
    rating: 4.5,
    reviews: 167,
    stock: 22,
    expiresIn: "6 días",
    description: "Protección solar de amplio espectro",
  },
]

function OfertasContent() {
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice,
      image: product.image,
      category: product.category,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Percent className="h-8 w-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">Ofertas Especiales</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aprovecha nuestras mejores ofertas en medicamentos y productos de salud
          </p>
        </div>

        {/* Ofertas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ofertas.map((producto) => (
            <Card
              key={producto.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="relative p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={producto.image || "/placeholder.svg"}
                    alt={producto.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold">-{producto.discount}%</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      <Clock className="h-3 w-3 mr-1" />
                      {producto.expiresIn}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {producto.category}
                  </Badge>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {producto.rating} ({producto.reviews})
                    </span>
                  </div>
                </div>

                <CardTitle className="text-lg mb-2 line-clamp-2">{producto.name}</CardTitle>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{producto.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-emerald-600">${producto.salePrice}</span>
                  <span className="text-lg text-gray-400 line-through">${producto.originalPrice}</span>
                </div>

                <div className="text-sm text-gray-600">Stock disponible: {producto.stock} unidades</div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={() => handleAddToCart(producto)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={producto.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {producto.stock > 0 ? "Agregar al Carrito" : "Sin Stock"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-emerald-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¿No encontraste lo que buscabas?</h2>
            <p className="text-gray-600 mb-6">Explora nuestro catálogo completo con más de 1000 productos</p>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/catalogo">Ver Catálogo Completo</Link>
            </Button>
            <div className="mt-4">
              <Button variant="outline" size="lg" asChild>
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OfertasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando ofertas...</p>
          </div>
        </div>
      }
    >
      <OfertasContent />
    </Suspense>
  )
}
