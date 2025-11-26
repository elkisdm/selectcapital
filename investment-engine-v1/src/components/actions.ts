'use server'

import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { PDFDocument } from '@/src/components/PDFDocument'
import type { PortfolioResult, GlobalAssumptions } from '@/src/types/investment'

/**
 * Genera un PDF con el reporte del portafolio
 */
export async function generatePDF(
  portfolio: PortfolioResult,
  assumptions: GlobalAssumptions
): Promise<Blob> {
  try {
    const fecha = new Date().toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    // Renderizar PDF
    const pdfDoc = React.createElement(PDFDocument, {
      portfolio,
      assumptions,
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

