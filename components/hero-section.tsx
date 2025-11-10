import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-background to-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
          Tu Farmacia Online de <span className="text-primary">Confianza</span>
        </h1>
        <p className="text-lg md:text-xl text-primary font-medium mb-8 text-balance">
          Medicamentos y productos de salud con la mejor calidad, entrega rápida y atención profesional las 24 horas.
        </p>
        <Link href="/catalogo">
          <Button size="lg" className="gap-2">
            Ver Catálogo
            <span>→</span>
          </Button>
        </Link>
      </div>
    </section>
  )
}
