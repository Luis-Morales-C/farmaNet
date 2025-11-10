import { api } from './api'

// User profile types and services
export interface UserProfile {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono?: string
  fechaNacimiento?: string
  genero?: "masculino" | "femenino" | "otro"
  direcciones: Direccion[]
  rol: "CLIENTE" | "ADMIN" | "FARMACEUTICO" | "ADMINISTRADOR"
  fechaRegistro: string
  activo: boolean
  preferencias: {
    notificacionesEmail: boolean
    notificacionesSMS: boolean
    ofertas: boolean
    newsletter: boolean
  }
}

export interface Direccion {
  id: string
  tipo: "casa" | "trabajo" | "otro"
  nombre: string
  direccion: string
  ciudad: string
  codigoPostal: string
  telefono?: string
  esPrincipal: boolean
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// User service functions
export const userService = {
  async getProfile(): Promise<UserProfile> {
    // Get user data from localStorage (populated by auth service)
    const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null
    if (!userStr) {
      throw new Error("Usuario no autenticado")
    }

    const user = JSON.parse(userStr)

    // Convert backend user format to frontend profile format
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono || "",
      fechaNacimiento: "", // Backend doesn't provide this
      genero: undefined, // Backend doesn't provide this
      rol: user.rol || "CLIENTE",
      fechaRegistro: user.fechaRegistro || new Date().toISOString(),
      activo: user.activo !== false, // Default to true if not specified
      direcciones: [], // Backend doesn't provide addresses yet
      preferencias: {
        notificacionesEmail: true,
        notificacionesSMS: false,
        ofertas: true,
        newsletter: true,
      },
    }
  },

  async updateProfile(profileUpdates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // Try to update via API
      const token = typeof window !== 'undefined' ? localStorage.getItem("auth-token") : null
      if (!token) {
        throw new Error("No authentication token")
      }

      const response = await api.fetch(api.user.update(profileUpdates.id || ''), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          nombre: profileUpdates.nombre,
          apellido: profileUpdates.apellido,
          telefono: profileUpdates.telefono,
        })
      })

      if (response.ok) {
        const updatedUser = await response.json()

        // Update localStorage with new data
        const currentUserStr = localStorage.getItem("user")
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr)
          const mergedUser = { ...currentUser, ...updatedUser }
          localStorage.setItem("user", JSON.stringify(mergedUser))
        }

        return await this.getProfile()
      } else {
        throw new Error("API update failed")
      }
    } catch (error) {
      console.warn("API update failed, updating locally:", error)

      // Fallback: Update localStorage only
      const currentUserStr = localStorage.getItem("user")
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr)
        const updatedUser = {
          ...currentUser,
          nombre: profileUpdates.nombre || currentUser.nombre,
          apellido: profileUpdates.apellido || currentUser.apellido,
          telefono: profileUpdates.telefono || currentUser.telefono,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      return await this.getProfile()
    }
  },

  async changePassword(request: PasswordChangeRequest): Promise<void> {
    // Validate input
    if (!request.currentPassword || !request.newPassword || !request.confirmPassword) {
      throw new Error("Todos los campos son obligatorios")
    }

    if (request.newPassword !== request.confirmPassword) {
      throw new Error("Las contraseñas no coinciden")
    }

    if (request.newPassword.length < 6) {
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres")
    }

    try {
      // Try to change password via API
      const token = typeof window !== 'undefined' ? localStorage.getItem("auth-token") : null
      if (!token) {
        throw new Error("No authentication token")
      }

      const response = await api.fetch(api.user.changePassword, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({
          contrasenaActual: request.currentPassword,
          nuevaContrasena: request.newPassword,
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Error al cambiar la contraseña")
      }

      console.log("Password changed successfully via API")
    } catch (error) {
      console.warn("API password change failed:", error)
      throw error // Re-throw to let the component handle the error
    }
  },

  async deleteAccount(): Promise<void> {
    try {
      // Try to delete account via API
      const token = typeof window !== 'undefined' ? localStorage.getItem("auth-token") : null
      if (!token) {
        throw new Error("No authentication token")
      }

      const response = await api.fetch(api.user.deleteAccount, {
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        }
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la cuenta")
      }
    } catch (error) {
      console.warn("API account deletion failed:", error)
    }

    // Always clear local data
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")
    localStorage.removeItem("userProfile")
    localStorage.removeItem("cart")

    // Trigger logout event
    window.dispatchEvent(new Event("user-logout"))

    console.log("Account deleted successfully")
  },

  // Address management functions (simplified for now)
  async addAddress(address: Omit<Direccion, "id">): Promise<Direccion> {
    // For now, just return a mock address since backend doesn't support this yet
    const newAddress: Direccion = {
      ...address,
      id: Date.now().toString(),
    }

    console.log("Address added (local only):", newAddress)
    return newAddress
  },

  async updateAddress(id: string, address: Partial<Direccion>): Promise<Direccion> {
    // For now, just return updated address since backend doesn't support this yet
    const profile = await this.getProfile()
    const addressIndex = profile.direcciones.findIndex((a) => a.id === id)

    if (addressIndex === -1) {
      throw new Error("Dirección no encontrada")
    }

    const updatedAddress = { ...profile.direcciones[addressIndex], ...address }
    console.log("Address updated (local only):", updatedAddress)
    return updatedAddress
  },

  async deleteAddress(id: string): Promise<void> {
    console.log(`Address ${id} deleted (local only)`)
  },
}