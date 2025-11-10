"use client"

import { useState } from "react"
import { Star, Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { comentarioService, type ComentarioDTO } from "@/lib/comentarios"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface CommentFormProps {
  productoId: string
  onCommentAdded: () => void
}

export function CommentForm({ productoId, onCommentAdded }: CommentFormProps) {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [calificacion, setCalificacion] = useState<number>(0)
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (calificacion < 1 || calificacion > 5) {
      newErrors.calificacion = "Debes seleccionar una calificación entre 1 y 5"
    }

    if (contenido.length < 10) {
      newErrors.contenido = "El comentario debe tener al menos 10 caracteres"
    }

    if (contenido.length > 1000) {
      newErrors.contenido = "El comentario no puede exceder 1000 caracteres"
    }

    if (titulo && titulo.length > 100) {
      newErrors.titulo = "El título no puede exceder 100 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para comentar",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const comentario: ComentarioDTO = {
        productoId,
        usuarioId: user.id,
        nombreUsuario: `${user.nombre} ${user.apellido}`,
        calificacion,
        titulo: titulo || undefined,
        contenido,
      }

      await comentarioService.crearComentario(comentario)

      toast({
        title: "Éxito",
        description: "Tu comentario ha sido creado exitosamente",
      })

      // Reset form
      setCalificacion(0)
      setTitulo("")
      setContenido("")
      setErrors({})

      // Refresh comments
      onCommentAdded()
    } catch (error) {
      console.error("Error creating comment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el comentario",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return null
  }

  if (!user) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                Debes{" "}
                <Link href="/login" className="font-semibold underline hover:text-blue-700">
                  iniciar sesión
                </Link>{" "}
                para comentar este producto.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dejar un comentario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tu calificación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setCalificacion(star)
                    setErrors({ ...errors, calificacion: "" })
                  }}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= calificacion
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.calificacion && <p className="text-xs text-red-500 mt-1">{errors.calificacion}</p>}
          </div>

          {/* Title (optional) */}
          <div>
            <label htmlFor="titulo" className="text-sm font-medium mb-2 block">
              Título (opcional)
            </label>
            <Input
              id="titulo"
              placeholder="Un título breve para tu comentario"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value)
                setErrors({ ...errors, titulo: "" })
              }}
              maxLength={100}
              disabled={isSubmitting}
              className={errors.titulo ? "border-red-500" : ""}
            />
            <p className="text-xs text-muted-foreground mt-1">{titulo.length}/100</p>
            {errors.titulo && <p className="text-xs text-red-500 mt-1">{errors.titulo}</p>}
          </div>

          {/* Comment Content */}
          <div>
            <label htmlFor="contenido" className="text-sm font-medium mb-2 block">
              Tu comentario
            </label>
            <Textarea
              id="contenido"
              placeholder="Comparte tu experiencia con este producto. Mínimo 10 caracteres."
              value={contenido}
              onChange={(e) => {
                setContenido(e.target.value)
                setErrors({ ...errors, contenido: "" })
              }}
              maxLength={1000}
              minLength={10}
              rows={5}
              disabled={isSubmitting}
              className={errors.contenido ? "border-red-500" : ""}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">{contenido.length}/1000</p>
              {errors.contenido && <p className="text-xs text-red-500">{errors.contenido}</p>}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Publicando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Publicar Comentario
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}