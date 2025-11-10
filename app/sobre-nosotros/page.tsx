import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SobreNosotrosPage() {
  const teamMembers = [
    { name: "Miguel Angel Montenegro" },
    { name: "Luis Carlos Morales" },
    { name: "Bryan Ramirez" },
    { name: "Ingrid Tatiana Mosquera" },
    { name: "Juan Manuel Flor" }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6 font-space-grotesk">
                Sobre FarmaNet Armenia
              </h1>
              <p className="text-xl text-muted-foreground text-balance mb-8">
                Tu farmacia online de confianza en Armenia, Quindío, Colombia
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-space-grotesk">Nuestra Historia</h2>
              <p className="text-lg text-muted-foreground">
                FarmaNet es una farmacia online comprometida con la salud y el bienestar de la comunidad de Armenia, Quindío. 
                Nacimos con la visión de hacer que los productos farmacéuticos y de salud estén disponibles para todos, 
                con solo unos clics, brindando comodidad, calidad y confianza.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <CardTitle>Misión</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Facilitar el acceso a productos farmacéuticos y artículos de salud de calidad en Armenia y el Eje Cafetero, 
                    ofreciendo un servicio rápido, confiable y profesional las 24 horas del día.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visión</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Ser la farmacia online líder en la región del Eje Cafetero colombiano, 
                    reconocida por nuestra excelencia en servicio al cliente, calidad de productos 
                    y compromiso con la salud de nuestra comunidad.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="bg-card border rounded-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-4 text-center">¿Por qué elegir FarmaNet?</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>Entrega rápida en Armenia y zona cafetera</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>Productos certificados y de calidad</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>Atención personalizada por farmacéuticos</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>Precios competitivos y ofertas especiales</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>Disponibilidad 24/7</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span>Compra segura y confidencial</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 font-space-grotesk">Nuestro Equipo</h2>
              <p className="text-lg text-muted-foreground">
                Desarrollado con pasión por el super equipo "Los Studentbook"
              </p>
            </div>

            <Card className="border-primary/20 border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Los Studentbook</CardTitle>
                <CardDescription>
                  El increíble equipo de desarrollo detrás de FarmaNet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center p-3 bg-secondary/10 rounded-lg">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary font-bold text-sm">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground italic">
                    "Juntos creamos soluciones tecnológicas que mejoran la vida de las personas en nuestra comunidad"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4 font-space-grotesk">¡Conoce nuestros productos!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Explora nuestro catálogo completo y encuentra todo lo que necesitas para tu salud y bienestar.
            </p>
            <Button size="lg" asChild>
              <Link href="/catalogo">
                Ver Catálogo
              </Link>
            </Button>
            
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link href="/" className="flex items-center justify-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}