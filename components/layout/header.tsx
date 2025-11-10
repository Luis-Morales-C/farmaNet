"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X, Heart, Bell, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useNotifications } from "@/hooks/use-notifications"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()
  const isAuthenticated = !!user && !isLoading
  const { itemCount } = useCart()
  const { unreadCount } = useNotifications()
  const { favoritesCount } = useFavorites()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
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
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              asChild
            >
              <Link href="/notificaciones">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              asChild
            >
              <Link href="/favoritos">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </Badge>
                )}
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
                <span className="text-sm font-medium hidden md:inline">{user?.nombre} {user?.apellido}</span>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsUserMenuOpen(true)}>
                  <User className="h-5 w-5" />
                </Button>
                
                <Dialog open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Mi Cuenta
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col space-y-2">
                        <Button variant="ghost" className="justify-start" asChild onClick={() => setIsUserMenuOpen(false)}>
                          <Link href="/perfil">
                            <User className="mr-2 h-4 w-4" />
                            Mi Perfil
                          </Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild onClick={() => setIsUserMenuOpen(false)}>
                          <Link href="/pedidos">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Mis Pedidos
                          </Link>
                        </Button>
                        <Button variant="ghost" className="justify-start" asChild onClick={() => setIsUserMenuOpen(false)}>
                          <Link href="/favoritos">
                            <Heart className="mr-2 h-4 w-4" />
                            Favoritos
                          </Link>
                        </Button>
                        {user?.rol === "ADMIN" && (
                          <Button variant="ghost" className="justify-start" asChild onClick={() => setIsUserMenuOpen(false)}>
                            <Link href="/admin">
                              <Shield className="mr-2 h-4 w-4" />
                              Panel Admin
                            </Link>
                          </Button>
                        )}
                        <div className="border-t my-2"></div>
                        <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.preventDefault()
                                setIsUserMenuOpen(false) // Close user menu when logout dialog opens
                              }}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Cerrar Sesión
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro de que quieres cerrar sesión?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se cerrará tu sesión actual y serás redirigido a la página de inicio.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleLogout}>
                                Cerrar Sesión
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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