import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "FarmaNet - Tu Farmacia Online de Confianza",
  description:
    "Medicamentos y productos de salud con la mejor calidad, entrega rápida y atención profesional las 24 horas.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${dmSans.className} ${spaceGrotesk.variable} bg-background text-foreground`}>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="min-h-screen">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
