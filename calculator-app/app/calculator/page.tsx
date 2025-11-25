'use client'

import { useState, useMemo, useEffect } from 'react'
import { Form } from './components/Form'
import { Results } from './components/Results'
import { Recommendation } from './components/Recommendation'
import { Glossary } from './components/Glossary'
import { ProyectoEvaluation } from './components/ProyectoEvaluation'
import { type CalculatorFormData } from './utils/validation'
import { generatePDF } from './actions'
import { 
  calculateCreditoMax, 
  pesoToUF, 
  calculateRentaAjustada, 
  calculateDividendoMax,
  calculateProyectoRequerimientos 
} from './utils/mortgage'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { UFIndicator } from './components/UFIndicator'

export default function CalculatorPage() {
  const [formData, setFormData] = useState<CalculatorFormData | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [valorUF, setValorUF] = useState<number>(39643) // Valor por defecto

  // Obtener valor UF al cargar
  useEffect(() => {
    const fetchUF = async () => {
      try {
        const response = await fetch('/api/uf')
        if (response.ok) {
          const data = await response.json()
          setValorUF(data.uf)
        }
      } catch (error) {
        console.error('Error obteniendo UF:', error)
      }
    }
    fetchUF()
  }, [])

  const rentaTotal = useMemo(() => {
    if (!formData) return 0
    return formData.renta1 + (formData.complementaRenta ? (formData.renta2 || 0) : 0)
  }, [formData])

  const rentaAjustada = useMemo(() => {
    if (!formData) return rentaTotal
    const tiposIngreso = {
      dependienteFijo: formData.tipoIngresoDependienteFijo,
      dependienteVariable: formData.tipoIngresoDependienteVariable,
      independiente: formData.tipoIngresoIndependiente,
    }
    return calculateRentaAjustada(rentaTotal, tiposIngreso)
  }, [formData, rentaTotal])

  const dividendoMax = useMemo(() => {
    return calculateDividendoMax(rentaAjustada)
  }, [rentaAjustada])

  const creditoMaxUF = useMemo(() => {
    if (!formData) return 0
    const plazoNum = parseInt(formData.plazo)
    const creditoMax = calculateCreditoMax(dividendoMax, formData.tasaInteres, plazoNum)
    return pesoToUF(creditoMax, valorUF)
  }, [formData, dividendoMax, valorUF])

  // Evaluar proyecto si búsqueda inversa está activada
  const proyectoEvaluation = useMemo(() => {
    if (!formData || !formData.enableBusquedaInversa || !formData.valorUFProyecto) {
      return null
    }
    
    const plazoNum = parseInt(formData.plazo)
    return calculateProyectoRequerimientos(
      formData.valorUFProyecto,
      rentaAjustada,
      formData.tasaInteres,
      plazoNum,
      valorUF,
      {
        ltv80: formData.ltv80,
        ltv85: formData.ltv85,
        ltv90: formData.ltv90,
      }
    )
  }, [formData, rentaAjustada, valorUF])

  const handleSubmit = (data: CalculatorFormData) => {
    setFormData(data)
    // Scroll suave a resultados
    setTimeout(() => {
      const resultsElement = document.getElementById('results')
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleGeneratePDF = async () => {
    if (!formData) return

    setIsGeneratingPDF(true)
    try {
      const blob = await generatePDF({ ...formData, valorUF })
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `calculadora-hipotecaria-select-capital-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generando PDF:', error)
      alert('Error al generar el PDF. Por favor, intenta nuevamente.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="flex items-center justify-between">
              <img 
                src="/images/logo_blanco.png" 
                alt="Select Capital" 
                className="h-10 w-auto dark:block hidden"
              />
              <img 
                src="/images/logo_negro.png" 
                alt="Select Capital" 
                className="h-10 w-auto dark:hidden block"
              />
              <div className="flex items-center gap-2">
                <UFIndicator />
                <ThemeToggle />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Calculadora Hipotecaria</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Calcula tu capacidad de crédito
              </p>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <img 
                src="/images/logo_blanco.png" 
                alt="Select Capital" 
                className="h-12 w-auto dark:block hidden"
              />
              <img 
                src="/images/logo_negro.png" 
                alt="Select Capital" 
                className="h-12 w-auto dark:hidden block"
              />
              <div>
                <h1 className="text-2xl font-bold">Calculadora Hipotecaria</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Calcula tu capacidad hipotecaria y encuentra el proyecto ideal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UFIndicator />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8 max-w-7xl pb-24 md:pb-8">
        {/* Mobile: Formulario y resultados apilados */}
        <div className="flex flex-col gap-4 lg:hidden">
          <Form
            onSubmit={handleSubmit}
            onGeneratePDF={handleGeneratePDF}
            hasResults={!!formData}
          />
          
          {formData && (
            <div id="results" className="space-y-4">
              {/* Si es búsqueda inversa, mostrar evaluación del proyecto */}
              {proyectoEvaluation ? (
                <ProyectoEvaluation 
                  requerimientos={proyectoEvaluation} 
                  valorProyectoUF={formData.valorUFProyecto!}
                  valorUF={valorUF}
                />
              ) : (
                <Results 
                  formData={formData} 
                  rentaTotal={rentaTotal} 
                  rentaAjustada={rentaAjustada}
                  dividendoMax={dividendoMax}
                  valorUF={valorUF}
                />
              )}
              <Recommendation
                formData={formData}
                rentaTotal={rentaTotal}
                creditoMaxUF={creditoMaxUF}
              />
              <Glossary />
              <div className="sticky bottom-4 z-40">
                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  size="lg"
                  className="w-full shadow-lg"
                >
                  {isGeneratingPDF ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Dos columnas */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <Form
              onSubmit={handleSubmit}
              onGeneratePDF={handleGeneratePDF}
              hasResults={!!formData}
            />
          </div>

          {/* Resultados */}
          <div id="results" className="space-y-6">
            {formData ? (
              <>
                {/* Si es búsqueda inversa, mostrar evaluación del proyecto */}
                {proyectoEvaluation ? (
                  <ProyectoEvaluation 
                    requerimientos={proyectoEvaluation} 
                    valorProyectoUF={formData.valorUFProyecto!}
                    valorUF={valorUF}
                  />
                ) : (
                  <Results 
                    formData={formData} 
                    rentaTotal={rentaTotal} 
                    rentaAjustada={rentaAjustada}
                    dividendoMax={dividendoMax}
                    valorUF={valorUF}
                  />
                )}
                <Recommendation
                  formData={formData}
                  rentaTotal={rentaTotal}
                  creditoMaxUF={creditoMaxUF}
                />
                <Glossary />
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleGeneratePDF}
                    disabled={isGeneratingPDF}
                    size="lg"
                    className="w-full max-w-md"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="glass rounded-lg p-12 text-center">
                <p className="text-muted-foreground">
                  Completa el formulario y haz clic en &quot;Calcular&quot; para ver tus resultados
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Select Capital - Calculadora Hipotecaria</p>
          <p className="mt-1">contacto@selectcapital.cl</p>
        </div>
      </footer>
    </div>
  )
}
