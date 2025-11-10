import { ShieldCheck, Truck, Clock, Star } from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Productos Certificados",
    description: "Todos nuestros medicamentos están certificados y aprobados por las autoridades sanitarias.",
  },
  {
    icon: Truck,
    title: "Envío Rápido",
    description: "Entrega en 24-48 horas en toda la ciudad. Envío gratuito en compras superiores a $50.",
  },
  {
    icon: Clock,
    title: "Atención 24/7",
    description: "Nuestro equipo de farmacéuticos está disponible las 24 horas para consultas.",
  },
  {
    icon: Star,
    title: "Mejor Precio",
    description: "Precios competitivos y ofertas especiales para nuestros clientes registrados.",
  },
]

export default function BenefitsSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-balance">
            ¿Por qué elegir FarmaNet?
          </h2>
          <p className="text-muted text-balance">Servicios que nos hacen únicos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-[#e6f5ed] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
