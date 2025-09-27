import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Truck, Clock, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 font-space-grotesk">
                Tu Farmacia Online de <span className="text-primary">Confianza</span>
              </h1>
              <p className="text-xl text-muted-foreground text-balance mb-8">
                Medicamentos y productos de salud con la mejor calidad, entrega rápida y atención profesional las 24
                horas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/catalogo">
                    Ver Catálogo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                  {/*
                  <Link href="/registro">Crear Cuenta</Link>                                                // La quite porque ya esta arriba
                  */}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-space-grotesk">¿Por qué elegir FarmaNet?</h2>
              <p className="text-muted-foreground text-lg">Servicios que nos hacen únicos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Productos Certificados</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Todos nuestros medicamentos están certificados y aprobados por las autoridades sanitarias.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Envío Rápido</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Entrega en 24-48 horas en toda la ciudad. Envío gratuito en compras superiores a $50.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Atención 24/7</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Nuestro equipo de farmacéuticos está disponible las 24 horas para consultas.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Mejor Precio</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Precios competitivos y ofertas especiales para nuestros clientes registrados.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-space-grotesk">Categorías Principales</h2>
              <p className="text-muted-foreground text-lg">Encuentra lo que necesitas</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Medicamentos", count: "1,234", image: "/medicine-pills.png" },
                { name: "Vitaminas", count: "456", image: "/assorted-vitamin-bottles.png" },
                { name: "Cuidado Personal", count: "789", image: "/personal-care-products-collection.png" },
                { name: "Bebé y Mamá", count: "234", image: "/baby-care-products.png" },
                { name: "Primeros Auxilios", count: "123", image: "/first-aid-kit.png" },
                { name: "Equipos Médicos", count: "89", image: "/diverse-medical-equipment.png" },
              ].map((category) => (
                <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                    />
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} productos
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/categorias">Ver Todas las Categorías</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 font-space-grotesk">¿Listo para comenzar?</h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a miles de clientes satisfechos y disfruta de la mejor experiencia en farmacia online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/registro">Crear Cuenta Gratis</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <Link href="/catalogo">Explorar Productos</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
