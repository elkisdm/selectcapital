'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type CalculatorFormData } from '../utils/validation'
import { formatUF, formatCLP } from '@/lib/utils'
import { calculateValorPropiedad, pesoToUF, calculateCreditoMax, calculateRentaAjustada } from '../utils/mortgage'
import { Lightbulb, TrendingUp, Shield, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

interface RecommendationProps {
  formData: CalculatorFormData
  rentaTotal: number
  creditoMaxUF: number
}

export function Recommendation({ formData, rentaTotal, creditoMaxUF }: RecommendationProps) {
  const { tasaInteres, plazo, ltv80, ltv85, ltv90, valorUFProyecto, deudaMensualTotal, tipoIngreso } = formData
  const plazoNum = parseInt(plazo)
  
  // Calcular renta ajustada según tipo de ingreso
  const rentaAjustada = tipoIngreso 
    ? calculateRentaAjustada(rentaTotal, tipoIngreso)
    : rentaTotal
  
  const dividendo25 = (rentaAjustada * 25) / 100
  const creditoMax = calculateCreditoMax(dividendo25, tasaInteres, plazoNum)

  const recommendations: string[] = []

  // Rangos de UF
  if (creditoMaxUF >= 2900 && creditoMaxUF <= 3200) {
    recommendations.push(
      'Rango ideal para entrega inmediata en Santiago Centro, Macul y La Florida.'
    )
  } else if (creditoMaxUF >= 2500 && creditoMaxUF < 2900) {
    recommendations.push(
      'Excelente capacidad para proyectos en desarrollo.'
    )
  } else if (creditoMaxUF < 2500) {
    recommendations.push(
      'Considera aumentar tu pie para acceder a más opciones.'
    )
  } else if (creditoMaxUF > 3200) {
    recommendations.push(
      'Tienes una capacidad muy alta. Puedes considerar proyectos premium o aumentar tu pie para reducir el dividendo.'
    )
  }

  // Deuda alta
  if (deudaMensualTotal > 0 && rentaTotal > 0) {
    const porcentajeDeuda = (deudaMensualTotal / rentaTotal) * 100
    if (porcentajeDeuda > 30) {
      const reduccionSugerida = deudaMensualTotal * 0.3 // Reducir 30% de la deuda
      const rentaNetaMejorada = rentaTotal - (deudaMensualTotal - reduccionSugerida)
      const rentaAjustadaMejorada = tipoIngreso 
        ? calculateRentaAjustada(rentaNetaMejorada, tipoIngreso)
        : rentaNetaMejorada
      const dividendoMejorado = (rentaAjustadaMejorada * 25) / 100
      const creditoMejorado = calculateCreditoMax(dividendoMejorado, tasaInteres, plazoNum)
      const creditoMejoradoUF = pesoToUF(creditoMejorado, formData.valorUF)
      const mejoraUF = creditoMejoradoUF - creditoMaxUF

      if (mejoraUF > 50) {
        recommendations.push(
          `Reduciendo tu deuda mensual en ${formatCLP(reduccionSugerida)} podrías aumentar tu capacidad en aproximadamente ${formatUF(mejoraUF)}.`
        )
      }
    }
  }

  // LTV óptimo
  const ltvSeleccionados = []
  if (ltv80) ltvSeleccionados.push(80)
  if (ltv85) ltvSeleccionados.push(85)
  if (ltv90) ltvSeleccionados.push(90)

  if (ltvSeleccionados.length > 0) {
    const mejorLTV = Math.max(...ltvSeleccionados)
    const peorLTV = Math.min(...ltvSeleccionados)

    if (mejorLTV === 85 && ltvSeleccionados.length > 1) {
      recommendations.push(
        '85% balancea pie y dividendo de mejor manera, ofreciendo un equilibrio óptimo entre capacidad y seguridad financiera.'
      )
    } else if (mejorLTV === 80 && ltvSeleccionados.length > 1) {
      recommendations.push(
        '80% ofrece mayor seguridad financiera con un pie más alto, reduciendo el riesgo y el dividendo mensual.'
      )
    } else if (mejorLTV === 90 && ltvSeleccionados.length > 1) {
      recommendations.push(
        '90% maximiza tu capacidad de compra, pero considera que requerirás un pie menor y un dividendo más alto.'
      )
    }
  }

  // Evaluación del proyecto
  if (formData.enableBusquedaInversa && valorUFProyecto && valorUFProyecto > 0) {
    const mejorLTV = Math.max(...ltvSeleccionados)
    const valorPropiedadUF = calculateValorPropiedad(creditoMaxUF, mejorLTV)
    const diferencia = valorUFProyecto - valorPropiedadUF

    if (diferencia <= 0) {
      recommendations.push(
        'Este proyecto está dentro de tu capacidad. Es una excelente opción para ti.'
      )
    } else if (diferencia <= valorPropiedadUF * 0.1) {
      recommendations.push(
        'Este proyecto está cerca de tu capacidad. Considera negociar condiciones, aumentar tu pie, o buscar financiamiento complementario.'
      )
    } else {
      recommendations.push(
        'Este proyecto excede significativamente tu capacidad actual. Te recomendamos buscar opciones más accesibles o trabajar en aumentar tu capacidad (reducir deudas, aumentar ingresos, ahorrar más pie).'
      )
    }
  }

  // Recomendación general sobre plazo
  if (plazoNum === 30) {
    recommendations.push(
      'Un plazo de 30 años maximiza tu capacidad, pero considera que pagarás más intereses en el largo plazo.'
    )
  } else if (plazoNum === 20) {
    recommendations.push(
      'Un plazo de 20 años reduce el costo total del crédito, pero aumenta el dividendo mensual.'
    )
  }

  // Si no hay recomendaciones, agregar una genérica
  if (recommendations.length === 0) {
    recommendations.push(
      'Tu perfil financiero es sólido. Continúa evaluando diferentes proyectos y opciones de financiamiento.'
    )
  }

  const getIcon = (index: number) => {
    if (index === 0) return <Lightbulb className="h-5 w-5 text-primary" />
    if (index === 1) return <TrendingUp className="h-5 w-5 text-success" />
    if (index === 2) return <Shield className="h-5 w-5 text-primary" />
    return <AlertTriangle className="h-5 w-5 text-warning-500" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>Recomendaciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                className="flex gap-3"
              >
                <div className="mt-0.5 flex-shrink-0">
                  {getIcon(index)}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground flex-1">
                  {rec}
                </p>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

