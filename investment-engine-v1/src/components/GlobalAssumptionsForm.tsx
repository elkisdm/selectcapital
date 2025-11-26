'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ValidatedInput } from './ValidatedInput'
import type { GlobalAssumptions } from '@/src/types/investment'
import { validateGlobalAssumptions } from '@/src/lib/validation'
import { AlertCircle } from 'lucide-react'

interface GlobalAssumptionsFormProps {
  assumptions: GlobalAssumptions
  onChange: (assumptions: GlobalAssumptions) => void
}

export function GlobalAssumptionsForm({
  assumptions,
  onChange,
}: GlobalAssumptionsFormProps) {
  const handleChange = (field: keyof GlobalAssumptions, value: number) => {
    onChange({
      ...assumptions,
      [field]: value,
    })
  }

  const validationErrors = validateGlobalAssumptions(assumptions)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supuestos Globales</CardTitle>
        <CardDescription>
          Configura los parámetros generales para todos los cálculos
        </CardDescription>
        {validationErrors.length > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="text-xs text-destructive">
                <p className="font-medium mb-1">Algunos valores están fuera del rango típico:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {validationErrors.slice(0, 3).map((error) => (
                    <li key={error.field}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            id="ufActual"
            label="UF Actual (CLP)"
            type="number"
            value={assumptions.ufActual}
            onChange={(value) => handleChange('ufActual', value as number)}
            min={30000}
            max={50000}
            fieldName="UF Actual"
            placeholder="39643"
          />

          <ValidatedInput
            id="tasaAnual"
            label="Tasa Anual (%)"
            type="number"
            step="0.001"
            value={assumptions.tasaAnual * 100}
            onChange={(value) =>
              handleChange('tasaAnual', ((value as number) || 0) / 100)
            }
            min={2}
            max={10}
            fieldName="Tasa Anual"
            placeholder="4.5"
          />

          <ValidatedInput
            id="plazoAnios"
            label="Plazo (años)"
            type="number"
            value={assumptions.plazoAnios}
            onChange={(value) => handleChange('plazoAnios', value as number)}
            min={5}
            max={40}
            fieldName="Plazo"
            placeholder="30"
          />

          <ValidatedInput
            id="plusvaliaAnio1"
            label="Plusvalía Año 1 (%)"
            type="number"
            step="0.001"
            value={assumptions.plusvaliaAnio1 * 100}
            onChange={(value) =>
              handleChange('plusvaliaAnio1', ((value as number) || 0) / 100)
            }
            min={0}
            max={20}
            fieldName="Plusvalía Año 1"
            placeholder="5.4"
          />

          <ValidatedInput
            id="plusvaliaDesdeAnio2"
            label="Plusvalía Años 2+ (%)"
            type="number"
            step="0.001"
            value={assumptions.plusvaliaDesdeAnio2 * 100}
            onChange={(value) =>
              handleChange('plusvaliaDesdeAnio2', ((value as number) || 0) / 100)
            }
            min={0}
            max={15}
            fieldName="Plusvalía Años 2+"
            placeholder="5.0"
          />

          <ValidatedInput
            id="porcentajePieTeorico"
            label="% Pie Teórico"
            type="number"
            step="0.01"
            value={assumptions.porcentajePieTeorico * 100}
            onChange={(value) =>
              handleChange('porcentajePieTeorico', ((value as number) || 0) / 100)
            }
            min={5}
            max={30}
            fieldName="% Pie Teórico"
            placeholder="10"
          />

          <ValidatedInput
            id="porcentajeBonoPie"
            label="% Bono Pie"
            type="number"
            step="0.01"
            value={assumptions.porcentajeBonoPie * 100}
            onChange={(value) =>
              handleChange('porcentajeBonoPie', ((value as number) || 0) / 100)
            }
            min={0}
            max={20}
            fieldName="% Bono Pie"
            placeholder="10"
          />

          <ValidatedInput
            id="mesesPieEnCuotas"
            label="Meses Pie en Cuotas"
            type="number"
            value={assumptions.mesesPieEnCuotas}
            onChange={(value) => handleChange('mesesPieEnCuotas', value as number)}
            min={0}
            max={120}
            fieldName="Meses Pie en Cuotas"
            placeholder="48"
          />

          <ValidatedInput
            id="porcentajeGastosBanco"
            label="% Gastos Banco"
            type="number"
            step="0.001"
            value={assumptions.porcentajeGastosBanco * 100}
            onChange={(value) =>
              handleChange('porcentajeGastosBanco', ((value as number) || 0) / 100)
            }
            min={0}
            max={5}
            fieldName="% Gastos Banco"
            placeholder="1.0"
          />

          <ValidatedInput
            id="ivaPorcentaje"
            label="IVA (%)"
            type="number"
            step="0.01"
            value={assumptions.ivaPorcentaje * 100}
            onChange={(value) =>
              handleChange('ivaPorcentaje', ((value as number) || 0) / 100)
            }
            min={0}
            max={25}
            fieldName="IVA"
            placeholder="19"
          />

          <ValidatedInput
            id="ivaFactorRecuperable"
            label="Factor IVA Recuperable (%)"
            type="number"
            step="0.01"
            value={assumptions.ivaFactorRecuperable * 100}
            onChange={(value) =>
              handleChange('ivaFactorRecuperable', ((value as number) || 0) / 100)
            }
            min={0}
            max={100}
            fieldName="Factor IVA Recuperable"
            placeholder="70"
          />

          <ValidatedInput
            id="horizonteAnios"
            label="Horizonte (años)"
            type="number"
            value={assumptions.horizonteAnios}
            onChange={(value) => handleChange('horizonteAnios', value as number)}
            min={1}
            max={20}
            fieldName="Horizonte"
            placeholder="4"
          />
        </div>
      </CardContent>
    </Card>
  )
}

