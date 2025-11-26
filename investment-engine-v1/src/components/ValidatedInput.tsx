'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validateNumber, getFieldSuggestion } from '@/src/lib/validation'
import { AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ValidatedInputProps {
  id: string
  label: string
  type?: 'number' | 'text'
  value: number | string
  onChange: (value: number | string) => void
  step?: string
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  fieldName?: string
  showSuggestion?: boolean
  className?: string
  allowZero?: boolean // Permite que el valor 0 sea válido y visible
}

export function ValidatedInput({
  id,
  label,
  type = 'number',
  value,
  onChange,
  step,
  placeholder,
  required,
  min,
  max,
  fieldName,
  showSuggestion = true,
  className,
  allowZero = false,
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false)
  const [focused, setFocused] = useState(false)

  const handleBlur = () => {
    setTouched(true)
    setFocused(false)
  }

  const handleFocus = () => {
    setFocused(true)
  }

  // Validar siempre si es número, pero permitir 0 si allowZero es true
  const shouldValidate = type === 'number' && typeof value === 'number'
  const validation = shouldValidate
    ? validateNumber(value, min, max, fieldName || label, allowZero)
    : { isValid: true }

  const suggestion = showSuggestion ? getFieldSuggestion(id) : undefined
  const showError = touched && !validation.isValid
  const showSuggestionText = focused && suggestion && !showError

  // Mostrar 0 si allowZero es true y el valor es 0, de lo contrario mostrar vacío si es 0
  const displayValue = 
    allowZero && value === 0 
      ? 0 
      : (value === 0 || value === '' ? '' : value)

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          step={step}
          value={displayValue}
          onChange={(e) => {
            if (type === 'number') {
              const inputValue = e.target.value.trim()
              if (inputValue === '' || inputValue === '-') {
                // Si está vacío, usar 0 (se mostrará como vacío si allowZero es false)
                onChange(0)
              } else {
                const numValue = parseFloat(inputValue)
                if (!isNaN(numValue)) {
                  onChange(numValue)
                } else {
                  // Si no es un número válido, mantener 0
                  onChange(0)
                }
              }
            } else {
              onChange(e.target.value)
            }
          }}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          className={cn(
            showError && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {showError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
        )}
      </div>
      {showError && validation.error && (
        <div className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <div>
            <p>{validation.error}</p>
            {validation.suggestion && (
              <p className="text-muted-foreground mt-0.5">
                {validation.suggestion}
              </p>
            )}
          </div>
        </div>
      )}
      {showSuggestionText && (
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  )
}

