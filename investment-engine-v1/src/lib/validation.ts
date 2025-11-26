import type { GlobalAssumptions, PropertyInput } from '@/src/types/investment'

export interface ValidationError {
  field: string
  message: string
}

export interface FieldValidation {
  isValid: boolean
  error?: string
  suggestion?: string
}

/**
 * Valida un valor numérico con rango sugerido
 */
export function validateNumber(
  value: number,
  min?: number,
  max?: number,
  fieldName?: string,
  allowZero: boolean = false
): FieldValidation {
  if (isNaN(value)) {
    return {
      isValid: false,
      error: `${fieldName || 'Este campo'} debe ser un número válido`,
    }
  }

  if (!allowZero && value < 0) {
    return {
      isValid: false,
      error: `${fieldName || 'Este campo'} debe ser un número positivo`,
    }
  }

  if (allowZero && value < 0) {
    return {
      isValid: false,
      error: `${fieldName || 'Este campo'} no puede ser negativo`,
    }
  }

  if (min !== undefined && value < min) {
    // Si min es 0 y allowZero es true, permitir 0
    if (min === 0 && allowZero && value === 0) {
      return { isValid: true }
    }
    return {
      isValid: false,
      error: `${fieldName || 'Este campo'} debe ser al menos ${min}`,
      suggestion: `Valor típico: ${min}-${max || min * 2}`,
    }
  }

  if (max !== undefined && value > max) {
    return {
      isValid: false,
      error: `${fieldName || 'Este campo'} no debe exceder ${max}`,
      suggestion: `Valor típico: ${min || max / 2}-${max}`,
    }
  }

  return { isValid: true }
}

/**
 * Valida supuestos globales
 */
export function validateGlobalAssumptions(
  assumptions: GlobalAssumptions
): ValidationError[] {
  const errors: ValidationError[] = []

  // UF Actual
  if (assumptions.ufActual < 30000 || assumptions.ufActual > 50000) {
    errors.push({
      field: 'ufActual',
      message: 'El valor UF parece fuera de rango típico (30,000 - 50,000)',
    })
  }

  // Tasa Anual
  if (assumptions.tasaAnual < 0.02 || assumptions.tasaAnual > 0.10) {
    errors.push({
      field: 'tasaAnual',
      message: 'La tasa anual típica está entre 2% y 10%',
    })
  }

  // Plazo
  if (assumptions.plazoAnios < 5 || assumptions.plazoAnios > 40) {
    errors.push({
      field: 'plazoAnios',
      message: 'El plazo típico está entre 5 y 40 años',
    })
  }

  // Plusvalía
  if (assumptions.plusvaliaAnio1 < 0 || assumptions.plusvaliaAnio1 > 0.20) {
    errors.push({
      field: 'plusvaliaAnio1',
      message: 'La plusvalía del año 1 típicamente está entre 0% y 20%',
    })
  }

  if (
    assumptions.plusvaliaDesdeAnio2 < 0 ||
    assumptions.plusvaliaDesdeAnio2 > 0.15
  ) {
    errors.push({
      field: 'plusvaliaDesdeAnio2',
      message: 'La plusvalía anual típica está entre 0% y 15%',
    })
  }

  // Porcentaje Pie
  if (
    assumptions.porcentajePieTeorico < 0.05 ||
    assumptions.porcentajePieTeorico > 0.30
  ) {
    errors.push({
      field: 'porcentajePieTeorico',
      message: 'El pie típico está entre 5% y 30%',
    })
  }

  // Horizonte
  if (assumptions.horizonteAnios < 1 || assumptions.horizonteAnios > 20) {
    errors.push({
      field: 'horizonteAnios',
      message: 'El horizonte típico está entre 1 y 20 años',
    })
  }

  return errors
}

/**
 * Valida una propiedad
 */
export function validateProperty(property: PropertyInput): ValidationError[] {
  const errors: ValidationError[] = []

  // Nombre
  if (!property.nombreProyecto.trim()) {
    errors.push({
      field: 'nombreProyecto',
      message: 'El nombre del proyecto es requerido',
    })
  }

  // Comuna
  if (!property.comuna.trim()) {
    errors.push({
      field: 'comuna',
      message: 'La comuna es requerida',
    })
  }

  // Tipología
  if (!property.tipologia.trim()) {
    errors.push({
      field: 'tipologia',
      message: 'La tipología es requerida',
    })
  }

  // m² Totales
  if (property.m2Totales < 20 || property.m2Totales > 500) {
    errors.push({
      field: 'm2Totales',
      message: 'Los m² típicos están entre 20 y 500',
    })
  }

  // Valor UF
  if (property.valorUf < 500 || property.valorUf > 10000) {
    errors.push({
      field: 'valorUf',
      message: 'El valor en UF típico está entre 500 y 10,000 UF',
    })
  }

  // Porcentaje Financiamiento
  if (
    property.porcentajeFinanciamiento < 0.5 ||
    property.porcentajeFinanciamiento > 1.0
  ) {
    errors.push({
      field: 'porcentajeFinanciamiento',
      message: 'El financiamiento típico está entre 50% y 100%',
    })
  }

  // Arriendo
  if (property.arriendoEstimadoClp < 100000 || property.arriendoEstimadoClp > 5000000) {
    errors.push({
      field: 'arriendoEstimadoClp',
      message: 'El arriendo típico está entre $100,000 y $5,000,000 CLP',
    })
  }

  // Validación cruzada: Arriendo vs Valor
  const valorClp = property.valorUf * 40000 // Aproximado
  const rentabilidadBruta = (property.arriendoEstimadoClp * 12) / valorClp
  if (rentabilidadBruta < 0.02 || rentabilidadBruta > 0.15) {
    errors.push({
      field: 'arriendoEstimadoClp',
      message: `La rentabilidad bruta (${(rentabilidadBruta * 100).toFixed(1)}%) está fuera del rango típico (2% - 15%)`,
    })
  }

  return errors
}

/**
 * Obtiene sugerencias de valores típicos para un campo
 */
export function getFieldSuggestion(field: string): string | undefined {
  const suggestions: Record<string, string> = {
    ufActual: 'Valor típico: $35,000 - $45,000 CLP',
    tasaAnual: 'Tasa típica: 4% - 6% anual',
    plazoAnios: 'Plazo típico: 20 - 30 años',
    plusvaliaAnio1: 'Plusvalía año 1 típica: 3% - 7%',
    plusvaliaDesdeAnio2: 'Plusvalía anual típica: 3% - 6%',
    porcentajePieTeorico: 'Pie típico: 10% - 20%',
    porcentajeBonoPie: 'Bono pie típico: 5% - 15%',
    mesesPieEnCuotas: 'Meses típicos: 24 - 48 meses',
    porcentajeGastosBanco: 'Gastos banco típicos: 0.5% - 2%',
    horizonteAnios: 'Horizonte típico: 3 - 7 años',
    valorUf: 'Valor típico: 1,000 - 5,000 UF',
    porcentajeFinanciamiento: 'Financiamiento típico: 80% - 90%',
    arriendoEstimadoClp: 'Arriendo típico: $300,000 - $1,500,000 CLP',
    gastoComunClp: 'Gasto común típico: $50,000 - $200,000 CLP',
    m2Totales: 'm² típicos: 40 - 100 m²',
  }

  return suggestions[field]
}

