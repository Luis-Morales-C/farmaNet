"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { api } from '../lib/api'

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

  // Cargar favoritos del usuario
  const loadFavorites = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await api.fetch(api.favorites.getAll, {
        headers: {
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
      const response = await api.fetch(api.favorites.getAll + '/conteo')

      if (response.ok) {
        const count = await response.json()
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
      const response = await api.fetch(api.favorites.check(productoId))

      if (response.ok) {
        const result = await response.json()
        return !!result?.data
      }
    } catch (error) {
      console.error('Error checking favorite status:', error)
    }
    return false
  }

  // Agregar a favoritos
  const addToFavorites = async (productoId: string) => {
    if (!user) return

    try {
      const response = await api.fetch(api.favorites.add(productoId), {
        method: 'POST',
        headers: {
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
      const response = await api.fetch(api.favorites.remove(productoId), {
        method: 'DELETE',
        headers: {
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
