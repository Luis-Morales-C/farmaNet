"useclient"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

//Authenticationutility functions
import { api } from '@/lib/api';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: string;
}

export interface LoginResponse {
  success: boolean;
  mensaje?: string;
  data?:{
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    token: string;
  };
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  mensaje?: string;
  data?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    rol: string;
  };
  error?: string;
}

export const authService = {
  // Login user
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.fetch(api.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();
      // If backend returns token, store it
      if (json?.data?.token) {
        localStorage.setItem('auth-token', json.data.token)
        localStorage.setItem('user', JSON.stringify(json.data))
      }

      return json;
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión. Por favor intenta de nuevo.',
     };
    }
  },

  // Register user
  register: async (
    nombre: string,
    apellido: string,
    email: string,
    telefono: string,
    contrasena: string
  ): Promise<RegisterResponse> => {
    try {
      const response = await api.fetch(api.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          telefono,
          contrasena,
        }),
      });

      const json = await response.json();
      return json;
    } catch (error) {
      return {
        success: false,
error: 'Error de conexión. Por favor intenta de nuevo.',
      };
    }
  },

  // Logoutuser
  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth-token');
      if (token) {
        await api.fetch(api.auth.logout, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('auth-token');
    }
  },

  // Check if email exists
  checkEmail: async (email: string): Promise<boolean> => {
    try {
      const response = await api.fetch(api.auth.checkEmail(email));
      return await response.json();
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null=> {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Get auth token from localStorage
  getAuthToken: (): string | null => {
    return localStorage.getItem('auth-token');
  },
}

export const AuthContext = createContext<{
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    email: string
    password: string
    nombre: string
    apellido: string
    telefono?: string
  }) =>Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  isLoading: boolean
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
 const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    const token = authService.getAuthToken()
    console.log("AuthProvider initialized:", {
      hasUser: !!currentUser,
      hasToken: !!token,
      user: currentUser
    })
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user } = await authService.login(email, password)
      setUser(user)
    } catch (error) {
      console.error("Error en login:", error)
     throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    email: string
    password: string
    nombre: string
    apellido: string
    telefono?: string
  }) => {
    setIsLoading(true)
    try {
      const {user } = await authService.register(userData)
      setUser(user)
    } catch (error) {
      console.error("Error en registro:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
  }


const forgotPassword = async (email: string) => {
    await authService.forgotPassword(email)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}