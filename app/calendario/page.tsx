"use client"

import { useState } from "react"
import { Calendar, Clock, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Cita {
  id: string
  titulo: string
  fecha: string
  hora: string
  farmaceuta: string
  tipo: "consulta" | "seguimiento" | "entrega"
}

const DEMO_CITAS: Cita[] = [
  {
    id: "1",
    titulo: "Consulta: Tratamiento de Alergias",
    fecha: "2025-11-15",
    hora: "10:00",
    farmaceuta: "Dra. María García",
    tipo: "consulta",
  },
  {
    id: "2",
    titulo: "Seguimiento: Presión Arterial",
    fecha: "2025-11-18",
    hora: "14:30",
    farmaceuta: "Dr. Carlos López",
    tipo: "seguimiento",
  },
]

export default function CalendarPage() {
  const [citas, setCitas] = useState<Cita[]>(DEMO_CITAS)
  const [showForm, setShowForm] = useState(false)

  const handleCancelCita = (id: string) => {
    setCitas((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Mis Citas</h1>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>Agendar Cita</Button>
        </div>

        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Consulta</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Consulta General</option>
                  <option>Seguimiento</option>
                  <option>Entrega de Producto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Fecha</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hora</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nota</label>
                <input
                  type="text"
                  placeholder="Describe tu consulta"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button className="flex-1">Agendar</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {citas.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-muted text-lg">No tienes citas agendadas</p>
              <Button className="mt-4">Agendar Primera Cita</Button>
            </div>
          ) : (
            citas.map((cita) => (
              <div key={cita.id} className="border border-border rounded-lg p-6 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{cita.titulo}</h3>
                    <div className="space-y-2 text-sm text-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(cita.fecha).toLocaleDateString("es-ES")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{cita.hora}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{cita.farmaceuta}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelCita(cita.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
