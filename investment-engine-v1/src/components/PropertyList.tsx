'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PropertyForm } from './PropertyForm'
import type { PropertyInput } from '@/src/types/investment'
import { Plus, Edit, Trash2, Copy } from 'lucide-react'

interface PropertyListProps {
  properties: PropertyInput[]
  onAdd: (property: PropertyInput) => void
  onUpdate: (property: PropertyInput) => void
  onDelete: (id: string) => void
  onDuplicate?: (property: PropertyInput) => void
}

export function PropertyList({
  properties,
  onAdd,
  onUpdate,
  onDelete,
  onDuplicate,
}: PropertyListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<PropertyInput | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Evitar errores de hidratación
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAdd = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  const handleEdit = (property: PropertyInput) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleSave = (property: PropertyInput) => {
    if (editingProperty) {
      onUpdate(property)
    } else {
      onAdd(property)
    }
    setShowForm(false)
    setEditingProperty(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
      onDelete(id)
    }
  }

  const handleDuplicate = (property: PropertyInput) => {
    if (onDuplicate) {
      const duplicated = {
        ...property,
        id: `prop-${Date.now()}`,
        nombreProyecto: `${property.nombreProyecto} (copia)`,
      }
      onDuplicate(duplicated)
    }
  }

  if (showForm) {
    return (
      <PropertyForm
        property={editingProperty || undefined}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={
          editingProperty
            ? () => {
                handleDelete(editingProperty.id)
                handleCancel()
              }
            : undefined
        }
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Propiedades</CardTitle>
            <CardDescription>
              {!isMounted
                ? 'Añade propiedades para calcular el portafolio'
                : properties.length === 0
                ? 'Añade propiedades para calcular el portafolio'
                : `${properties.length} propiedad(es) en el portafolio`}
            </CardDescription>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir Propiedad
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isMounted || properties.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay propiedades agregadas</p>
            <p className="text-sm mt-2">
              Haz clic en "Añadir Propiedad" para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{property.nombreProyecto}</h4>
                  <p className="text-sm text-muted-foreground">
                    {property.comuna} • {property.tipologia} • {property.m2Totales} m²
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {property.valorUf.toFixed(1)} UF
                  </p>
                </div>
                <div className="flex gap-2">
                  {onDuplicate && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDuplicate(property)}
                      title="Duplicar propiedad"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(property)}
                    title="Editar propiedad"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(property.id)}
                    title="Eliminar propiedad"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

