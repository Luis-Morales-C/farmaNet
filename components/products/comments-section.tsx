"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth"
import { type Comment, commentService } from "@/lib/comments"
import { AddCommentForm } from "./add-comment-form"

interface CommentsSectionProps {
  productId: string
  onCommentAdded?: () => void
}

export function CommentsSection({ productId, onCommentAdded }: CommentsSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadComments()
  }, [productId])

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(productId)
      setComments(data)
    } catch (error) {
      console.error("Error loading comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddComment = async (commentData: { rating: number; title: string; content: string }) => {
    if (!user) return

    try {
      const newComment = await commentService.createComment({
        productId,
        ...commentData,
      })
      setComments(prev => [newComment, ...prev])
      setShowAddForm(false)
      onCommentAdded?.()
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleMarkHelpful = async (commentId: string) => {
    try {
      await commentService.markHelpful(commentId)
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, helpful: comment.helpful + 1 }
          : comment
      ))
    } catch (error) {
      console.error("Error marking comment as helpful:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "hace 1 día"
    if (diffDays < 7) return `hace ${diffDays} días`
    if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semanas`
    return `hace ${Math.ceil(diffDays / 30)} meses`
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando comentarios...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Comment Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reseñas de Clientes</h3>
          <p className="text-sm text-muted-foreground">
            {comments.length} {comments.length === 1 ? "reseña" : "reseñas"}
          </p>
        </div>
        {user && !showAddForm && (
          <Button onClick={() => setShowAddForm(true)}>
            Escribir Reseña
          </Button>
        )}
      </div>

      {/* Add Comment Form */}
      {showAddForm && (
        <AddCommentForm
          onSubmit={handleAddComment}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">Aún no hay reseñas</h4>
          <p className="text-muted-foreground mb-4">
            Sé el primero en compartir tu opinión sobre este producto.
          </p>
          {user && (
            <Button onClick={() => setShowAddForm(true)}>
              Escribir la Primera Reseña
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStars(comment.rating)}
                        </div>
                        {comment.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Compra Verificada
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{comment.title}</h4>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{comment.userName}</div>
                      <div>{formatDate(comment.createdAt)}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground">{comment.content}</p>

                  <Separator />

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkHelpful(comment.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Útil ({comment.helpful})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}