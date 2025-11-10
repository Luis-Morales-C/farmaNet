"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Bell, User, Search, LayoutDashboard } from "lucide-react"

export default function Header() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = async () => {
      const token = localStorage.getItem("auth-token")
      const user = localStorage.getItem("user")
      
      if (token && user) {
        try {
          const userData = JSON.parse(user)
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/carrito/obtener/${userData.id}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
          
          if (response.ok) {
            const result = await response.json()
            if (result.success && result.data) {
              setCartCount(result.data.cantidadTotalItems || 0)
              return
            }
          }
        } catch (error) {
          console.error("Error fetching cart count:", error)
        }
      }
      
      // Fallback to localStorage count
      const cart = localStorage.getItem("cart")
      if (cart) {
        const cartItems = JSON.parse(cart)
        setCartCount(cartItems.length)
      } else {
        setCartCount(0)
      }
    }

    updateCartCount()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount()
    }
    
    window.addEventListener("cartUpdated", handleCartUpdate)
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchValue)}`)
      setSearchValue("")
    }
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg font-space-grotesk">FN</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline text-foreground font-space-grotesk">FarmaNet</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar medicamentos, productos..."
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button type="submit" className="absolute right-3 top-2.5 hover:opacity-70 transition">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/catalogo" className="text-foreground hover:text-primary transition">
              Catálogo
            </Link>
            <Link href="/categorias" className="text-foreground hover:text-primary transition">
              Categorías
            </Link>
            <Link href="/ofertas" className="text-foreground hover:text-primary transition">
              Ofertas
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-card rounded-lg transition hidden sm:block text-foreground hover:text-primary">
              <Bell className="w-5 h-5" />
            </button>
            <Link
              href="/favoritos"
              className="p-2 hover:bg-card rounded-lg transition hidden sm:block text-foreground hover:text-primary"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/carrito"
              className="p-2 hover:bg-card rounded-lg transition relative text-foreground hover:text-primary"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold cart-count">
                {cartCount}
              </span>
            </Link>
            <Link
              href="/cuenta"
              className="p-2 hover:bg-card rounded-lg transition hidden sm:block text-foreground hover:text-primary"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/admin"
              className="p-2 hover:bg-card rounded-lg transition hidden sm:block text-foreground hover:text-primary"
              title="Panel Admin"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-card rounded-lg transition text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link href="/catalogo" className="block px-4 py-2 text-foreground hover:bg-card rounded-lg transition">
              Catálogo
            </Link>
            <Link href="/categorias" className="block px-4 py-2 text-foreground hover:bg-card rounded-lg transition">
              Categorías
            </Link>
            <Link href="/ofertas" className="block px-4 py-2 text-foreground hover:bg-card rounded-lg transition">
              Ofertas
            </Link>
            <Link href="/favoritos" className="block px-4 py-2 text-foreground hover:bg-card rounded-lg transition">
              Favoritos
            </Link>
            <Link href="/cuenta" className="block px-4 py-2 text-foreground hover:bg-card rounded-lg transition">
              Mi Cuenta
            </Link>
            <Link href="/admin" className="block px-4 py-2 text-foreground hover:bg-card rounded-lg transition">
              Admin
            </Link>
            <form onSubmit={handleSearch} className="px-4 py-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Buscar..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </form>
          </nav>
        )}
      </div>
    </header>
  )
}