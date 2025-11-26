'use client'

import { useState, useMemo, useEffect } from 'react'
import { GlobalAssumptionsForm } from '@/src/components/GlobalAssumptionsForm'
import { PropertyList } from '@/src/components/PropertyList'
import { PropertyCard } from '@/src/components/PropertyCard'
import { PortfolioSummary } from '@/src/components/PortfolioSummary'
import { PDFReport } from '@/src/components/PDFReport'
import { DataManagement } from '@/src/components/DataManagement'
import { OnboardingTutorial } from '@/src/components/OnboardingTutorial'
import { calcularPortfolioResult } from '@/src/lib/investmentCalculator'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { useOnboarding } from '@/src/hooks/useOnboarding'
import type {
  GlobalAssumptions,
  PropertyInput,
} from '@/src/types/investment'

const defaultAssumptions: GlobalAssumptions = {
  ufActual: 39643,
  tasaAnual: 0.045, // 4.5%
  plazoAnios: 30,
  plusvaliaAnio1: 0.054, // 5.4%
  plusvaliaDesdeAnio2: 0.05, // 5%
  porcentajePieTeorico: 0.10, // 10%
  porcentajeBonoPie: 0.10, // 10%
  mesesPieEnCuotas: 48,
  porcentajeGastosBanco: 0.01, // 1%
  ivaPorcentaje: 0.19, // 19%
  ivaFactorRecuperable: 0.70, // 70%
  horizonteAnios: 4,
}

export default function CalculatorPage() {
  // Estado para evitar errores de hidratación
  const [isMounted, setIsMounted] = useState(false)

  // Persistencia en localStorage
  const [assumptions, setAssumptions] = useLocalStorage<GlobalAssumptions>(
    'investment-assumptions',
    defaultAssumptions
  )
  const [properties, setProperties] = useLocalStorage<PropertyInput[]>(
    'investment-properties',
    []
  )
  const [valorUF, setValorUF] = useState<number>(39643)

  // Onboarding
  const {
    isActive,
    currentStep,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    nextStep,
    previousStep,
  } = useOnboarding()

  // Marcar como montado después de la hidratación
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Obtener valor UF al cargar (solo si no hay valor guardado)
  useEffect(() => {
    const fetchUF = async () => {
      try {
        const response = await fetch('/api/uf')
        if (response.ok) {
          const data = await response.json()
          setValorUF(data.uf)
          // Solo actualizar si el valor guardado es el default
          if (assumptions.ufActual === defaultAssumptions.ufActual) {
            setAssumptions((prev) => ({
              ...prev,
              ufActual: data.uf,
            }))
          }
        }
      } catch (error) {
        console.error('Error obteniendo UF:', error)
      }
    }
    fetchUF()
  }, [])

  // Calcular resultados del portafolio (solo después de montar para evitar hidratación)
  const portfolioResult = useMemo(() => {
    if (!isMounted || properties.length === 0) {
      return null
    }
    return calcularPortfolioResult(assumptions, properties)
  }, [assumptions, properties, isMounted])

  const handleAddProperty = (property: PropertyInput) => {
    setProperties((prev) => [...prev, property])
  }

  const handleUpdateProperty = (property: PropertyInput) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === property.id ? property : p))
    )
  }

  const handleDeleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id))
  }

  const handleDuplicateProperty = (property: PropertyInput) => {
    setProperties((prev) => [...prev, property])
  }

  const handleImportData = (data: {
    assumptions: GlobalAssumptions
    properties: PropertyInput[]
  }) => {
    setAssumptions(data.assumptions)
    setProperties(data.properties)
  }

  const handleClearData = () => {
    setAssumptions(defaultAssumptions)
    setProperties([])
    // Limpiar localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('investment-assumptions')
      window.localStorage.removeItem('investment-properties')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5">
        <div className="glass-heavy backdrop-blur-xl bg-white/5">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-light tracking-tight">
                  Motor de Inversión Inmobiliaria
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground/80 mt-0.5 font-light">
                  Calcula la rentabilidad de tu portafolio
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs md:text-sm text-muted-foreground/70 font-light">
                  UF: <span className="font-medium">${valorUF.toLocaleString('es-CL')}</span>
                </div>
                {isMounted && (
                  <button
                    onClick={startOnboarding}
                    className="text-xs md:text-sm text-muted-foreground/70 hover:text-primary transition-colors flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5"
                    title="Ver tutorial de uso"
                  >
                    <span className="hidden md:inline">Ayuda</span>
                    <span className="text-base font-semibold w-5 h-5 flex items-center justify-center rounded-full border border-current">?</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Mobile: Formularios y resultados apilados */}
        <div className="flex flex-col gap-6 lg:hidden">
          <div data-onboarding="global-assumptions">
            <GlobalAssumptionsForm
              assumptions={assumptions}
              onChange={setAssumptions}
            />
          </div>

          <div data-onboarding="properties">
            <PropertyList
              properties={properties}
              onAdd={handleAddProperty}
              onUpdate={handleUpdateProperty}
              onDelete={handleDeleteProperty}
              onDuplicate={handleDuplicateProperty}
            />
          </div>

          <div data-onboarding="data-management">
            <DataManagement
              assumptions={assumptions}
              properties={properties}
              onImport={handleImportData}
              onClear={handleClearData}
            />
          </div>

          {portfolioResult && (
            <div data-onboarding="results">
              <PortfolioSummary portfolio={portfolioResult} />
              
              <PDFReport portfolio={portfolioResult} assumptions={assumptions} />

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Propiedades</h2>
                {portfolioResult.properties.map((result) => (
                  <PropertyCard key={result.input.id} result={result} />
                ))}
              </div>
            </div>
          )}

          {properties.length === 0 && (
            <div className="glass rounded-lg p-12 text-center">
              <p className="text-muted-foreground">
                Configura los supuestos globales y añade propiedades para ver los
                resultados
              </p>
            </div>
          )}
        </div>

        {/* Desktop: Dos columnas */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Columna izquierda: Formularios */}
          <div className="lg:sticky lg:top-24 lg:h-fit space-y-6">
            <div data-onboarding="global-assumptions">
              <GlobalAssumptionsForm
                assumptions={assumptions}
                onChange={setAssumptions}
              />
            </div>

            <div data-onboarding="properties">
              <PropertyList
                properties={properties}
                onAdd={handleAddProperty}
                onUpdate={handleUpdateProperty}
                onDelete={handleDeleteProperty}
                onDuplicate={handleDuplicateProperty}
              />
            </div>

            <div data-onboarding="data-management">
              <DataManagement
                assumptions={assumptions}
                properties={properties}
                onImport={handleImportData}
                onClear={handleClearData}
              />
            </div>
          </div>

          {/* Columna derecha: Resultados */}
          <div className="space-y-6">
            {portfolioResult ? (
              <div data-onboarding="results">
                <PortfolioSummary portfolio={portfolioResult} />
                
                <PDFReport portfolio={portfolioResult} assumptions={assumptions} />

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Propiedades</h2>
                  {portfolioResult.properties.map((result) => (
                    <PropertyCard key={result.input.id} result={result} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-lg p-12 text-center">
                <p className="text-muted-foreground">
                  Configura los supuestos globales y añade propiedades para ver los
                  resultados
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Onboarding Tutorial */}
      <OnboardingTutorial
        isActive={isActive}
        currentStep={currentStep}
        onNext={nextStep}
        onPrevious={previousStep}
        onComplete={completeOnboarding}
        onSkip={skipOnboarding}
        totalSteps={6}
      />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Select Capital - Motor de Inversión Inmobiliaria</p>
          <p className="mt-1">contacto@selectcapital.cl</p>
        </div>
      </footer>
    </div>
  )
}

