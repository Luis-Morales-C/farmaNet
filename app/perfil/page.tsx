"use client"

import { useState, useEffect } from "react"
import { User, Mail, Shield, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { EditProfileForm } from "@/components/profile/edit-profile-form"
import { ChangePasswordForm } from "@/components/profile/change-password-form"
import { AddressManager } from "@/components/profile/address-manager"
import { PreferencesForm } from "@/components/profile/preferences-form"
import { DeleteAccountDialog } from "@/components/profile/delete-account-dialog"
import { type UserProfile, userService } from "@/lib/user"

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("perfil")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile()
      setProfile(data)
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando perfil...</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Error al cargar el perfil</h1>
              <p className="text-muted-foreground">No se pudo cargar la información del perfil.</p>
            </div>
          </main>
          <Footer />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h1 className="text-2xl font-bold font-space-grotesk">
                        {profile.nombre} {profile.apellido}
                      </h1>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4" />
                        {profile.email}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant={profile.activo ? "default" : "secondary"}>
                          {profile.activo ? "Activo" : "Inactivo"}
                        </Badge>
                        <Badge variant="outline">{profile.rol}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Miembro desde {new Date(profile.fechaRegistro).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="direcciones">Direcciones</TabsTrigger>
                <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
                <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
                <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
              </TabsList>

              <TabsContent value="perfil" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EditProfileForm profile={profile} onUpdate={handleProfileUpdate} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="direcciones" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Direcciones de Entrega</CardTitle>
                    <CardDescription>Gestiona tus direcciones de entrega para tus pedidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AddressManager addresses={profile.direcciones} onUpdate={loadProfile} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seguridad" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cambiar Contraseña</CardTitle>
                      <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChangePasswordForm />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Información de Seguridad</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Cuenta Verificada</p>
                          <p className="text-sm text-muted-foreground">Tu email ha sido verificado</p>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>Último acceso: Hoy a las 10:30 AM</p>
                        <p>Dispositivo: Chrome en Windows</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="preferencias" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias de Notificación</CardTitle>
                    <CardDescription>Configura cómo y cuándo quieres recibir notificaciones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PreferencesForm preferences={profile.preferencias} onUpdate={handleProfileUpdate} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cuenta" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas de la Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-primary">12</p>
                          <p className="text-sm text-muted-foreground">Pedidos Realizados</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-primary">$1,245</p>
                          <p className="text-sm text-muted-foreground">Total Gastado</p>
                        </div>
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-2xl font-bold text-primary">8</p>
                          <p className="text-sm text-muted-foreground">Productos Favoritos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive flex items-center gap-2">
                        <Trash2 className="h-5 w-5" />
                        Zona de Peligro
                      </CardTitle>
                      <CardDescription>Acciones irreversibles que afectan tu cuenta</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-destructive/20 rounded-lg">
                          <h4 className="font-semibold mb-2">Eliminar Cuenta</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. No podrás
                            recuperar esta información.
                          </p>
                          <DeleteAccountDialog />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
