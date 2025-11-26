'use client'

import { useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, X } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  content: React.ReactNode
  targetSelector?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTutorialProps {
  isActive: boolean
  currentStep: number
  onNext: () => void
  onPrevious: () => void
  onComplete: () => void
  onSkip: () => void
  totalSteps: number
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido al Motor de Inversión Inmobiliaria!',
    description: 'Aprende a usar esta herramienta en pocos pasos',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Esta herramienta te permite calcular la rentabilidad de tu portafolio inmobiliario
          de manera precisa y profesional.
        </p>
        <div className="space-y-2">
          <h4 className="font-medium">En este tutorial aprenderás:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Configurar los supuestos globales</li>
            <li>Agregar y gestionar propiedades</li>
            <li>Interpretar los resultados</li>
            <li>Exportar tus análisis</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: 'global-assumptions',
    title: 'Supuestos Globales',
    description: 'Configura los parámetros generales para todos tus cálculos',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Los supuestos globales se aplican a todas las propiedades de tu portafolio.
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <strong>UF Actual:</strong> Valor actual de la Unidad de Fomento (se actualiza automáticamente)
          </div>
          <div>
            <strong>Tasa Anual:</strong> Tasa de interés del crédito hipotecario (típicamente 4-6%)
          </div>
          <div>
            <strong>Plazo:</strong> Años de duración del crédito (típicamente 20-30 años)
          </div>
          <div>
            <strong>Plusvalía:</strong> Aumento esperado del valor de la propiedad
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          💡 Tip: Los valores fuera del rango típico mostrarán una advertencia
        </p>
      </div>
    ),
    targetSelector: '[data-onboarding="global-assumptions"]',
    position: 'right',
  },
  {
    id: 'properties',
    title: 'Agregar Propiedades',
    description: 'Añade las propiedades que quieres analizar',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Cada propiedad representa una inversión inmobiliaria que quieres evaluar.
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Información básica:</strong> Nombre, comuna, tipología y m²
          </div>
          <div>
            <strong>Valores:</strong> Precio en UF y porcentaje de financiamiento
          </div>
          <div>
            <strong>Arriendos y gastos:</strong> Ingresos y costos mensuales estimados
          </div>
          <div>
            <strong>Costos iniciales:</strong> Reserva, abonos, mobiliario, etc.
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          💡 Tip: Puedes duplicar propiedades para crear variaciones rápidamente
        </p>
      </div>
    ),
    targetSelector: '[data-onboarding="properties"]',
    position: 'right',
  },
  {
    id: 'results',
    title: 'Interpretar Resultados',
    description: 'Entiende las métricas de rentabilidad',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Una vez agregues propiedades, verás los resultados calculados automáticamente.
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <strong>ROI Total:</strong> Retorno sobre la inversión total del portafolio
          </div>
          <div>
            <strong>Flujo de Caja:</strong> Dinero disponible mes a mes
          </div>
          <div>
            <strong>Valor Final:</strong> Valor estimado de la propiedad al final del horizonte
          </div>
          <div>
            <strong>ROI por Propiedad:</strong> Rentabilidad individual de cada inversión
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          💡 Tip: Compara diferentes escenarios ajustando los supuestos
        </p>
      </div>
    ),
    targetSelector: '[data-onboarding="results"]',
    position: 'left',
  },
  {
    id: 'export',
    title: 'Exportar y Compartir',
    description: 'Guarda y comparte tus análisis',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Puedes exportar tus datos y resultados de varias formas.
        </p>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Exportar JSON:</strong> Guarda la configuración completa para cargarla después
          </div>
          <div>
            <strong>Exportar CSV:</strong> Compatible con Excel para análisis avanzados
          </div>
          <div>
            <strong>Generar PDF:</strong> Reporte profesional listo para compartir
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          💡 Tip: Los datos se guardan automáticamente en tu navegador
        </p>
      </div>
    ),
    targetSelector: '[data-onboarding="data-management"]',
    position: 'right',
  },
  {
    id: 'complete',
    title: '¡Todo listo!',
    description: 'Ya estás listo para usar el Motor de Inversión',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Has completado el tutorial. Ahora puedes comenzar a analizar tu portafolio inmobiliario.
        </p>
        <div className="space-y-2 text-sm">
          <div>✅ Configurar supuestos globales</div>
          <div>✅ Agregar propiedades</div>
          <div>✅ Ver resultados en tiempo real</div>
          <div>✅ Exportar tus análisis</div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Si necesitas ayuda, puedes reiniciar este tutorial desde el menú de ayuda.
        </p>
      </div>
    ),
  },
]

export function OnboardingTutorial({
  isActive,
  currentStep,
  onNext,
  onPrevious,
  onComplete,
  onSkip,
  totalSteps,
}: OnboardingTutorialProps) {
  const step = onboardingSteps[currentStep]
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isActive && step?.targetSelector) {
      const target = document.querySelector(step.targetSelector) as HTMLElement
      if (target) {
        targetRef.current = target
        // Scroll suave al elemento
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Agregar highlight
        target.style.transition = 'all 0.3s ease'
        target.style.boxShadow = '0 0 0 4px rgba(218, 165, 32, 0.3)'
        target.style.borderRadius = '8px'
      }
    }

    return () => {
      if (targetRef.current) {
        targetRef.current.style.boxShadow = ''
      }
    }
  }, [isActive, currentStep, step?.targetSelector])

  if (!isActive || !step) return null

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <Dialog open={isActive} onOpenChange={() => {}}>
      <DialogContent showClose={false} className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{step.title}</DialogTitle>
              <DialogDescription className="mt-2">
                {step.description}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSkip}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          {step.content}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Paso {currentStep + 1} de {totalSteps}
          </div>
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button variant="outline" onClick={onPrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            )}
            {isLastStep ? (
              <Button onClick={onComplete}>
                Comenzar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={onNext}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </DialogFooter>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { onboardingSteps }

