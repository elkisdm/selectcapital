import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { PDFDocument } from '@/src/components/PDFDocument'
import type { PortfolioResult, GlobalAssumptions } from '@/src/types/investment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { portfolio, assumptions } = body as {
      portfolio: PortfolioResult
      assumptions: GlobalAssumptions
    }

    if (!portfolio || !assumptions) {
      return NextResponse.json(
        { error: 'Portfolio y assumptions son requeridos' },
        { status: 400 }
      )
    }

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

    // Convertir Buffer a Uint8Array
    const uint8Array = new Uint8Array(pdfBuffer)

    // Retornar como respuesta con headers apropiados
    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-portafolio-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generando PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar el PDF', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

