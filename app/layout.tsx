import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import { CartProvider } from "@/lib/cart"

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
  title: "FarmaNet - Tu Farmacia Online",
  description:
    "Sistema completo de farmacia online con catálogo de medicamentos, carrito de compras y gestión de pedidos",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${dmSans.variable} ${spaceGrotesk.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </CartProvider>
        </AuthProvider>
        {/* Analytics component removed */}
      </body>
    </html>
  )
}
