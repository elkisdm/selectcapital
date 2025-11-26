import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'investment-engine-onboarding-completed'

export function useOnboarding() {
  const [isCompleted, setIsCompleted] = useState<boolean>(true)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)

  useEffect(() => {
    // Solo verificar en el cliente
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(ONBOARDING_KEY) === 'true'
      setIsCompleted(completed)
      // Si no está completado, iniciar automáticamente
      if (!completed) {
        setIsActive(true)
      }
    }
  }, [])

  const startOnboarding = () => {
    setIsActive(true)
    setCurrentStep(0)
  }

  const completeOnboarding = () => {
    setIsActive(false)
    setIsCompleted(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true')
    }
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const resetOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ONBOARDING_KEY)
    }
    setIsCompleted(false)
    setIsActive(false)
    setCurrentStep(0)
  }

  return {
    isCompleted,
    isActive,
    currentStep,
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    nextStep,
    previousStep,
    goToStep,
    resetOnboarding,
  }
}

