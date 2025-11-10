"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, MessageCircle } from "lucide-react"

interface Message {
  id: string
  autor: string
  contenido: string
  timestamp: string
  esUsuario: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      autor: "Usuario",
      contenido: input,
      timestamp: new Date().toISOString(),
      esUsuario: true,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate API call to backend ChatController
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        autor: "Farmacéutico",
        contenido: "Gracias por tu mensaje. Te ayudaré con tu consulta sobre medicamentos o productos.",
        timestamp: new Date().toISOString(),
        esUsuario: false,
      }
      setMessages((prev) => [...prev, botMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <MessageCircle className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Chat con Farmacéutico</h1>
        </div>

        <div className="bg-card border border-border rounded-lg h-96 overflow-y-auto mb-4 p-4 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="w-12 h-12 text-primary/30 mb-4" />
              <p className="text-muted">Inicia una conversación con nuestro farmacéutico</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-4 flex ${msg.esUsuario ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.esUsuario
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border border-border text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-semibold">{msg.autor}</p>
                    <p className="text-sm">{msg.contenido}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-lg px-4 py-2 text-muted">
                    <p className="text-sm">Escribiendo...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" disabled={loading} size="lg" className="gap-2">
            <Send className="w-4 h-4" />
            Enviar
          </Button>
        </form>
      </div>
    </div>
  )
}
