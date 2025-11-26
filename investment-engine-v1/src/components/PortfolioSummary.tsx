'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { PortfolioResult } from '@/src/types/investment'
import { formatCLP, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Percent, Home } from 'lucide-react'

interface PortfolioSummaryProps {
  portfolio: PortfolioResult
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const getDeltaColor = (delta: number) => {
    return delta >= 0 ? 'text-success' : 'text-destructive'
  }

  const getROIColor = (roi: number) => {
    return roi >= 0 ? 'text-success' : 'text-destructive'
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Resumen del Portafolio
        </CardTitle>
        <CardDescription>
          {portfolio.properties.length} propiedad(es) en total
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="text-sm text-muted-foreground mb-1">Inversión Total</div>
            <div className="text-2xl font-bold">{formatCLP(portfolio.inversionTotalClp)}</div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="text-sm text-muted-foreground mb-1">Ganancia Total</div>
            <div
              className={`text-2xl font-bold ${getROIColor(portfolio.gananciaTotalClp)}`}
            >
              {formatCLP(portfolio.gananciaTotalClp)}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Percent className="h-3 w-3" />
              ROI Total
            </div>
            <div
              className={`text-2xl font-bold ${getROIColor(portfolio.roiTotal)}`}
            >
              {formatPercentage(portfolio.roiTotal)}
            </div>
          </div>
        </div>

        {/* Flujos mensuales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="p-4 rounded-lg border">
            <div className="text-sm text-muted-foreground mb-2">
              Delta Mensual (con pie)
            </div>
            <div
              className={`text-xl font-semibold flex items-center gap-2 ${getDeltaColor(
                portfolio.deltaMensualConPieTotalClp
              )}`}
            >
              {portfolio.deltaMensualConPieTotalClp >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {formatCLP(portfolio.deltaMensualConPieTotalClp)}
            </div>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="text-sm text-muted-foreground mb-2">
              Delta Mensual (sin pie)
            </div>
            <div
              className={`text-xl font-semibold flex items-center gap-2 ${getDeltaColor(
                portfolio.deltaMensualSinPieTotalClp
              )}`}
            >
              {portfolio.deltaMensualSinPieTotalClp >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {formatCLP(portfolio.deltaMensualSinPieTotalClp)}
            </div>
          </div>
        </div>

        {/* Desglose de ganancias */}
        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-3">Desglose de Ganancias</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Plusvalía</div>
              <div className="text-base font-semibold text-success">
                {formatCLP(portfolio.plusvaliaHorizonteTotalClp)}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Bono Pie</div>
              <div className="text-base font-semibold text-success">
                {formatCLP(portfolio.bonoPieTotalClp)}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">IVA Recuperable</div>
              <div className="text-base font-semibold text-success">
                {formatCLP(portfolio.ivaTotalRecuperableClp)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

