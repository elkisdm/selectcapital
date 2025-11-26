'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip } from '@/components/ui/tooltip'
import { validateNumber, getFieldSuggestion } from '@/src/lib/validation'
import { getFieldDescription } from '@/src/lib/fieldDescriptions'
import {
  formatNumberWithThousands,
  parseFormattedNumber,
  shouldFormatThousands,
  getDecimalPlaces,
  normalizePercentage,
  normalizeDecimal,
  normalizeInteger,
} from '@/src/lib/numberFormat'
import { AlertCircle, Info, HelpCircle } from 'lucide-react'
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
  allowZero?: boolean
  showTooltip?: boolean
  isPercentage?: boolean // Si es true, el valor se multiplica/divide por 100
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
  showTooltip = true,
  isPercentage = false,
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false)
  const [focused, setFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const isTypingRef = useRef(false)

  // Determinar formato
  const formatThousands = shouldFormatThousands(id)
  const decimalPlaces = getDecimalPlaces(id)
  const fieldDescription = showTooltip ? getFieldDescription(id) : undefined

  // Convertir valor a string formateado para mostrar
  useEffect(() => {
    if (!isTypingRef.current && !focused) {
      if (value === 0 && !allowZero) {
        setDisplayValue('')
      } else if (value === '' || value === null || value === undefined) {
        setDisplayValue('')
      } else {
        let numValue = typeof value === 'number' ? value : parseFloat(value as string)
        
        if (isNaN(numValue)) {
          setDisplayValue('')
          return
        }

        // Si es porcentaje, convertir a porcentaje para mostrar
        if (isPercentage) {
          numValue = numValue * 100
        }

        // Formatear según el tipo de campo
        if (formatThousands) {
          // Formato con separadores de miles
          setDisplayValue(formatNumberWithThousands(numValue))
        } else if (decimalPlaces > 0) {
          // Formato con decimales limitados
          const formatted = numValue.toFixed(decimalPlaces)
          setDisplayValue(formatted.replace('.', ','))
        } else {
          // Entero
          setDisplayValue(Math.round(numValue).toString())
        }
      }
    }
  }, [value, formatThousands, decimalPlaces, allowZero, isPercentage, focused])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true)
    isTypingRef.current = true
    // Seleccionar todo el texto al hacer focus
    e.target.select()
  }

  const handleBlur = () => {
    setTouched(true)
    setFocused(false)
    isTypingRef.current = false
    
    // Normalizar el valor al perder el focus
    if (displayValue.trim() === '') {
      onChange(0)
      return
    }

    let parsed = parseFormattedNumber(displayValue)
    
    // Normalizar según el tipo
    if (isPercentage) {
      // El valor ingresado está en porcentaje (ej: 4.5), convertirlo a decimal (0.045)
      parsed = normalizePercentage(parsed) / 100
    } else if (decimalPlaces > 0) {
      parsed = normalizeDecimal(parsed, decimalPlaces)
    } else {
      parsed = normalizeInteger(parsed)
    }

    // Aplicar límites
    if (min !== undefined && parsed < min) {
      parsed = min
    }
    if (max !== undefined && parsed > max) {
      parsed = max
    }

    onChange(parsed)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    isTypingRef.current = true
    
    // Permitir borrar completamente
    if (inputValue === '') {
      setDisplayValue('')
      return
    }

    // Si es formato de miles, permitir escribir con puntos
    if (formatThousands) {
      // Permitir números, puntos y comas
      const cleaned = inputValue.replace(/[^\d.,]/g, '')
      setDisplayValue(cleaned)
    } else {
      // Para otros campos, permitir números y coma/punto decimal
      const cleaned = inputValue.replace(/[^\d.,]/g, '')
      // Reemplazar coma por punto para procesamiento
      setDisplayValue(cleaned.replace(',', '.'))
    }
  }

  // Validar siempre si es número
  const shouldValidate = type === 'number' && typeof value === 'number'
  const validation = shouldValidate
    ? validateNumber(value, min, max, fieldName || label, allowZero)
    : { isValid: true }

  const suggestion = showSuggestion ? getFieldSuggestion(id) : undefined
  const showError = touched && !validation.isValid
  const showSuggestionText = focused && suggestion && !showError && !displayValue

  const labelContent = (
    <div className="flex items-center gap-1.5">
      <Label htmlFor={id} className="cursor-text">{label}</Label>
      {fieldDescription && (
        <Tooltip content={
          <div className="space-y-1.5">
            <div className="font-semibold">{fieldDescription.title}</div>
            <div className="text-xs">{fieldDescription.description}</div>
            {fieldDescription.example && (
              <div className="text-xs text-muted-foreground/80 mt-1 pt-1 border-t border-border/50">
                {fieldDescription.example}
              </div>
            )}
            {fieldDescription.note && (
              <div className="text-xs text-primary/80 mt-1">
                💡 {fieldDescription.note}
              </div>
            )}
          </div>
        }>
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors cursor-help" />
        </Tooltip>
      )}
    </div>
  )

  return (
    <div className={cn('space-y-2', className)}>
      {labelContent}
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type="text" // Siempre usar text para mejor control del formateo
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder ? undefined : ''} // No mostrar placeholder si hay valor
          required={required}
          className={cn(
            'pr-8',
            showError && 'border-destructive focus-visible:ring-destructive',
            !displayValue && placeholder && 'placeholder:text-muted-foreground/40'
          )}
          data-placeholder={placeholder} // Guardar placeholder como data attribute
        />
        {!displayValue && placeholder && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40 text-sm">
            {placeholder}
          </div>
        )}
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
