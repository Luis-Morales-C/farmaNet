import Link from "next/link"
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-sm">FN</span>
              </div>
              <span className="font-bold text-white">FarmaNet</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Tu farmacia online de confianza. Medicamentos y productos de salud con la mejor calidad y servicio.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-primary-foreground hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalogo" className="text-primary-foreground hover:text-white transition">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="text-primary-foreground hover:text-white transition">
                  Categorías
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-primary-foreground hover:text-white transition">
                  Ofertas
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-primary-foreground hover:text-white transition">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Atención al Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/centro-ayuda" className="text-primary-foreground hover:text-white transition">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-primary-foreground hover:text-white transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-primary-foreground hover:text-white transition">
                  Información de Envíos
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-primary-foreground hover:text-white transition">
                  Devoluciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-primary-foreground">+57 3104542581</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <a href="mailto:info@farmanet.com" className="text-primary-foreground hover:text-white transition">
                  info@farmanet.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-primary-foreground">Armenia Quindío - Colombia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="max-w-md">
            <h3 className="font-semibold mb-2 text-white">Newsletter</h3>
            <p className="text-sm text-primary-foreground mb-4">Recibe ofertas exclusivas y novedades</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition text-sm">
                Suscribir
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-primary-foreground">
          <p>© 2025 FarmaNet. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacidad" className="hover:text-white transition">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-white transition">
              Términos de Uso
            </Link>
            <Link href="/legal" className="hover:text-white transition">
              Aviso Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
