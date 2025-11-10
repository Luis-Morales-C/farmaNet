"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, LogOut, Package, Heart, Bell, Settings } from "lucide-react"
import { api } from '@/lib/api'

interface User {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tab,setTab] = useState("perfil")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      setLoading(false)
    } else {
      router.push("/login")
    }
  }, [router])

const handleLogout = async() => {
    try {
      const token = localStorage.getItem("auth-token");
      if (token) {
        await api.fetch(api.auth.logout, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("auth-token");
      router.push("/");
    }
  };

if(loading) return <div className="text-center py-12">Cargando...</div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<Link href="/" className="flex items-center gap-2 text-primary hover:gap-3 transition mb-6">
          <ChevronLeft className="w-5 h-5" />
          Volver al Inicio
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-boldmb-4">
                {user.nombre[0]}
              </div>
              <h2 className="font-semibold text-foreground">
                {user.nombre} {user.apellido}
              </h2>
              <p className="text-sm text-muted">{user.email}</p>
           </div>

            <nav className="space-y-2">
              <button
                onClick={() => setTab("perfil")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  tab === "perfil" ? "bg-blue-50 text-primary font-medium" : "text-foreground hover:bg-background"
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Mi Perfil
              </button>
              <button
                onClick={() => setTab("pedidos")}
                className={`w-full text-left px-4 py-2 rounded-lgtransition ${
                  tab === "pedidos" ? "bg-blue-50 text-primary font-medium" : "text-foreground hover:bg-background"
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Mis Pedidos
              </button>
              <button
onClick={() => setTab("favoritos")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  tab === "favoritos" ? "bg-blue-50 text-primary font-medium" : "text-foreground hover:bg-background"
                }`}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Favoritos
              </button>
              <button
                onClick={() => setTab("notificaciones")}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  tab === "notificaciones"
                    ? "bg-blue-50 text-primary font-medium"
                    :"text-foreground hover:bg-background"
                }`}
              >
                <Bell className="w-4 h-4 inline mr-2" />
                Notificaciones
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Cerrar Sesión
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3 bg-white rounded-lg border border-border p-8">
            {tab === "perfil" && <ProfileSection user={user} />}
            {tab === "pedidos" && <OrdersSection />}
            {tab === "favoritos" && <FavoritesSection />}
            {tab === "notificaciones" && <NotificationsSection />}
          </div>
       </div>
      </div>
    </div>
  )
}

function ProfileSection({ user }: { user: User }) {
  const [formData, setFormData] = useState(user)
  const [saved, setSaved] = useState(false)

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setSaved(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API call to update profilesetSaved(true)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Mi Perfil</h2>

      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          Perfil actualizado correctamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
           <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-nonefocus:ring-2 focus:ring-primary"
            />
          </div>
         <div>
            <label className="block text-sm font-medium text-foreground mb-2">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
           onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderrounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

       <Button type="submit">Guardar Cambios</Button>
      </form>
    </div>
  )
}

function OrdersSection() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch orders
    setLoading(false)
 }, [])

return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Mis Pedidos</h2>
      <p className="text-muted">Revisa el estado de tus compras</p>

      {loading ? (
        <div className="text-centerpy-12">
          <p className="text-muted">Cargando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted mb-4 opacity-50" />
          <p className="text-muted text-lg mb-4">No tienes pedidos aún</p>
          <p className="text-muted text-sm mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
          <Link href="/catalogo">
<Button>Explorar Productos</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">{/* Orders will be displayed here */}</div>
      )}
    </div>
  )
}

function FavoritesSection() {
  const [favorites, setFavorites]= useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch favorites
    setLoading(false)
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Favoritos</h2>

    {loading ? (
        <div className="text-center py-12">
          <p className="text-muted">Cargando favoritos...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto text-muted mb-4 opacity-50" />
          <p className="text-muted text-lg mb-4">No tienes productos favoritos</p>
          <p className="text-muted text-sm mb-6">Agrega productos a favoritos mientras compras</p>
          <Link href="/catalogo">
            <Button>Explorar Productos</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Favorites will be displayedhere */}
        </div>
      )}
    </div>
  )
}

function NotificationsSection() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch notifications
    setLoading(false)
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Notificaciones</h2>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted">Cargando notificaciones...</p>
        </div>
      ):notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 mx-auto text-muted mb-4 opacity-50" />
          <p className="text-muted text-lg">No tienes notificaciones</p>
        </div>
      ) : (
        <div className="space-y-4">{/* Notifications will be displayed here */}</div>
      )}
    </div>
  )
}
