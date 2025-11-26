'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ValidatedInput } from './ValidatedInput'
import type { PropertyInput } from '@/src/types/investment'
import { comunasChile, tipologias } from '@/src/data/comunas'
import { validateProperty } from '@/src/lib/validation'
import { X, AlertCircle } from 'lucide-react'

interface PropertyFormProps {
  property?: PropertyInput
  onSave: (property: PropertyInput) => void
  onCancel: () => void
  onDelete?: () => void
}

const defaultProperty: PropertyInput = {
  id: '',
  nombreProyecto: '',
  comuna: '',
  tipologia: '',
  m2Totales: 0,
  valorUf: 0,
  porcentajeFinanciamiento: 0.8,
  arriendoEstimadoClp: 0,
  gastoComunClp: 0,
  otrosGastosMensualesClp: 0,
  reservaClp: 0,
  abonosInicialesClp: 0,
  costosMobiliarioClp: 0,
  costosGestionClp: 0,
  aplicaBonoPie: false,
  aplicaIvaInversion: false,
  mesesGraciaDelta: 0,
}

export function PropertyForm({
  property,
  onSave,
  onCancel,
  onDelete,
}: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyInput>(
    property || { ...defaultProperty, id: `prop-${Date.now()}` }
  )

  const handleChange = (field: keyof PropertyInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validationErrors = validateProperty(formData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validationErrors.length === 0) {
      onSave(formData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {property ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </CardTitle>
            <CardDescription>
              {property
                ? 'Modifica los datos de la propiedad'
                : 'Completa la información de la propiedad'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {validationErrors.length > 0 && (
          <div className="mt-3 mx-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-xs text-destructive">
                <p className="font-medium mb-1">Revisa los siguientes campos:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {validationErrors.slice(0, 5).map((error) => (
                    <li key={error.field}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreProyecto">Nombre del Proyecto</Label>
                <Input
                  id="nombreProyecto"
                  value={formData.nombreProyecto}
                  onChange={(e) => handleChange('nombreProyecto', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comuna">Comuna</Label>
                <Select
                  value={formData.comuna}
                  onValueChange={(value) => handleChange('comuna', value)}
                  required
                >
                  <SelectTrigger id="comuna">
                    <SelectValue placeholder="Selecciona una comuna" />
                  </SelectTrigger>
                  <SelectContent>
                    {comunasChile.map((comuna) => (
                      <SelectItem key={comuna} value={comuna}>
                        {comuna}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipologia">Tipología</Label>
                <Select
                  value={formData.tipologia}
                  onValueChange={(value) => handleChange('tipologia', value)}
                  required
                >
                  <SelectTrigger id="tipologia">
                    <SelectValue placeholder="Selecciona una tipología" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipologias.map((tipologia) => (
                      <SelectItem key={tipologia} value={tipologia}>
                        {tipologia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ValidatedInput
                id="m2Totales"
                label="m² Totales"
                type="number"
                value={formData.m2Totales || ''}
                onChange={(value) => handleChange('m2Totales', value as number)}
                min={20}
                max={500}
                fieldName="m² Totales"
                placeholder="60"
                required
              />
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Valores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                id="valorUf"
                label="Valor en UF"
                type="number"
                step="0.01"
                value={formData.valorUf || ''}
                onChange={(value) => handleChange('valorUf', value as number)}
                min={500}
                max={10000}
                fieldName="Valor en UF"
                placeholder="2000"
                required
              />

              <ValidatedInput
                id="porcentajeFinanciamiento"
                label="% Financiamiento"
                type="number"
                value={formData.porcentajeFinanciamiento}
                onChange={(value) => handleChange('porcentajeFinanciamiento', value as number)}
                min={0.5}
                max={1.0}
                fieldName="% Financiamiento"
                placeholder="80"
                required
                isPercentage={true}
              />
            </div>
          </div>

          {/* Arriendos y gastos mensuales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Arriendos y Gastos Mensuales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ValidatedInput
                id="arriendoEstimadoClp"
                label="Arriendo Estimado (CLP)"
                type="number"
                value={formData.arriendoEstimadoClp || ''}
                onChange={(value) =>
                  handleChange('arriendoEstimadoClp', value as number)
                }
                min={100000}
                max={5000000}
                fieldName="Arriendo Estimado"
                placeholder="500000"
                required
              />

              <ValidatedInput
                id="gastoComunClp"
                label="Gasto Común (CLP)"
                type="number"
                value={formData.gastoComunClp || ''}
                onChange={(value) => handleChange('gastoComunClp', value as number)}
                min={0}
                max={500000}
                fieldName="Gasto Común"
                placeholder="100000"
                required
              />

              <ValidatedInput
                id="otrosGastosMensualesClp"
                label="Otros Gastos Mensuales (CLP)"
                type="number"
                value={formData.otrosGastosMensualesClp || ''}
                onChange={(value) =>
                  handleChange('otrosGastosMensualesClp', value as number)
                }
                min={0}
                max={1000000}
                fieldName="Otros Gastos Mensuales"
                placeholder="50000"
                allowZero={true}
              />
            </div>
          </div>

          {/* Costos iniciales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Costos Iniciales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                id="reservaClp"
                label="Reserva (CLP)"
                type="number"
                value={formData.reservaClp || ''}
                onChange={(value) => handleChange('reservaClp', value as number)}
                min={0}
                fieldName="Reserva"
                placeholder="1000000"
                required
              />

              <ValidatedInput
                id="abonosInicialesClp"
                label="Abonos Iniciales (CLP)"
                type="number"
                value={formData.abonosInicialesClp || ''}
                onChange={(value) =>
                  handleChange('abonosInicialesClp', value as number)
                }
                min={0}
                fieldName="Abonos Iniciales"
                placeholder="2000000"
                allowZero={true}
              />

              <ValidatedInput
                id="costosMobiliarioClp"
                label="Costos Mobiliario (CLP)"
                type="number"
                value={formData.costosMobiliarioClp || ''}
                onChange={(value) =>
                  handleChange('costosMobiliarioClp', value as number)
                }
                min={0}
                fieldName="Costos Mobiliario"
                placeholder="0"
                allowZero={true}
              />

              <ValidatedInput
                id="costosGestionClp"
                label="Costos Gestión (CLP)"
                type="number"
                value={formData.costosGestionClp || ''}
                onChange={(value) => handleChange('costosGestionClp', value as number)}
                min={0}
                fieldName="Costos Gestión"
                placeholder="300000"
                allowZero={true}
              />
            </div>
          </div>

          {/* Opciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Opciones</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aplicaBonoPie"
                  checked={formData.aplicaBonoPie}
                  onCheckedChange={(checked) =>
                    handleChange('aplicaBonoPie', checked === true)
                  }
                />
                <Label htmlFor="aplicaBonoPie" className="cursor-pointer">
                  Aplica Bono Pie
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aplicaIvaInversion"
                  checked={formData.aplicaIvaInversion}
                  onCheckedChange={(checked) =>
                    handleChange('aplicaIvaInversion', checked === true)
                  }
                />
                <Label htmlFor="aplicaIvaInversion" className="cursor-pointer">
                  Aplica IVA Inversión
                </Label>
              </div>

              <ValidatedInput
                id="mesesGraciaDelta"
                label="Meses Gracia Delta (escenario)"
                type="number"
                value={formData.mesesGraciaDelta || ''}
                onChange={(value) =>
                  handleChange('mesesGraciaDelta', value as number)
                }
                min={0}
                max={60}
                fieldName="Meses Gracia Delta"
                placeholder="0"
                allowZero={true}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            {property && onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Eliminar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={validationErrors.length > 0}>
              Guardar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

