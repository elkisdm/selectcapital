import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCLP, formatUF } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface ProyectoEvaluationProps {
  requerimientos: Array<{
    ltv: number
    creditoUF: number
    creditoPesos: number
    pieUF: number
    piePesos: number
    piePorcentaje: number
    dividendoEstimado: number
    dividendoMaximo: number
    capacidadSuficiente: boolean
    diferenciaCapacidad: number
    message: string
  }>
  valorProyectoUF: number
  valorUF: number
}

export function ProyectoEvaluation({ requerimientos, valorProyectoUF, valorUF }: ProyectoEvaluationProps) {
  return (
    <div className="space-y-6">
      <Card className="glass shadow-elegant border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Evaluación del Proyecto
          </CardTitle>
          <CardDescription>
            Proyecto: {formatUF(valorProyectoUF)} ({formatCLP(valorProyectoUF * valorUF)})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requerimientos.map((req, index) => (
              <Card 
                key={index}
                className={`transition-all ${
                  req.capacidadSuficiente 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-red-500/50 bg-red-500/5'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {req.capacidadSuficiente ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      LTV {req.ltv}% - Pie {req.piePorcentaje}%
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {req.message}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Crédito</p>
                      <p className="font-semibold">{formatUF(req.creditoUF)}</p>
                      <p className="text-xs text-muted-foreground">{formatCLP(req.creditoPesos)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Pie Requerido</p>
                      <p className="font-semibold">{formatUF(req.pieUF)}</p>
                      <p className="text-xs text-muted-foreground">{formatCLP(req.piePesos)}</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground text-xs">Dividendo Estimado</p>
                        <p className="font-semibold">{formatCLP(req.dividendoEstimado)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Tu Capacidad (25%)</p>
                        <p className="font-semibold text-primary">{formatCLP(req.dividendoMaximo)}</p>
                      </div>
                    </div>
                  </div>
                  {req.capacidadSuficiente && req.diferenciaCapacidad > 0 && (
                    <div className="mt-3 p-2 glass rounded border border-green-500/30">
                      <p className="text-xs text-green-600 dark:text-green-400">
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        Margen disponible: {formatCLP(req.diferenciaCapacidad)}/mes
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass shadow-elegant">
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {requerimientos.some(r => r.capacidadSuficiente) ? (
              <span className="text-green-600 dark:text-green-400 font-semibold">
                ✓ Puedes acceder a este proyecto
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400 font-semibold">
                ✗ Este proyecto supera tu capacidad actual
              </span>
            )}
          </p>
          {requerimientos.some(r => r.capacidadSuficiente) && (
            <p className="text-muted-foreground text-xs">
              Tienes opciones viables para financiar este proyecto. Considera el LTV que mejor se ajuste a tu capacidad de ahorro para el pie.
            </p>
          )}
          {!requerimientos.some(r => r.capacidadSuficiente) && (
            <p className="text-muted-foreground text-xs">
              Para acceder a este proyecto, considera aumentar tus ingresos, reducir deudas, o buscar un proyecto de menor valor.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}




