"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'

interface Notification {
  id: string
  titulo: string
  mensaje: string
  tipo: string
  leida: boolean
  fechaCreacion: string
}

export function useNotifications() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Funcin para obtener el token
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token')
    }
    return null
  }

  // Cargar conteo de notificaciones no ledas
  const loadUnreadCount = async () => {
    if (!user) return

    try {
      const token = getToken()
      if (!token) return

      const response = await api.fetch(api.notifications.unreadCount, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const count = await response.json()
        setUnreadCount(count)
      }
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  // Cargar todas las notificaciones
  const loadNotifications = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const response = await api.fetch(api.notifications.list, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Marcar como led
  const markAsRead = async (notificationId: string) => {
    try {
      const token = getToken()
      if (!token) return

      const response = await api.fetch(api.notifications.markRead(notificationId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, leida: true } : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Marcar todas como leds
  const markAllAsRead = async () => {
    try {
      const token = getToken()
      if (!token) return

      const response = await api.fetch(api.notifications.markAllRead, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, leida: true }))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Eliminar notificacin
  const deleteNotification = async (notificationId: string) => {
    try {
      const token = getToken()
      if (!token) return

      const response = await api.fetch(api.notifications.delete(notificationId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
        // Recargar conteo si la notificación eliminada no estaba leída
        const deletedNotif = notifications.find(n => n.id === notificationId)
        if (deletedNotif && !deletedNotif.leida) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Cargar datos cuando el usuario cambia
  useEffect(() => {
    if (user) {
      loadUnreadCount()
    } else {
      setUnreadCount(0)
      setNotifications([])
    }
  }, [user])

  return {
    unreadCount,
    notifications,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshUnreadCount: loadUnreadCount
  }
}
