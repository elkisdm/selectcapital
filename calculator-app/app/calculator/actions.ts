'use server'

import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { PDFDocument } from './components/PDFDocument'
import { type CalculatorFormData } from './utils/validation'
import {
  calculateCreditoMax,
  calculateValorPropiedad,
  calculateDividendoEstimado,
  calculatePie,
  pesoToUF,
  evaluateProject,
  calculateRentaAjustada,
} from './utils/mortgage'
import { formatCLP, formatUF } from '@/lib/utils'

/**
 * Genera un PDF con los resultados de la calculadora
 */
export async function generatePDF(formData: CalculatorFormData): Promise<Blob> {
  try {
    const rentaTotal =
      formData.renta1 + (formData.complementaRenta ? (formData.renta2 || 0) : 0)

    // Calcular renta ajustada según tipo de ingreso
    const rentaAjustada = formData.tipoIngreso
      ? calculateRentaAjustada(rentaTotal, formData.tipoIngreso)
      : rentaTotal

    const plazoNum = parseInt(formData.plazo)
    const dividendo25 = (rentaAjustada * 25) / 100
    const creditoMax = calculateCreditoMax(
      dividendo25,
      formData.tasaInteres,
      plazoNum
    )
    const creditoMaxUF = pesoToUF(creditoMax, formData.valorUF)

    // Calcular escenarios
    const scenarios = []
    const ltvSeleccionados = []

    if (formData.ltv80) {
      ltvSeleccionados.push(80)
      const valorPropiedadUF = calculateValorPropiedad(creditoMaxUF, 80)
      const valorPropiedadCLP = valorPropiedadUF * formData.valorUF
      const pieUF = calculatePie(valorPropiedadUF, 80)
      const pieCLP = pieUF * formData.valorUF
      const creditoEscenario = valorPropiedadCLP * 0.8
      const dividendoEstimado = calculateDividendoEstimado(
        creditoEscenario,
        formData.tasaInteres,
        plazoNum
      )

      scenarios.push({
        ltv: 80,
        valorPropiedadUF,
        valorPropiedadCLP,
        pieUF,
        pieCLP,
        dividendoEstimado,
      })
    }

    if (formData.ltv85) {
      ltvSeleccionados.push(85)
      const valorPropiedadUF = calculateValorPropiedad(creditoMaxUF, 85)
      const valorPropiedadCLP = valorPropiedadUF * formData.valorUF
      const pieUF = calculatePie(valorPropiedadUF, 85)
      const pieCLP = pieUF * formData.valorUF
      const creditoEscenario = valorPropiedadCLP * 0.85
      const dividendoEstimado = calculateDividendoEstimado(
        creditoEscenario,
        formData.tasaInteres,
        plazoNum
      )

      scenarios.push({
        ltv: 85,
        valorPropiedadUF,
        valorPropiedadCLP,
        pieUF,
        pieCLP,
        dividendoEstimado,
      })
    }

    if (formData.ltv90) {
      ltvSeleccionados.push(90)
      const valorPropiedadUF = calculateValorPropiedad(creditoMaxUF, 90)
      const valorPropiedadCLP = valorPropiedadUF * formData.valorUF
      const pieUF = calculatePie(valorPropiedadUF, 90)
      const pieCLP = pieUF * formData.valorUF
      const creditoEscenario = valorPropiedadCLP * 0.9
      const dividendoEstimado = calculateDividendoEstimado(
        creditoEscenario,
        formData.tasaInteres,
        plazoNum
      )

      scenarios.push({
        ltv: 90,
        valorPropiedadUF,
        valorPropiedadCLP,
        pieUF,
        pieCLP,
        dividendoEstimado,
      })
    }

    // Evaluación del proyecto
    let projectEvaluation = null
    if (formData.valorUFProyecto && formData.valorUFProyecto > 0 && ltvSeleccionados.length > 0) {
      const mejorLTV = Math.max(...ltvSeleccionados)
      projectEvaluation = evaluateProject(
        formData.valorUFProyecto,
        creditoMaxUF,
        mejorLTV
      )
    }

    // Generar recomendaciones (simplificado para PDF)
    const recommendations: string[] = []
    if (creditoMaxUF >= 2900 && creditoMaxUF <= 3200) {
      recommendations.push(
        'Rango ideal para entrega inmediata en Santiago Centro, Macul y La Florida.'
      )
    }
    if (formData.enableBusquedaInversa && formData.valorUFProyecto && formData.valorUFProyecto > 0 && ltvSeleccionados.length > 0) {
      const mejorLTV = Math.max(...ltvSeleccionados)
      const evaluation = evaluateProject(formData.valorUFProyecto, creditoMaxUF, mejorLTV)
      recommendations.push(evaluation.message)
    }
    if (formData.deudaMensualTotal > 0 && rentaTotal > 0) {
      const porcentajeDeuda = (formData.deudaMensualTotal / rentaTotal) * 100
      if (porcentajeDeuda > 30) {
        recommendations.push(
          'Considera reducir tus deudas para aumentar tu capacidad de crédito.'
        )
      }
    }

    const fecha = new Date().toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Renderizar PDF
    const pdfDoc = React.createElement(PDFDocument, {
      formData,
      rentaTotal,
      rentaAjustada,
      creditoMax,
      creditoMaxUF,
      scenarios,
      projectEvaluation,
      recommendations,
      fecha,
    })
    
    const pdfBuffer = await renderToBuffer(pdfDoc as any)
    
    // Convertir Buffer a Uint8Array para Blob
    const uint8Array = new Uint8Array(pdfBuffer)
    return new Blob([uint8Array], { type: 'application/pdf' })
  } catch (error) {
    console.error('Error generando PDF:', error)
    throw new Error('Error al generar el PDF. Por favor, intenta nuevamente.')
  }
}

