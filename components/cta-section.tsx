import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="bg-primary text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">¿Listo para comenzar?</h2>
        <p className="text-lg text-primary-foreground mb-8 text-balance">
          Únete a miles de clientes satisfechos y disfruta de la mejor experiencia en farmacia online.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/registro">
            <Button size="lg" variant="secondary">
              Crear Cuenta Gratis
            </Button>
          </Link>
          <Link href="/catalogo">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Explorar Productos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
