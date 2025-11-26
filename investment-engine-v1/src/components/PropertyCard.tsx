'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PropertyResult } from '@/src/types/investment'
import { formatCLP, formatPercentage, formatUF } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Home, Percent } from 'lucide-react'

interface PropertyCardProps {
  result: PropertyResult
}

export function PropertyCard({ result }: PropertyCardProps) {
  const { input } = result

  const getDeltaColor = (delta: number) => {
    return delta >= 0 ? 'text-success' : 'text-destructive'
  }

  const getROIColor = (roi: number) => {
    return roi >= 0 ? 'text-success' : 'text-destructive'
  }

  // Debug: Verificar que los deltas existen
  // console.log('Delta con pie:', result.deltaMensualConPieClp)
  // console.log('Delta sin pie:', result.deltaMensualSinPieClp)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          <div>
            <div>{input.nombreProyecto}</div>
            <div className="text-sm font-normal text-muted-foreground">
              {input.comuna} • {input.tipologia} • {input.m2Totales} m²
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Valores principales */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Valor Propiedad</div>
            <div className="text-lg font-semibold">{formatCLP(result.valorClp)}</div>
            <div className="text-xs text-muted-foreground">
              {formatUF(result.input.valorUf)}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Dividendo Mensual</div>
            <div className="text-lg font-semibold">
              {formatCLP(result.dividendoClp)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatUF(result.dividendoUf)}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Inversión Total</div>
            <div className="text-lg font-semibold">
              {formatCLP(result.inversionTotalPropiedadClp)}
            </div>
          </div>
        </div>

        {/* Flujos mensuales - Delta */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Delta Mensual (con pie)</div>
            <div
              className={`text-lg font-semibold flex items-center gap-1 ${getDeltaColor(
                result.deltaMensualConPieClp
              )}`}
            >
              {result.deltaMensualConPieClp >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {formatCLP(result.deltaMensualConPieClp)}
            </div>
            <div className="text-xs text-muted-foreground/70 mt-1">
              Arriendo - Dividendo - Gasto Común
              {result.input.otrosGastosMensualesClp > 0 && ' - Otros Gastos'}
              {' - Cuota Pie'}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">Delta Mensual (sin pie)</div>
            <div
              className={`text-lg font-semibold flex items-center gap-1 ${getDeltaColor(
                result.deltaMensualSinPieClp
              )}`}
            >
              {result.deltaMensualSinPieClp >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {formatCLP(result.deltaMensualSinPieClp)}
            </div>
            <div className="text-xs text-muted-foreground/70 mt-1">
              Arriendo - Dividendo - Gasto Común
              {result.input.otrosGastosMensualesClp > 0 && ' - Otros Gastos'}
            </div>
          </div>
        </div>

        {/* Rentabilidades */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Percent className="h-3 w-3" />
              ROI
            </div>
            <div
              className={`text-lg font-semibold ${getROIColor(
                result.roiSobreInversion
              )}`}
            >
              {formatPercentage(result.roiSobreInversion)}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Rentabilidad Bruta</div>
            <div className="text-lg font-semibold">
              {formatPercentage(result.rentabilidadBruta)}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Rentabilidad Neta</div>
            <div className="text-lg font-semibold">
              {formatPercentage(result.rentabilidadNetaSobreInversionConPie)}
            </div>
          </div>
        </div>

        {/* Plusvalía */}
        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">Plusvalía (horizonte)</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Precio Futuro</div>
              <div className="text-base font-semibold">
                {formatCLP(result.precioClpFuturo)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Ganancia Plusvalía</div>
              <div className="text-base font-semibold text-success">
                {formatCLP(result.plusvaliaHorizonteClp)}
              </div>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        {(result.bonoPieClp > 0 || result.ivaRecuperableClp > 0) && (
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Beneficios</div>
            <div className="grid grid-cols-2 gap-4">
              {result.bonoPieClp > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground">Bono Pie</div>
                  <div className="text-base font-semibold text-success">
                    {formatCLP(result.bonoPieClp)}
                  </div>
                </div>
              )}
              {result.ivaRecuperableClp > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground">IVA Recuperable</div>
                  <div className="text-base font-semibold text-success">
                    {formatCLP(result.ivaRecuperableClp)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resumen de ganancias */}
        <div className="pt-4 border-t bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Ganancia Total</span>
            </div>
            <div
              className={`text-xl font-bold ${getROIColor(result.gananciaTotalClp)}`}
            >
              {formatCLP(result.gananciaTotalClp)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

