'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { PortfolioResult, GlobalAssumptions } from '@/src/types/investment'

interface PDFReportProps {
  portfolio: PortfolioResult
  assumptions: GlobalAssumptions
}

export function PDFReport({ portfolio, assumptions }: PDFReportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio, assumptions }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
      }

      const blob = await response.blob()

      if (!blob || blob.size === 0) {
        throw new Error('El PDF generado está vacío')
      }

      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-portafolio-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()

      // Limpiar después de un breve delay
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('Error generando PDF:', error)
      const message = error instanceof Error ? error.message : 'Error desconocido'
      alert(`Error al generar el PDF: ${message}. Por favor, intenta nuevamente.`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      size="lg"
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Descargar Reporte PDF
        </>
      )}
    </Button>
  )
}

