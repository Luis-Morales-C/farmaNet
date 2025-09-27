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
  rol: "CLIENTE" | "ADMIN" | "FARMACEUTICO"
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock user profile data
    return {
      id: "1",
      email: "juan.perez@email.com",
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "+1234567890",
      fechaNacimiento: "1990-05-15",
      genero: "masculino",
      rol: "CLIENTE",
      fechaRegistro: "2024-01-15T10:30:00Z",
      activo: true,
      direcciones: [
        {
          id: "1",
          tipo: "casa",
          nombre: "Casa",
          direccion: "Calle Principal 123, Colonia Centro",
          ciudad: "Ciudad de México",
          codigoPostal: "12345",
          telefono: "+1234567890",
          esPrincipal: true,
        },
        {
          id: "2",
          tipo: "trabajo",
          nombre: "Oficina",
          direccion: "Av. Reforma 456, Piso 10",
          ciudad: "Ciudad de México",
          codigoPostal: "54321",
          esPrincipal: false,
        },
      ],
      preferencias: {
        notificacionesEmail: true,
        notificacionesSMS: false,
        ofertas: true,
        newsletter: true,
      },
    }
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful update
    const currentProfile = await this.getProfile()
    const updatedProfile = { ...currentProfile, ...profile }

    // Save to localStorage for demo
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))

    return updatedProfile
  },

  async changePassword(request: PasswordChangeRequest): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (request.currentPassword !== "currentpass") {
      throw new Error("La contraseña actual es incorrecta")
    }

    if (request.newPassword !== request.confirmPassword) {
      throw new Error("Las contraseñas no coinciden")
    }

    if (request.newPassword.length < 6) {
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres")
    }

    console.log("Password changed successfully")
  },

  async deleteAccount(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Clear user data
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")
    localStorage.removeItem("userProfile")
    localStorage.removeItem("cart")

    console.log("Account deleted successfully")
  },

  async addAddress(address: Omit<Direccion, "id">): Promise<Direccion> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newAddress: Direccion = {
      ...address,
      id: Date.now().toString(),
    }

    return newAddress
  },

  async updateAddress(id: string, address: Partial<Direccion>): Promise<Direccion> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const profile = await this.getProfile()
    const addressIndex = profile.direcciones.findIndex((a) => a.id === id)

    if (addressIndex === -1) {
      throw new Error("Dirección no encontrada")
    }

    const updatedAddress = { ...profile.direcciones[addressIndex], ...address }
    return updatedAddress
  },

  async deleteAddress(id: string): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log(`Address ${id} deleted successfully`)
  },
}
