/**
 * Funciones puras para cálculos hipotecarios
 * Basadas en amortización francesa con carga financiera fija del 25%
 */

/**
 * Calcula la renta ajustada según los tipos de ingreso seleccionados (múltiples)
 * Permite combinaciones como: dependiente fijo + boletas
 * Se usa el criterio más conservador cuando hay múltiples tipos
 */
export function calculateRentaAjustada(
  rentaTotal: number,
  tiposIngreso: {
    dependienteFijo: boolean
    dependienteVariable: boolean
    independiente: boolean
  }
): number {
  if (rentaTotal <= 0) return 0

  // Contar cuántos tipos están activos
  const tiposActivos = [
    tiposIngreso.dependienteFijo,
    tiposIngreso.dependienteVariable,
    tiposIngreso.independiente,
  ].filter(Boolean).length

  if (tiposActivos === 0) return 0

  // Si tiene múltiples tipos, usar el más conservador
  // Independiente (70%) < Dependiente Variable (80%) < Dependiente Fijo (100%)
  if (tiposIngreso.independiente) {
    return rentaTotal * 0.7 // 70% - más conservador
  }
  if (tiposIngreso.dependienteVariable) {
    return rentaTotal * 0.8 // 80%
  }
  if (tiposIngreso.dependienteFijo) {
    return rentaTotal * 1.0 // 100%
  }

  return rentaTotal
}

/**
 * Calcula el dividendo máximo con carga financiera fija del 25%
 */
export function calculateDividendoMax(rentaAjustada: number): number {
  if (rentaAjustada <= 0) return 0
  return rentaAjustada * 0.25 // Siempre 25%
}

/**
 * Calcula el crédito máximo usando amortización francesa
 * P = D / (r * (1 - (1 + r)^-n))
 */
export function calculateCreditoMax(
  dividendo: number,
  tasaAnual: number,
  plazoAnios: number
): number {
  if (dividendo <= 0 || tasaAnual <= 0 || plazoAnios <= 0) return 0

  const monthlyRate = tasaAnual / 12 / 100
  const n = plazoAnios * 12

  if (monthlyRate === 0) {
    return dividendo * n
  }

  const denominator = monthlyRate * (1 - Math.pow(1 + monthlyRate, -n))
  
  if (denominator <= 0) return 0

  return dividendo / denominator
}

/**
 * Calcula el dividendo para un crédito dado (inversa de calculateCreditoMax)
 */
export function calculateDividendo(
  credito: number,
  tasaAnual: number,
  plazoAnios: number
): number {
  if (credito <= 0 || tasaAnual <= 0 || plazoAnios <= 0) return 0

  const monthlyRate = tasaAnual / 12 / 100
  const n = plazoAnios * 12

  if (monthlyRate === 0) {
    return credito / n
  }

  const numerator = credito * monthlyRate * Math.pow(1 + monthlyRate, n)
  const denominator = Math.pow(1 + monthlyRate, n) - 1

  if (denominator <= 0) return 0

  return numerator / denominator
}

/**
 * Convierte pesos a UF
 */
export function pesoToUF(monto: number, ufValue: number): number {
  if (monto <= 0 || ufValue <= 0) return 0
  return monto / ufValue
}

/**
 * Convierte UF a pesos
 */
export function ufToPeso(montoUF: number, ufValue: number): number {
  if (montoUF <= 0 || ufValue <= 0) return 0
  return montoUF * ufValue
}

/**
 * Calcula el valor de la propiedad basado en el crédito y LTV
 */
export function calculateValorPropiedad(
  creditoUF: number,
  ltv: number
): number {
  if (creditoUF <= 0 || ltv <= 0 || ltv > 100) return 0
  return creditoUF / (ltv / 100)
}

/**
 * Calcula el pie requerido para un valor de propiedad y LTV
 */
export function calculatePie(
  valorPropiedadUF: number,
  ltv: number
): number {
  if (valorPropiedadUF <= 0 || ltv <= 0 || ltv >= 100) return 0
  return valorPropiedadUF * (1 - ltv / 100)
}

/**
 * Calcula los requerimientos para acceder a un proyecto específico
 * (Búsqueda Inversa)
 */
export function calculateProyectoRequerimientos(
  valorProyectoUF: number,
  rentaAjustada: number,
  tasaInteres: number,
  plazo: number,
  valorUF: number,
  ltvs: { ltv80: boolean; ltv85: boolean; ltv90: boolean }
): {
  ltv: number
  creditoUF: number
  creditoPesos: number
  pieUF: number
  piePesos: number
  piePorcentaje: number
  dividendoEstimado: number
  dividendoMaximo: number
  capacidadSuficiente: boolean
  diferenciaCapacidad: number
  message: string
}[] {
  const resultados = []
  const dividendoMax = calculateDividendoMax(rentaAjustada)

  const ltvOptions = [
    { enabled: ltvs.ltv80, value: 80, pie: 20 },
    { enabled: ltvs.ltv85, value: 85, pie: 15 },
    { enabled: ltvs.ltv90, value: 90, pie: 10 },
  ]

  for (const ltv of ltvOptions) {
    if (!ltv.enabled) continue

    const creditoUF = valorProyectoUF * (ltv.value / 100)
    const pieUF = valorProyectoUF * (ltv.pie / 100)
    const creditoPesos = ufToPeso(creditoUF, valorUF)
    const piePesos = ufToPeso(pieUF, valorUF)
    const dividendoEstimado = calculateDividendo(creditoPesos, tasaInteres, plazo)
    const capacidadSuficiente = dividendoEstimado <= dividendoMax
    const diferenciaCapacidad = dividendoMax - dividendoEstimado

    let message = ''
    if (capacidadSuficiente) {
      if (diferenciaCapacidad > dividendoMax * 0.2) {
        message = `✓ Puedes acceder cómodamente. Te queda margen de ${Math.round(diferenciaCapacidad).toLocaleString('es-CL')}`
      } else {
        message = `✓ Puedes acceder, pero estás cerca del límite`
      }
    } else {
      const deficit = Math.abs(diferenciaCapacidad)
      message = `✗ Supera tu capacidad en ${Math.round(deficit).toLocaleString('es-CL')}/mes`
    }

    resultados.push({
      ltv: ltv.value,
      creditoUF,
      creditoPesos,
      pieUF,
      piePesos,
      piePorcentaje: ltv.pie,
      dividendoEstimado,
      dividendoMaximo: dividendoMax,
      capacidadSuficiente,
      diferenciaCapacidad,
      message,
    })
  }

  return resultados
}
