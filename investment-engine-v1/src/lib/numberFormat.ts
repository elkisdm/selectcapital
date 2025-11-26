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
export function parseFormattedNumber(value: string, isPercentage: boolean = false): number {
  if (!value || value.trim() === '') return 0
  
  // Si es porcentaje, nunca tiene separadores de miles, solo decimales
  if (isPercentage) {
    // Solo convertir coma a punto decimal
    const cleaned = value.replace(',', '.')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }
  
  // Para otros números, detectar si hay separadores de miles
  // Si hay coma, siempre es decimal (formato chileno)
  if (value.includes(',')) {
    // La coma es el separador decimal, los puntos son miles
    const cleaned = value.replace(/\./g, '').replace(',', '.')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }
  
  // Solo puntos: determinar si es decimal o miles
  if (value.includes('.')) {
    const parts = value.split('.')
    
    // Si hay múltiples puntos, los primeros son miles
    if (parts.length > 2) {
      // Todos los puntos excepto el último son miles
      // El último puede ser decimal si tiene 1-2 dígitos
      const lastPart = parts[parts.length - 1]
      if (lastPart.length <= 2) {
        // El último punto es decimal
        const integerPart = parts.slice(0, -1).join('')
        const decimalPart = lastPart
        const cleaned = `${integerPart}.${decimalPart}`
        const parsed = parseFloat(cleaned)
        return isNaN(parsed) ? 0 : parsed
      } else {
        // Todos son miles
        const cleaned = value.replace(/\./g, '')
        const parsed = parseFloat(cleaned)
        return isNaN(parsed) ? 0 : parsed
      }
    }
    
    // Un solo punto: determinar si es decimal o miles
    if (parts.length === 2) {
      const afterPoint = parts[1]
      // Si tiene 3 dígitos después del punto, probablemente es miles
      // Si tiene 1-2 dígitos, es decimal
      if (afterPoint.length <= 2) {
        // Es decimal
        const parsed = parseFloat(value)
        return isNaN(parsed) ? 0 : parsed
      } else if (afterPoint.length === 3) {
        // Probablemente es miles, pero puede ser ambiguo
        // Si el número total es pequeño (< 1000), es decimal
        const beforePoint = parts[0]
        if (beforePoint.length === 0 || parseInt(beforePoint) < 1000) {
          // Es decimal
          const parsed = parseFloat(value)
          return isNaN(parsed) ? 0 : parsed
        } else {
          // Es miles
          const cleaned = value.replace(/\./g, '')
          const parsed = parseFloat(cleaned)
          return isNaN(parsed) ? 0 : parsed
        }
      } else {
        // Más de 3 dígitos, definitivamente es miles
        const cleaned = value.replace(/\./g, '')
        const parsed = parseFloat(cleaned)
        return isNaN(parsed) ? 0 : parsed
      }
    }
  }
  
  // Sin puntos ni comas, solo números
  const parsed = parseFloat(value)
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
 * Limita a máximo 2 decimales sin redondear agresivamente
 */
export function normalizePercentage(value: string | number): number {
  if (typeof value === 'number') {
    // Limitar a 2 decimales sin redondear (truncar)
    return Math.floor(value * 100) / 100
  }
  
  const parsed = parseFormattedNumber(value, true)
  // Limitar a 2 decimales sin redondear (truncar)
  return Math.floor(parsed * 100) / 100
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

