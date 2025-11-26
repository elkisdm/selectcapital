'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { AdvisorForm } from './AdvisorForm'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import type { PortfolioResult, GlobalAssumptions } from '@/src/types/investment'

interface AdvisorData {
  nombre: string
  telefono: string
}

interface PDFReportProps {
  portfolio: PortfolioResult
  assumptions: GlobalAssumptions
  onToast?: (title: string, type: 'success' | 'error' | 'info' | 'warning', description?: string) => void
}

export function PDFReport({ portfolio, assumptions, onToast }: PDFReportProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAdvisorForm, setShowAdvisorForm] = useState(false)
  const [advisorData, setAdvisorData] = useLocalStorage<AdvisorData>(
    'advisor-data',
    { nombre: '', telefono: '' }
  )

  const handleGeneratePDF = async (advisor: AdvisorData) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ portfolio, assumptions, advisor }),
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

      onToast?.('PDF generado', 'success', 'El reporte se ha descargado correctamente.')
    } catch (error) {
      console.error('Error generando PDF:', error)
      const message = error instanceof Error ? error.message : 'Error desconocido'
      onToast?.('Error al generar PDF', 'error', `${message}. Por favor, intenta nuevamente.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleButtonClick = () => {
    // Si ya hay datos guardados, usar esos directamente
    if (advisorData.nombre && advisorData.telefono) {
      handleGeneratePDF(advisorData)
    } else {
      // Mostrar formulario para ingresar datos
      setShowAdvisorForm(true)
    }
  }

  const handleAdvisorSubmit = (data: AdvisorData) => {
    setAdvisorData(data)
    handleGeneratePDF(data)
  }

  return (
    <>
      <Button
        onClick={handleButtonClick}
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
      <AdvisorForm
        open={showAdvisorForm}
        onClose={() => setShowAdvisorForm(false)}
        onSubmit={handleAdvisorSubmit}
        defaultNombre={advisorData.nombre}
        defaultTelefono={advisorData.telefono}
      />
    </>
  )
}

