import { useState, useEffect } from 'react'

interface ApiResponse<T> {
  success: boolean
  mensaje: string
  data?: T
  error?: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [favoritesCount, setFavoritesCount] = useState(0)

  useEffect(() => {
    fetchFavorites()
    const interval = setInterval(fetchFavorites, 30000) // Fetch every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/favoritos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch favorites')
      }

      const result: ApiResponse<any[]> = await response.json()
      
      if (result.success && result.data) {
        // Asumimos que el endpoint devuelve un array de favoritos con id de producto
        const productIds = result.data.map((fav: any) => fav.productoId || fav.id)
        setFavorites(productIds)
      }
      
      // También obtener el conteo de favoritos
      await fetchFavoritesCount()
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavoritesCount = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return

      const response = await fetch('/api/favoritos/conteo', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch favorites count')
      }

      const result: ApiResponse<{ count: number }> = await response.json()
      
      if (result.success && result.data) {
        setFavoritesCount(result.data.count)
      }
    } catch (error) {
      console.error('Error fetching favorites count:', error)
    }
  }

  const addToFavorites = async (productId: string) => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return false

      const response = await fetch(`/api/favoritos/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to add to favorites')
      }

      const result: ApiResponse<null> = await response.json()
      
      if (result.success) {
        setFavorites(prev => [...prev, productId])
        setFavoritesCount(prev => prev + 1)
        return true
      }
      return false
    } catch (error) {
      console.error('Error adding to favorites:', error)
      return false
    }
  }

  const removeFromFavorites = async (productId: string) => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return false

      const response = await fetch(`/api/favoritos/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to remove from favorites')
      }

      const result: ApiResponse<null> = await response.json()
      
      if (result.success) {
        setFavorites(prev => prev.filter(id => id !== productId))
        setFavoritesCount(prev => prev - 1)
        return true
      }
      return false
    } catch (error) {
      console.error('Error removing from favorites:', error)
      return false
    }
  }

  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }

  return {
    favorites,
    favoritesCount,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  }
}