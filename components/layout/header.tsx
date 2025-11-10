"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X, Heart, Bell, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()
  const isAuthenticated = !!user && !isLoading
  const { itemCount } = useCart()
  const router = useRouter()

  console.log("[Header] Estado de autenticación:", {
    user: user?.nombre,
    isAuthenticated,
    isLoading,
    rol: user?.rol,
  })

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const handleNavigate = (path: string) => {
    console.log("[Header] Navegando a:", path, {
      isAuthenticated,
      user: user?.nombre,
    })
    router.push(path)
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">FN</span>
            </div>
            <span className="text-xl font-bold text-primary font-space-grotesk">FarmaNet</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar medicamentos, productos..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
              <span className="text-xs text-muted-foreground absolute right-2 bottom-1">
                {isAuthenticated ? "✓ Auth" : "✗ No Auth"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/catalogo" className="text-sm font-medium hover:text-primary transition-colors">
              Catálogo
            </Link>
            <Link href="/categorias" className="text-sm font-medium hover:text-primary transition-colors">
              Categorías
            </Link>
            <Link href="/ofertas" className="text-sm font-medium hover:text-primary transition-colors">
              Ofertas
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/notificaciones">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
              </Link>
            </Button>

            {/* Favorites */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/favoritos">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">5</Badge>
              </Link>
            </Button>

            {/* Shopping Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/carrito">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">{itemCount}</Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Gestionar Perfil Button - visible for all authenticated users */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log("[Header] Click en 'Mi Perfil'", {
                      isAuthenticated,
                      user: user?.nombre,
                      rol: user?.rol,
                    })
                    handleNavigate("/perfil")
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </Button>

                {/* Admin Panel Button - only for admins */}
                {user?.rol === "ADMIN" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log("[Header] Click en 'Usuarios'", {
                        isAuthenticated,
                        user: user?.nombre,
                        rol: user?.rol,
                      })
                      handleNavigate("/admin/usuarios")
                    }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Usuarios
                  </Button>
                )}

                {/* Logout Button */}
                <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Cerrar Sesión
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro de que quieres cerrar sesión?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Se cerrará tu sesión actual y serás redirigido a la página de inicio de sesión.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Cerrar Sesión</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar medicamentos, productos..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/catalogo"
                className="px-2 py-1 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Catálogo
              </Link>
              <Link
                href="/categorias"
                className="px-2 py-1 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categorías
              </Link>
              <Link
                href="/ofertas"
                className="px-2 py-1 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ofertas
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}