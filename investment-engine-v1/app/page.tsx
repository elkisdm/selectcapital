'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { GlobalAssumptionsForm } from '@/src/components/GlobalAssumptionsForm'
import { PropertyList } from '@/src/components/PropertyList'
import { PropertyCard } from '@/src/components/PropertyCard'
import { PortfolioSummary } from '@/src/components/PortfolioSummary'
import { PDFReport } from '@/src/components/PDFReport'
import { DataManagement } from '@/src/components/DataManagement'
import { OnboardingTutorial } from '@/src/components/OnboardingTutorial'
import { ToastContainer } from '@/components/ui/toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Settings, Trash2, Menu, X } from 'lucide-react'
import { calcularPortfolioResult } from '@/src/lib/investmentCalculator'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { useOnboarding } from '@/src/hooks/useOnboarding'
import { useToast } from '@/src/hooks/useToast'
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

  // Toast notifications
  const { toasts, closeToast, success, error: showError } = useToast()

  // Estado para el modal de gestión de datos
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false)
  
  // Estado para el menú móvil desplegable
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Referencia para scroll automático a resultados
  const resultsRef = useRef<HTMLDivElement>(null)

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
          setAssumptions((prev) => {
            if (prev.ufActual === defaultAssumptions.ufActual) {
              return {
                ...prev,
                ufActual: data.uf,
              }
            }
            return prev
          })
        }
      } catch (error) {
        console.error('Error obteniendo UF:', error)
      }
    }
    fetchUF()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Calcular resultados del portafolio (solo después de montar para evitar hidratación)
  // Se recalcula automáticamente cuando cambian assumptions o properties
  const portfolioResult = useMemo(() => {
    if (!isMounted || properties.length === 0) {
      return null
    }
    try {
      return calcularPortfolioResult(assumptions, properties)
    } catch (error) {
      console.error('Error calculando portafolio:', error)
      return null
    }
  }, [assumptions, properties, isMounted])

  // Scroll automático a resultados cuando se generan
  useEffect(() => {
    if (portfolioResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [portfolioResult])

  const handleAddProperty = (property: PropertyInput) => {
    setProperties((prev) => [...prev, property])
  }

  const handleUpdateProperty = (property: PropertyInput) => {
    // Actualizar la propiedad y forzar recálculo del portafolio
    setProperties((prev) => {
      const updated = prev.map((p) => (p.id === property.id ? property : p))
      // Retornar nuevo array para garantizar que React detecte el cambio
      return [...updated]
    })
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
      {/* Header - Desktop: Original | Mobile: Desplegable */}
      <header className="sticky top-0 z-50 pt-4 md:pt-5">
        <div className="container mx-auto px-4">
          {/* Desktop: Layout original horizontal */}
          <div className="hidden md:block">
            <div className="glass-heavy backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-3 w-auto max-w-fit mx-auto">
              <div className="flex flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-auto flex-shrink-0">
                    <Image
                      src="/images/logo_largo_principal.png"
                      alt="Select Capital"
                      width={150}
                      height={40}
                      className="object-contain h-full w-auto"
                      priority
                    />
                  </div>
                  <h1 className="text-lg font-medium tracking-tight text-foreground">
                    Calculadora de Rentabilidad
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground/70 font-normal whitespace-nowrap">
                    UF: <span className="font-medium text-foreground">${valorUF.toLocaleString('es-CL')}</span>
                  </div>
                  <button
                    onClick={() => setIsDataManagementOpen(true)}
                    className="text-muted-foreground/70 hover:text-foreground transition-all flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                    title="Gestión de datos"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleClearData}
                    className="text-muted-foreground/70 hover:text-destructive transition-all flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 border border-transparent hover:border-destructive/20"
                    title="Limpiar todos los datos"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {isMounted && (
                    <button
                      onClick={startOnboarding}
                      className="text-sm text-muted-foreground/70 hover:text-foreground transition-all flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                      title="Ver tutorial de uso"
                    >
                      <span className="font-medium">Ayuda</span>
                      <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full border border-current">?</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Layout desplegable */}
          <div className="md:hidden">
            <div className="glass-heavy backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 w-full">
              {/* Barra superior con logo y botón menú */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="relative h-7 w-auto flex-shrink-0">
                    <Image
                      src="/images/logo_largo_principal.png"
                      alt="Select Capital"
                      width={150}
                      height={40}
                      className="object-contain h-full w-auto"
                      priority
                    />
                  </div>
                  <h1 className="text-sm font-medium tracking-tight text-foreground truncate">
                    Calculadora
                  </h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-muted-foreground/70 hover:text-foreground active:scale-95 transition-all flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5 active:bg-white/10 border border-transparent hover:border-white/10 touch-manipulation"
                  aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Menú desplegable */}
              {isMobileMenuOpen && (
                <div className="mt-3 pt-3 border-t border-white/10 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col gap-2">
                    {/* Valor UF */}
                    <div className="text-xs text-muted-foreground/70 font-normal px-2 py-1.5 rounded-md bg-white/5 border border-white/10">
                      <span className="font-medium text-foreground">UF: ${valorUF.toLocaleString('es-CL')}</span>
                    </div>
                    
                    {/* Botones de acción */}
                    <button
                      onClick={() => {
                        setIsDataManagementOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="text-left text-sm text-muted-foreground/70 hover:text-foreground active:scale-[0.98] transition-all flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 active:bg-white/10 border border-transparent hover:border-white/10 touch-manipulation"
                    >
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Gestión de datos</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleClearData()
                        setIsMobileMenuOpen(false)
                      }}
                      className="text-left text-sm text-muted-foreground/70 hover:text-destructive active:scale-[0.98] transition-all flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 active:bg-destructive/10 border border-transparent hover:border-destructive/20 touch-manipulation"
                    >
                      <Trash2 className="h-4 w-4 flex-shrink-0" />
                      <span className="font-medium">Limpiar datos</span>
                    </button>
                    
                    {isMounted && (
                      <button
                        onClick={() => {
                          startOnboarding()
                          setIsMobileMenuOpen(false)
                        }}
                        className="text-left text-sm text-muted-foreground/70 hover:text-foreground active:scale-[0.98] transition-all flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 active:bg-white/10 border border-transparent hover:border-white/10 touch-manipulation"
                      >
                        <span className="text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full border border-current flex-shrink-0">?</span>
                        <span className="font-medium">Ayuda / Tutorial</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
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

          {portfolioResult && (
            <div ref={resultsRef} data-onboarding="results">
              <PortfolioSummary portfolio={portfolioResult} />
              
              <PDFReport 
                portfolio={portfolioResult} 
                assumptions={assumptions}
                onToast={(title, type, description) => {
                  if (type === 'success') {
                    success(title, description)
                  } else if (type === 'error') {
                    showError(title, description)
                  }
                }}
              />

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
                Configura los parámetros base y añade propiedades para ver los resultados
              </p>
            </div>
          )}
        </div>

        {/* Desktop: Dos columnas para formularios, resultados debajo */}
        <div className="hidden lg:block">
          {/* Sección de formularios: Parámetros Base a la izquierda, Propiedades a la derecha */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Columna izquierda: Parámetros Base */}
            <div className="space-y-6">
              <div data-onboarding="global-assumptions">
                <GlobalAssumptionsForm
                  assumptions={assumptions}
                  onChange={setAssumptions}
                />
              </div>
            </div>

            {/* Columna derecha: Propiedades */}
            <div className="space-y-6">
              <div data-onboarding="properties">
                <PropertyList
                  properties={properties}
                  onAdd={handleAddProperty}
                  onUpdate={handleUpdateProperty}
                  onDelete={handleDeleteProperty}
                  onDuplicate={handleDuplicateProperty}
                />
              </div>
            </div>
          </div>

          {/* Resultados debajo de ambos */}
          {portfolioResult ? (
            <div ref={resultsRef} data-onboarding="results" className="space-y-6">
              <PortfolioSummary portfolio={portfolioResult} />
              
              <PDFReport 
                portfolio={portfolioResult} 
                assumptions={assumptions}
                onToast={(title, type, description) => {
                  if (type === 'success') {
                    success(title, description)
                  } else if (type === 'error') {
                    showError(title, description)
                  }
                }}
              />

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
                Configura los parámetros base y añade propiedades para ver los resultados
              </p>
            </div>
          )}
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

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* Modal de Gestión de Datos */}
      <Dialog open={isDataManagementOpen} onOpenChange={setIsDataManagementOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Datos</DialogTitle>
          </DialogHeader>
          <DataManagement
            assumptions={assumptions}
            properties={properties}
            onImport={handleImportData}
            onClear={handleClearData}
            onToast={(title, type, description) => {
              if (type === 'success') {
                success(title, description)
                setIsDataManagementOpen(false)
              } else if (type === 'error') {
                showError(title, description)
              }
            }}
          />
        </DialogContent>
      </Dialog>

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

