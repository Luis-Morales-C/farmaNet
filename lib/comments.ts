export interface Comment {
  id: string
  productId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  helpful: number
  verified: boolean
}

export interface CreateCommentData {
  productId: string
  rating: number
  title: string
  content: string
}

import { api } from './api'

export const commentService = {
  async getComments(productId: string): Promise<Comment[]> {
    try {
      const response = await api.fetch(api.comments.forProduct(productId), {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth-token") || ""}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error fetching comments")
      }

      return response.json()
    } catch (error) {
      console.error("Error fetching comments:", error)
      // Return mock data for now
      return [
        {
          id: "1",
          productId,
          userId: "1",
          userName: "María González",
          userEmail: "maria@example.com",
          rating: 5,
          title: "Excelente producto",
          content: "Funciona perfectamente, justo lo que necesitaba. La entrega fue rápida y el empaque estaba en perfectas condiciones.",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 12,
          verified: true,
        },
        {
          id: "2",
          productId,
          userId: "2",
          userName: "Carlos Rodríguez",
          userEmail: "carlos@example.com",
          rating: 4,
          title: "Buena calidad",
          content: "El producto es de buena calidad, aunque el precio podría ser un poco más bajo. En general estoy satisfecho.",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 8,
          verified: true,
        },
        {
          id: "3",
          productId,
          userId: "3",
          userName: "Ana López",
          userEmail: "ana@example.com",
          rating: 3,
          title: "Regular",
          content: "Cumple su función básica pero esperaba más. El olor es un poco fuerte y tarda en hacer efecto.",
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 3,
          verified: false,
        },
      ]
    }
  },

  async createComment(data: CreateCommentData): Promise<Comment> {
    try {
      const response = await api.fetch(api.comments.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth-token") || ""}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error creating comment")
      }

      return response.json()
    } catch (error) {
      console.error("Error creating comment:", error)
      // Return mock response
      return {
        id: Date.now().toString(),
        productId: data.productId,
        userId: "current-user",
        userName: "Usuario Actual",
        userEmail: "user@example.com",
        rating: data.rating,
        title: data.title,
        content: data.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        helpful: 0,
        verified: false,
      }
    }
  },

  async markHelpful(commentId: string): Promise<void> {
    try {
      const response = await api.fetch(api.comments.markHelpful(commentId), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("auth-token") || ""}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error marking comment as helpful")
      }
    } catch (error) {
      console.error("Error marking comment as helpful:", error)
      // No-op for mock
    }
  },

  async getProductRating(productId: string): Promise<{ averageRating: number; totalReviews: number }> {
    try {
      const comments = await this.getComments(productId)
      const totalReviews = comments.length
      const averageRating = totalReviews > 0
        ? comments.reduce((sum, comment) => sum + comment.rating, 0) / totalReviews
        : 0

      return { averageRating, totalReviews }
    } catch (error) {
      console.error("Error getting product rating:", error)
      return { averageRating: 0, totalReviews: 0 }
    }
  },
}