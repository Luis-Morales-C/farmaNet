"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface AddCommentFormProps {
  onSubmit: (data: { rating: number; title: string; content: string }) => void
  onCancel: () => void
}

export function AddCommentForm({ onSubmit, onCancel }: AddCommentFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0 || !title.trim() || !content.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ rating, title: title.trim(), content: content.trim() })
      setRating(0)
      setTitle("")
      setContent("")
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1
      return (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(starValue)}
        >
          <Star
            className={`h-6 w-6 ${
              starValue <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      )
    })
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Muy malo"
      case 2: return "Malo"
      case 3: return "Regular"
      case 4: return "Bueno"
      case 5: return "Excelente"
      default: return ""
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escribir Reseña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <Label className="text-base font-medium">Calificación</Label>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex gap-1">
                {renderStars()}
              </div>
              {(rating > 0 || hoverRating > 0) && (
                <span className="text-sm text-muted-foreground">
                  {getRatingText(hoverRating || rating)}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Título de la reseña</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resumir tu experiencia en pocas palabras"
              maxLength={100}
              required
            />
            <div className="text-xs text-muted-foreground mt-1">
              {title.length}/100 caracteres
            </div>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Tu reseña</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comparte detalles sobre tu experiencia con este producto..."
              rows={4}
              maxLength={1000}
              required
            />
            <div className="text-xs text-muted-foreground mt-1">
              {content.length}/1000 caracteres
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting || rating === 0}>
              {isSubmitting ? "Publicando..." : "Publicar Reseña"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}