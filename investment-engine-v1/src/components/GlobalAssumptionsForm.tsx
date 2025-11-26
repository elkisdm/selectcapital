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
        <CardTitle>Parámetros Base</CardTitle>
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
            value={assumptions.tasaAnual}
            onChange={(value) => handleChange('tasaAnual', value as number)}
            min={0.02}
            max={0.10}
            fieldName="Tasa Anual"
            placeholder="4.5"
            isPercentage={true}
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
            value={assumptions.plusvaliaAnio1}
            onChange={(value) => handleChange('plusvaliaAnio1', value as number)}
            min={0}
            max={0.20}
            fieldName="Plusvalía Año 1"
            placeholder="5.4"
            isPercentage={true}
          />

          <ValidatedInput
            id="plusvaliaDesdeAnio2"
            label="Plusvalía Años 2+ (%)"
            type="number"
            value={assumptions.plusvaliaDesdeAnio2}
            onChange={(value) => handleChange('plusvaliaDesdeAnio2', value as number)}
            min={0}
            max={0.15}
            fieldName="Plusvalía Años 2+"
            placeholder="5.0"
            isPercentage={true}
          />

          <ValidatedInput
            id="porcentajePieTeorico"
            label="% Pie Teórico"
            type="number"
            value={assumptions.porcentajePieTeorico}
            onChange={(value) => handleChange('porcentajePieTeorico', value as number)}
            min={0.05}
            max={0.30}
            fieldName="% Pie Teórico"
            placeholder="10"
            isPercentage={true}
          />

          <ValidatedInput
            id="porcentajeBonoPie"
            label="% Bono Pie"
            type="number"
            value={assumptions.porcentajeBonoPie}
            onChange={(value) => handleChange('porcentajeBonoPie', value as number)}
            min={0}
            max={0.20}
            fieldName="% Bono Pie"
            placeholder="10"
            isPercentage={true}
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
            value={assumptions.porcentajeGastosBanco}
            onChange={(value) => handleChange('porcentajeGastosBanco', value as number)}
            min={0}
            max={0.05}
            fieldName="% Gastos Banco"
            placeholder="1.0"
            isPercentage={true}
          />

          <ValidatedInput
            id="ivaPorcentaje"
            label="IVA (%)"
            type="number"
            value={assumptions.ivaPorcentaje}
            onChange={(value) => handleChange('ivaPorcentaje', value as number)}
            min={0}
            max={0.25}
            fieldName="IVA"
            placeholder="19"
            isPercentage={true}
          />

          <ValidatedInput
            id="ivaFactorRecuperable"
            label="Factor IVA Recuperable (%)"
            type="number"
            value={assumptions.ivaFactorRecuperable}
            onChange={(value) => handleChange('ivaFactorRecuperable', value as number)}
            min={0}
            max={1.0}
            fieldName="Factor IVA Recuperable"
            placeholder="70"
            isPercentage={true}
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

