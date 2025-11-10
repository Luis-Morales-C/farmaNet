import { useState, useEffect } from 'react'

interface Notification {
  id: string
  titulo: string
  mensaje: string
  tipo: string
  leida: boolean
  fechaCreacion: string
}

interface ApiResponse<T> {
  success: boolean
  mensaje: string
  data?: T
  error?: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Fetch every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/notificaciones', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const result: ApiResponse<Notification[]> = await response.json()
      
      if (result.success && result.data) {
        setNotifications(result.data)
        setUnreadCount(result.data.filter(n => !n.leida).length)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return

      const response = await fetch(`/api/notificaciones/${id}/marcar-leida`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      const result: ApiResponse<null> = await response.json()
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? {...n, leida: true} : n)
        )
        setUnreadCount(prev => prev - 1)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return

      const response = await fetch('/api/notificaciones/marcar-todas-leidas', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }

      const result: ApiResponse<null> = await response.json()
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => ({...n, leida: true}))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  }
}