/**
 * Utilidades para formateo y normalización de números
 */

/**
 * Formatea un número con separadores de miles (formato chileno: 1.000.000)
 */
export function formatNumberWithThousands(value: number | string): string {
  if (value === '' || value === null || value === undefined) return ''
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return ''
  
  // Para números enteros, usar separador de miles
  if (Number.isInteger(numValue)) {
    return numValue.toLocaleString('es-CL')
  }
  
  // Para decimales, separar parte entera y decimal
  const parts = numValue.toString().split('.')
  const integerPart = parseInt(parts[0]).toLocaleString('es-CL')
  const decimalPart = parts[1] || ''
  
  return decimalPart ? `${integerPart},${decimalPart}` : integerPart
}

/**
 * Parsea un string con formato chileno a número
 * Elimina puntos de miles y convierte coma a punto decimal
 */
export function parseFormattedNumber(value: string): number {
  if (!value || value.trim() === '') return 0
  
  // Eliminar puntos (separadores de miles) y convertir coma a punto
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  const parsed = parseFloat(cleaned)
  
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Formatea un número con un número específico de decimales
 */
export function formatDecimal(value: number, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) return ''
  return value.toFixed(decimals).replace('.', ',')
}

/**
 * Normaliza un valor de entrada para porcentajes
 * Limita a máximo 2 decimales
 */
export function normalizePercentage(value: string | number): number {
  if (typeof value === 'number') {
    // Redondear a 2 decimales máximo
    return Math.round(value * 100) / 100
  }
  
  const parsed = parseFormattedNumber(value)
  // Redondear a 2 decimales máximo
  return Math.round(parsed * 100) / 100
}

/**
 * Normaliza un valor de entrada para números enteros
 */
export function normalizeInteger(value: string | number): number {
  if (typeof value === 'number') {
    return Math.round(value)
  }
  
  const parsed = parseFormattedNumber(value)
  return Math.round(parsed)
}

/**
 * Normaliza un valor de entrada para números con decimales
 * Limita a un número específico de decimales
 */
export function normalizeDecimal(value: string | number, maxDecimals: number = 2): number {
  if (typeof value === 'number') {
    const factor = Math.pow(10, maxDecimals)
    return Math.round(value * factor) / factor
  }
  
  const parsed = parseFormattedNumber(value)
  const factor = Math.pow(10, maxDecimals)
  return Math.round(parsed * factor) / factor
}

/**
 * Determina si un campo debe usar formato de miles
 */
export function shouldFormatThousands(fieldId: string): boolean {
  const thousandsFields = [
    'ufActual',
    'arriendoEstimadoClp',
    'gastoComunClp',
    'otrosGastosMensualesClp',
    'reservaClp',
    'abonosInicialesClp',
    'costosMobiliarioClp',
    'costosGestionClp',
  ]
  return thousandsFields.includes(fieldId)
}

/**
 * Determina el número de decimales permitidos para un campo
 */
export function getDecimalPlaces(fieldId: string): number {
  // Porcentajes: 1-2 decimales
  const percentageFields = [
    'tasaAnual',
    'plusvaliaAnio1',
    'plusvaliaDesdeAnio2',
    'porcentajePieTeorico',
    'porcentajeBonoPie',
    'porcentajeGastosBanco',
    'ivaPorcentaje',
    'ivaFactorRecuperable',
    'porcentajeFinanciamiento',
  ]
  
  if (percentageFields.includes(fieldId)) {
    return 2 // Máximo 2 decimales para porcentajes
  }
  
  // Campos con decimales específicos
  if (fieldId === 'valorUf' || fieldId === 'ufActual') {
    return 0 // UF se muestra como entero (aunque internamente puede tener decimales)
  }
  
  // Enteros por defecto
  return 0
}

