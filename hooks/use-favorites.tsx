"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'

interface Favorito {
  id: string
  usuarioId: string
  productoId: string
  fechaAgregado: string
}

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Favorito[]>([])
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Función para obtener el token
  const getToken = () => {
    if (typeof window!== 'undefined') {
      return localStorage.getItem('auth-token')
    }
    return null
  }

  // Cargar favoritos del usuario
  const loadFavorites = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const token = getToken()
      if (!token)return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favoritos`, {
headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFavorites(data)
        setFavoritesCount(data.length)
      }
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar conteo de favoritos
  const loadFavoritesCount = async () => {
    if (!user) return

    try {
      const token = getToken()
      if (!token) return

      constresponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favoritos/conteo`, {
headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const count= await response.json()
        setFavoritesCount(count)
      }
    } catch (error) {
      console.error('Error loading favorites count:', error)
    }
  }

  // Verificar si un producto es favorito
  const checkIsFavorite = async (productoId: string): Promise<boolean> => {
   if (!user) return false

    try {
      const token = getToken()
      if (!token) return false

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favoritos/verificar/${productoId}`, {
headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        constresult= await response.json()
returnresult.data
}
} catch (error) {
      console.error('Error checkingfavorite status:', error)
    }
    return false
  }

  // Agregar a favoritos
  const addToFavorites = async (productoId: string) => {
    if (!user) return

    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favoritos/${productoId}`, {
method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Recargar favoritos
        await loadFavorites()
      }
    } catch (error) {
      console.error('Error adding to favorites:', error)
    }
  }

  // Eliminar de favoritos
  const removeFromFavorites = async (productoId: string) => {
    if (!user) return

    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favoritos/${productoId}`, {
method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Actualizar estado local
        setFavorites(prev => prev.filter(fav => fav.productoId !== productoId))
        setFavoritesCount(prev=> Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
  }

  // Cargar datos cuando el usuario cambia
  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
setFavorites([])
      setFavoritesCount(0)
    }
  }, [user])

  return {
    favorites,
    favoritesCount,
    isLoading,
    loadFavorites,
    loadFavoritesCount,
    checkIsFavorite,
    addToFavorites,
    removeFromFavorites
  }
}
