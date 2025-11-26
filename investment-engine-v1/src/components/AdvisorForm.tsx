'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface AdvisorFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { nombre: string; telefono: string }) => void
  defaultNombre?: string
  defaultTelefono?: string
}

export function AdvisorForm({
  open,
  onClose,
  onSubmit,
  defaultNombre = '',
  defaultTelefono = '',
}: AdvisorFormProps) {
  const [nombre, setNombre] = useState(defaultNombre)
  const [telefono, setTelefono] = useState(defaultTelefono)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nombre.trim() && telefono.trim()) {
      onSubmit({ nombre: nombre.trim(), telefono: telefono.trim() })
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Datos del Asesor</DialogTitle>
          <DialogDescription>
            Ingresa tu nombre y teléfono para incluir en el reporte PDF
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre-asesor">Nombre del Asesor</Label>
              <Input
                id="nombre-asesor"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono-asesor">Teléfono / WhatsApp</Label>
              <Input
                id="telefono-asesor"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: +56 9 1234 5678"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!nombre.trim() || !telefono.trim()}>
              Generar PDF
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

