"use client"

import { useState, useEffect } from "react"
import { Star, Flag, Trash2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { comentarioService, type ComentarioDTO, type ComentariosResponse } from "@/lib/comentarios"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CommentsSectionProps {
  productoId: string
  triggerRefresh?: boolean
}

export function CommentsSection({ productoId, triggerRefresh }: CommentsSectionProps) {
  const [comentarios, setComenarios] = useState<ComentarioDTO[]>([])
  const [calificacionPromedio, setCalificacionPromedio] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const loadComentarios = async () => {
    try {
      setIsLoading(true)
      const data = await comentarioService.obtenerComentariosProducto(productoId)
      setComenarios(data.comentarios.sort((a, b) => {
        const dateA = new Date(a.fechaCreacion || 0).getTime()
        const dateB = new Date(b.fechaCreacion || 0).getTime()
        return dateB - dateA
      }))
      setCalificacionPromedio(data.calificacionPromedio)
    } catch (error) {
      console.error("Error loading comments:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los comentarios",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadComentarios()
  }, [productoId])

  useEffect(() => {
    if (triggerRefresh) {
      loadComentarios()
    }
  }, [triggerRefresh])

  const handleReportSpam = async (comentarioId: string) => {
    try {
      await comentarioService.reportarSpam(comentarioId)
      toast({
        title: "Reportado",
        description: "El comentario ha sido reportado como spam",
      })
      loadComentarios()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reportar el comentario",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (comentarioId: string) => {
    try {
      setIsDeleting(comentarioId)
      await comentarioService.eliminarComentario(comentarioId)
      toast({
        title: "Eliminado",
        description: "El comentario ha sido eliminado",
      })
      loadComentarios()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const canDeleteComment = (comentario: ComentarioDTO) => {
    return user?.id === comentario.usuarioId
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            Calificación de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-primary">{calificacionPromedio.toFixed(1)}</div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(calificacionPromedio)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Basado en {comentarios.length} {comentarios.length === 1 ? "comentario" : "comentarios"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            {comentarios.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = comentarios.filter((c) => c.calificacion === rating).length
                  const percentage = Math.round((count / comentarios.length) * 100)
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle>Comentarios ({comentarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {comentarios.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No hay comentarios aún. ¡Sé el primero en comentar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comentarios.map((comentario) => (
                <div key={comentario.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  {/* Comment Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{comentario.nombreUsuario}</h4>
                        {comentario.flaggedAsSpam && (
                          <Badge variant="destructive" className="text-xs">
                            Reportado
                          </Badge>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < comentario.calificacion
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comentario.fechaCreacion || "").toLocaleDateString("es-MX")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {canDeleteComment(comentario) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isDeleting === comentario.id}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              {isDeleting === comentario.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar comentario</AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Estás seguro de que deseas eliminar tu comentario? Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => comentario.id && handleDeleteComment(comentario.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => comentario.id && handleReportSpam(comentario.id)}
                        className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comment Title */}
                  {comentario.titulo && <h5 className="font-medium mb-2">{comentario.titulo}</h5>}

                  {/* Comment Content */}
                  <p className="text-gray-700 text-sm leading-relaxed">{comentario.contenido}</p>

                  {/* Spam Report Count */}
                  {comentario.reportesSpam && comentario.reportesSpam > 0 && (
                    <p className="text-xs text-orange-600 mt-3">
                      Reportado {comentario.reportesSpam} {comentario.reportesSpam === 1 ? "vez" : "veces"} como spam
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}