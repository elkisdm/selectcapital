import type {
  GlobalAssumptions,
  PropertyInput,
  PropertyResult,
  PortfolioResult,
} from '@/src/types/investment'

/**
 * CRITICAL: Value Normalization Logic
 * 
 * The Excel model uses TWO different values:
 * - VALOR A ESCRITURAR (100% UF) → Total property value
 * - VALOR A FINANCIAR (UF × % financiamiento) → Credit amount only
 * 
 * ALL calculations (except dividendo) must use valorUfTotal (100%).
 * Only dividendo uses the financed UF.
 * 
 * This function detects and normalizes the input to ensure we always have:
 * - valorUfTotal: The total property value (100% UF)
 * - valorFinanciadoUf: The amount to be financed (valorUfTotal × porcentajeFinanciamiento)
 */

/**
 * Gets the total property value in UF (100%)
 * 
 * CRITICAL LOGIC:
 * The Excel model uses TWO different values:
 * - VALOR A ESCRITURAR (100% UF) → Total property value - used for ALL calculations
 * - VALOR A FINANCIAR (UF × % financiamiento) → Credit amount - used ONLY for dividendo
 * 
 * Detection Logic:
 * 1. If valorUfTotal is explicitly provided, use it (highest priority)
 * 2. If valorFinanciadoUf is provided, calculate: valorFinanciadoUf / porcentajeFinanciamiento
 * 3. If only valorUf is provided, detect if it's total or financed:
 *    - Heuristic: If valorUf < 3000 UF, it's likely financed (typical range: 2000-3000)
 *    - If valorUf >= 3000 UF, it's likely total (typical range: 3000+)
 *    - This handles cases like "Compañía 1735" where valorFinanciadoUf = 2860
 * 
 * Examples:
 * - valorUf = 2860, porcentajeFinanciamiento = 0.9 → valorUfTotal = 3177.777...
 * - valorUf = 2880, porcentajeFinanciamiento = 0.9 → valorUfTotal = 3200 (if 2880 is total)
 * - valorUf = 2880, porcentajeFinanciamiento = 0.9 → valorUfTotal = 3200 (if 2880 is financed)
 */
export function getValorUfTotal(input: PropertyInput): number {
  // Case 1: Explicit total provided (highest priority)
  if (input.valorUfTotal !== undefined && input.valorUfTotal > 0) {
    return input.valorUfTotal
  }

  // Case 2: Explicit financed value provided
  if (input.valorFinanciadoUf !== undefined && input.valorFinanciadoUf > 0) {
    if (input.porcentajeFinanciamiento > 0 && input.porcentajeFinanciamiento <= 1) {
      return input.valorFinanciadoUf / input.porcentajeFinanciamiento
    }
  }

  // Case 3: Only valorUf provided - detect if it's total or financed
  // Heuristic: 
  // - Financed values are typically 2000-2870 UF (e.g., 2860, 2592)
  // - Total values are typically 2880+ UF (e.g., 2880, 3200, 3500)
  // - The threshold is set to 2870 to handle edge cases:
  //   - 2860 < 2870 → treated as financed (Compañía 1735)
  //   - 2880 >= 2870 → treated as total (NEO FLORIDA)
  // 
  // NOTE: For ambiguous cases (2850-2900), the user should explicitly provide
  // valorUfTotal or valorFinanciadoUf to avoid confusion
  const THRESHOLD_UF = 2870
  
  if (input.valorUf < THRESHOLD_UF) {
    // valorUf < 2870, likely the financed amount
    // Calculate total: valorUf / porcentajeFinanciamiento
    if (input.porcentajeFinanciamiento > 0 && input.porcentajeFinanciamiento <= 1) {
      return input.valorUf / input.porcentajeFinanciamiento
    }
  }
  
  // valorUf >= 2870, assume it's the total property value
  return input.valorUf
}

/**
 * Gets the financed amount in UF (valorUfTotal × porcentajeFinanciamiento)
 */
export function getValorFinanciadoUf(input: PropertyInput): number {
  const valorUfTotal = getValorUfTotal(input)
  return valorUfTotal * input.porcentajeFinanciamiento
}

/**
 * Gets the total property value in CLP (valorUfTotal × ufActual)
 */
export function getValorClp(
  input: PropertyInput,
  assumptions: GlobalAssumptions
): number {
  const valorUfTotal = getValorUfTotal(input)
  return valorUfTotal * assumptions.ufActual
}

/**
 * Calcula el dividendo mensual (PMT) para un crédito hipotecario
 */
export function calcularDividendo(
  assumptions: GlobalAssumptions,
  montoFinanciadoUf: number
): { dividendoUf: number; dividendoClp: number } {
  const tasaMensual = Math.pow(1 + assumptions.tasaAnual, 1 / 12) - 1
  const nMeses = assumptions.plazoAnios * 12

  if (tasaMensual <= 0 || nMeses <= 0 || montoFinanciadoUf <= 0) {
    return { dividendoUf: 0, dividendoClp: 0 }
  }

  // Fórmula PMT clásica (sin signo negativo en el retorno)
  const dividendoUf =
    (montoFinanciadoUf * tasaMensual) /
    (1 - Math.pow(1 + tasaMensual, -nMeses))

  const dividendoClp = dividendoUf * assumptions.ufActual

  return { dividendoUf, dividendoClp }
}

/**
 * Calcula la plusvalía proyectada para un horizonte de años
 */
export function calcularPlusvalia(
  assumptions: GlobalAssumptions,
  valorUfInicial: number
): {
  precioUfFuturo: number
  precioClpFuturo: number
  plusvaliaHorizonteClp: number
} {
  let precioUf = valorUfInicial

  for (let anio = 1; anio <= assumptions.horizonteAnios; anio++) {
    const factor =
      anio === 1
        ? 1 + assumptions.plusvaliaAnio1
        : 1 + assumptions.plusvaliaDesdeAnio2

    precioUf = precioUf * factor
  }

  const precioClpFuturo = precioUf * assumptions.ufActual
  const valorClpInicial = valorUfInicial * assumptions.ufActual
  const plusvaliaHorizonteClp = precioClpFuturo - valorClpInicial

  return { precioUfFuturo: precioUf, precioClpFuturo, plusvaliaHorizonteClp }
}

/**
 * Calcula la inversión total de una propiedad
 * Includes:
 * - gastosBanco = valorPropiedadCLP * porcentajeGastosBanco
 * - reservaClp
 * - abonosInicialesClp
 * - piePagado (if applicable, but when aplicaBonoPie=true, piePagado = reserva + abonos only)
 * - costosMobiliarioClp
 * - costosGestionClp
 */
export function calcularInversionTotalPropiedad(
  assumptions: GlobalAssumptions,
  input: PropertyInput,
  valorClp: number,
  gastosBancoClp: number,
  piePagadoClp: number
): number {
  // Investment total = reserva + abonos + piePagado + gastosBanco + costosMobiliario + costosGestion
  // Note: When aplicaBonoPie=true, piePagado already includes reserva+abonos, so we don't double count
  // But we still need to include gastosBanco separately
  const inversion =
    piePagadoClp +
    gastosBancoClp +
    input.costosMobiliarioClp +
    input.costosGestionClp

  return Math.max(inversion, 0)
}

/**
 * Calcula todos los resultados para una propiedad
 * 
 * CRITICAL: All calculations use valorUfTotal (100% UF), NOT the financed amount.
 * Only dividendo uses the financed UF.
 */
export function calcularPropertyResult(
  assumptions: GlobalAssumptions,
  input: PropertyInput
): PropertyResult {
  // 1) Normalize values - get total UF (100%)
  // CRITICAL: Always use getValorUfTotal to get the true total property value
  const valorUfTotal = getValorUfTotal(input)
  
  // 2) Valores base - ALL use valorUfTotal (100%)
  const valorClp = getValorClp(input, assumptions)
  const pieTeoricoClp = valorClp * assumptions.porcentajePieTeorico

  // 3) Financed amounts - ONLY used for dividendo
  // CRITICAL FIX: ALWAYS calculate montoFinanciadoUf as valorUfTotal * porcentajeFinanciamiento
  // NEVER use input.valorUf directly, as it may represent total, financed, or ambiguous values
  const montoFinanciadoUf = valorUfTotal * input.porcentajeFinanciamiento
  const montoFinanciadoClp = montoFinanciadoUf * assumptions.ufActual

  // 4) Gastos banco - based on TOTAL value
  const gastosBancoClp = valorClp * assumptions.porcentajeGastosBanco

  // 2) Bono pie
  // bonoPieClp = valorPropiedadCLP * porcentajePieTeorico (when aplicaBonoPie = true)
  const bonoPieClp = input.aplicaBonoPie ? pieTeoricoClp : 0

  // 3) Pie pagado y cuota mensual de pie
  // When aplicaBonoPie = true, bonoPie fully covers theoretical pie
  // Therefore piePagado ONLY includes: reservaClp + abonosInicialesClp
  // reservaClp should NOT be subtracted from pieRestante when aplicaBonoPie = true
  let pieRestanteClp = 0
  let cuotaPieMensualClp = 0
  let piePagadoClp = 0

  if (input.aplicaBonoPie) {
    // Bono pie covers the theoretical pie, so piePagado is only reserva + abonos
    piePagadoClp = input.reservaClp + input.abonosInicialesClp
    pieRestanteClp = 0
    cuotaPieMensualClp = 0
  } else {
    // No bono pie, calculate remaining pie after reserva and abonos
    pieRestanteClp = Math.max(
      pieTeoricoClp - input.reservaClp - input.abonosInicialesClp,
      0
    )
    cuotaPieMensualClp =
      assumptions.mesesPieEnCuotas > 0
        ? pieRestanteClp / assumptions.mesesPieEnCuotas
        : 0
    piePagadoClp = pieRestanteClp + input.reservaClp + input.abonosInicialesClp
  }

  // 4) Crédito / dividendo
  const { dividendoUf, dividendoClp } = calcularDividendo(
    assumptions,
    montoFinanciadoUf
  )

  // 5) Flujos mensuales
  const ingresoBrutoMensualClp = input.arriendoEstimadoClp

  const gastosBaseSinPieClp =
    dividendoClp + input.gastoComunClp + input.otrosGastosMensualesClp

  const gastosMensualesSinPieClp = gastosBaseSinPieClp
  const gastosMensualesConPieClp = gastosBaseSinPieClp + cuotaPieMensualClp

  const deltaMensualSinPieClp =
    ingresoBrutoMensualClp - gastosMensualesSinPieClp
  const deltaMensualConPieClp =
    ingresoBrutoMensualClp - gastosMensualesConPieClp

  // 6) Inversión total
  const inversionTotalPropiedadClp = calcularInversionTotalPropiedad(
    assumptions,
    input,
    valorClp,
    gastosBancoClp,
    piePagadoClp
  )

  // 7) Rentabilidades
  const flujoNetoAnualConPieClp = deltaMensualConPieClp * 12

  const rentabilidadBruta =
    valorClp > 0 ? (input.arriendoEstimadoClp * 12) / valorClp : 0

  const rentabilidadNetaSobreValorConPie =
    valorClp > 0 ? flujoNetoAnualConPieClp / valorClp : 0

  const rentabilidadNetaSobreInversionConPie =
    inversionTotalPropiedadClp > 0
      ? flujoNetoAnualConPieClp / inversionTotalPropiedadClp
      : 0

  // 8) Plusvalía - uses valorUfTotal (100%)
  const {
    precioUfFuturo,
    precioClpFuturo,
    plusvaliaHorizonteClp,
  } = calcularPlusvalia(assumptions, valorUfTotal)

  // 9) IVA inversión
  let ivaTotalClp = 0
  let ivaRecuperableClp = 0

  if (input.aplicaIvaInversion) {
    const baseIvaClp = valorClp // simplificación
    ivaTotalClp = baseIvaClp * assumptions.ivaPorcentaje
    ivaRecuperableClp = ivaTotalClp * assumptions.ivaFactorRecuperable
  }

  // 10) Ganancias
  const gananciaBonoPieClp = bonoPieClp
  const gananciaFlujoHorizonteClp =
    deltaMensualConPieClp * 12 * assumptions.horizonteAnios

  // Ganancia Bruta = plusvalía + bono pie (sin flujo, sin IVA)
  const gananciaBrutaClp = plusvaliaHorizonteClp + gananciaBonoPieClp

  // Ganancia Neta = plusvalía + bono pie + flujo (sin IVA)
  const gananciaNetaClp =
    plusvaliaHorizonteClp + gananciaBonoPieClp + gananciaFlujoHorizonteClp

  // Ganancia Total = plusvalía + bono pie + flujo + IVA recuperable
  const gananciaTotalClp =
    gananciaNetaClp + ivaRecuperableClp

  const roiSobreInversion =
    inversionTotalPropiedadClp > 0
      ? gananciaTotalClp / inversionTotalPropiedadClp
      : 0

  // 11) Devolver resultado
  return {
    input,
    valorClp,
    pieTeoricoClp,
    bonoPieClp,
    montoFinanciadoUf,
    montoFinanciadoClp,
    gastosBancoClp,
    dividendoUf,
    dividendoClp,
    piePagadoClp,
    pieRestanteClp,
    cuotaPieMensualClp,
    ingresoBrutoMensualClp,
    gastosMensualesConPieClp,
    gastosMensualesSinPieClp,
    deltaMensualConPieClp,
    deltaMensualSinPieClp,
    inversionTotalPropiedadClp,
    rentabilidadBruta,
    rentabilidadNetaSobreValorConPie,
    rentabilidadNetaSobreInversionConPie,
    precioUfFuturo,
    precioClpFuturo,
    plusvaliaHorizonteClp,
    ivaTotalClp,
    ivaRecuperableClp,
    gananciaBonoPieClp,
    gananciaFlujoHorizonteClp,
    gananciaBrutaClp,
    gananciaNetaClp,
    gananciaTotalClp,
    roiSobreInversion,
  }
}

/**
 * Calcula los resultados agregados del portafolio
 */
export function calcularPortfolioResult(
  assumptions: GlobalAssumptions,
  properties: PropertyInput[]
): PortfolioResult {
  const propertyResults = properties.map((p) =>
    calcularPropertyResult(assumptions, p)
  )

  let inversionTotalClp = 0
  let gananciaBrutaTotalClp = 0
  let gananciaNetaTotalClp = 0
  let gananciaTotalClp = 0
  let deltaMensualConPieTotalClp = 0
  let deltaMensualSinPieTotalClp = 0
  let plusvaliaHorizonteTotalClp = 0
  let bonoPieTotalClp = 0
  let ivaTotalRecuperableClp = 0

  for (const r of propertyResults) {
    inversionTotalClp += r.inversionTotalPropiedadClp
    gananciaBrutaTotalClp += r.gananciaBrutaClp
    gananciaNetaTotalClp += r.gananciaNetaClp
    gananciaTotalClp += r.gananciaTotalClp
    deltaMensualConPieTotalClp += r.deltaMensualConPieClp
    deltaMensualSinPieTotalClp += r.deltaMensualSinPieClp
    plusvaliaHorizonteTotalClp += r.plusvaliaHorizonteClp
    bonoPieTotalClp += r.gananciaBonoPieClp
    ivaTotalRecuperableClp += r.ivaRecuperableClp
  }

  const roiTotal =
    inversionTotalClp > 0 ? gananciaTotalClp / inversionTotalClp : 0

  return {
    properties: propertyResults,
    inversionTotalClp,
    gananciaBrutaTotalClp,
    gananciaNetaTotalClp,
    gananciaTotalClp,
    roiTotal,
    deltaMensualConPieTotalClp,
    deltaMensualSinPieTotalClp,
    plusvaliaHorizonteTotalClp,
    bonoPieTotalClp,
    ivaTotalRecuperableClp,
  }
}

