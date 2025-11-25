'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCLP, formatUF } from '@/lib/utils'
import {
  calculateCreditoMax,
  calculateValorPropiedad,
  calculateDividendoEstimado,
  calculatePie,
  pesoToUF,
  evaluateProject,
  calculateRentaAjustada,
} from '../utils/mortgage'
import { type CalculatorFormData } from '../utils/validation'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface ResultsProps {
  formData: CalculatorFormData
  rentaTotal: number
  rentaAjustada: number
}

export function Results({ formData, rentaTotal, rentaAjustada }: ResultsProps) {
  const { tasaInteres, plazo, valorUF, ltv80, ltv85, ltv90, valorUFProyecto } = formData

  const plazoNum = parseInt(plazo)
  
  // Calcular dividendos máximos (sobre renta ajustada)
  const dividendo25 = (rentaAjustada * 25) / 100
  const dividendo30 = (rentaAjustada * 30) / 100
  const dividendo35 = (rentaAjustada * 35) / 100

  // Calcular crédito máximo usando el dividendo del 25% (estándar)
  const creditoMax = calculateCreditoMax(dividendo25, tasaInteres, plazoNum)
  const creditoMaxUF = pesoToUF(creditoMax, valorUF)

  // Escenarios de financiamiento
  const scenarios = []

  if (ltv80) {
    const valorPropiedadUF = calculateValorPropiedad(creditoMaxUF, 80)
    const valorPropiedadCLP = valorPropiedadUF * valorUF
    const pieUF = calculatePie(valorPropiedadUF, 80)
    const pieCLP = pieUF * valorUF
    const creditoEscenario = valorPropiedadCLP * 0.8
    const dividendoEstimado = calculateDividendoEstimado(creditoEscenario, tasaInteres, plazoNum)

    scenarios.push({
      ltv: 80,
      valorPropiedadUF,
      valorPropiedadCLP,
      pieUF,
      pieCLP,
      dividendoEstimado,
    })
  }

  if (ltv85) {
    const valorPropiedadUF = calculateValorPropiedad(creditoMaxUF, 85)
    const valorPropiedadCLP = valorPropiedadUF * valorUF
    const pieUF = calculatePie(valorPropiedadUF, 85)
    const pieCLP = pieUF * valorUF
    const creditoEscenario = valorPropiedadCLP * 0.85
    const dividendoEstimado = calculateDividendoEstimado(creditoEscenario, tasaInteres, plazoNum)

    scenarios.push({
      ltv: 85,
      valorPropiedadUF,
      valorPropiedadCLP,
      pieUF,
      pieCLP,
      dividendoEstimado,
    })
  }

  if (ltv90) {
    const valorPropiedadUF = calculateValorPropiedad(creditoMaxUF, 90)
    const valorPropiedadCLP = valorPropiedadUF * valorUF
    const pieUF = calculatePie(valorPropiedadUF, 90)
    const pieCLP = pieUF * valorUF
    const creditoEscenario = valorPropiedadCLP * 0.9
    const dividendoEstimado = calculateDividendoEstimado(creditoEscenario, tasaInteres, plazoNum)

    scenarios.push({
      ltv: 90,
      valorPropiedadUF,
      valorPropiedadCLP,
      pieUF,
      pieCLP,
      dividendoEstimado,
    })
  }

  // Evaluación del proyecto si se ingresó
  let projectEvaluation = null
  if (formData.enableBusquedaInversa && valorUFProyecto && valorUFProyecto > 0) {
    // Evaluar con el mejor escenario (mayor LTV seleccionado)
    const bestLTV = Math.max(
      ...scenarios.map((s) => s.ltv)
    )
    projectEvaluation = evaluateProject(valorUFProyecto, creditoMaxUF, bestLTV)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'viable':
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case 'marginal':
        return <AlertCircle className="h-5 w-5 text-warning-500" />
      case 'no_viable':
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      viable: 'bg-success/20 text-success border-success/30',
      marginal: 'bg-warning-500/20 text-warning-500 border-warning-500/30',
      no_viable: 'bg-destructive/20 text-destructive border-destructive/30',
    }
    const labels = {
      viable: 'Viable',
      marginal: 'Marginal',
      no_viable: 'No Viable',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dividendo Máximo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Dividendo Máximo</CardTitle>
            <CardDescription>Según porcentaje de endeudamiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 glass rounded-lg border-primary/30">
                <p className="text-xs text-muted-foreground mb-2">25% (Estándar)</p>
                <p className="text-xl font-semibold text-primary">{formatCLP(dividendo25)}</p>
              </div>
              <div className="text-center p-4 glass rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">30%</p>
                <p className="text-xl font-semibold">{formatCLP(dividendo30)}</p>
              </div>
              <div className="text-center p-4 glass rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">35%</p>
                <p className="text-xl font-semibold">{formatCLP(dividendo35)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Crédito Máximo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Crédito Máximo</CardTitle>
            <CardDescription>Basado en dividendo del 25%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">En Pesos</p>
                <p className="text-2xl font-semibold">{formatCLP(creditoMax)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En UF</p>
                <p className="text-xl font-semibold text-primary">{formatUF(creditoMaxUF)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Escenarios de Financiamiento */}
      {scenarios.map((scenario, index) => (
        <motion.div
          key={scenario.ltv}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financiamiento {scenario.ltv}%</CardTitle>
                  <CardDescription>Escenario de financiamiento</CardDescription>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{scenario.ltv}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valor Propiedad</p>
                  <p className="text-lg font-semibold">{formatCLP(scenario.valorPropiedadCLP)}</p>
                  <p className="text-sm text-muted-foreground">{formatUF(scenario.valorPropiedadUF)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pie Requerido</p>
                  <p className="text-lg font-semibold">{formatCLP(scenario.pieCLP)}</p>
                  <p className="text-sm text-muted-foreground">{formatUF(scenario.pieUF)}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Dividendo Estimado</p>
                <p className="text-xl font-semibold text-success">{formatCLP(scenario.dividendoEstimado)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatUF(pesoToUF(scenario.dividendoEstimado, valorUF))}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Evaluación del Proyecto */}
      {projectEvaluation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Evaluación del Proyecto</CardTitle>
                  <CardDescription>Valor del proyecto: {formatUF(valorUFProyecto!)}</CardDescription>
                </div>
                {getStatusIcon(projectEvaluation.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusBadge(projectEvaluation.status)}
              </div>
              <p className="text-sm leading-relaxed">{projectEvaluation.message}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

