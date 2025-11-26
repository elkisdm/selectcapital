import type {
  GlobalAssumptions,
  PropertyInput,
  PropertyResult,
  PortfolioResult,
} from '@/src/types/investment'

/**
 * STANDARDIZED CONTRACT:
 * 
 * property.valorUf MUST ALWAYS represent the TOTAL property value in UF (100%).
 * 
 * The financed UF amount MUST ALWAYS be derived from valorUf and porcentajeFinanciamiento:
 *   montoFinanciadoUf = valorUf * porcentajeFinanciamiento
 * 
 * ALL calculations (except dividendo) use valorUf (100%).
 * Only dividendo uses the financed UF (montoFinanciadoUf).
 */

/**
 * Gets the total property value in UF (100%)
 * 
 * STANDARDIZED: valorUf is ALWAYS the total property value (100% UF).
 * No inference or normalization needed.
 */
export function getValorUfTotal(input: PropertyInput): number {
  // valorUf is always the total property value (100% UF)
  return input.valorUf
}

/**
 * Gets the financed amount in UF (valorUf × porcentajeFinanciamiento)
 * 
 * STANDARDIZED: valorUf is the total, so financed = valorUf * porcentajeFinanciamiento
 */
export function getValorFinanciadoUf(input: PropertyInput): number {
  // valorUf is always total, so financed amount = valorUf * porcentajeFinanciamiento
  return input.valorUf * input.porcentajeFinanciamiento
}

/**
 * Gets the total property value in CLP (valorUf × ufActual)
 * 
 * STANDARDIZED: valorUf is the total, so CLP = valorUf * ufActual
 */
export function getValorClp(
  input: PropertyInput,
  assumptions: GlobalAssumptions
): number {
  // valorUf is always total, so CLP = valorUf * ufActual
  return input.valorUf * assumptions.ufActual
}

/**
 * Calcula el dividendo mensual (PMT) para un crédito hipotecario
 */
export function calcularDividendo(
  assumptions: GlobalAssumptions,
  montoFinanciadoUf: number
): { dividendoUf: number; dividendoClp: number } {
  // Excel-style: tasaAnual is treated as NOMINAL annual rate
  // Monthly rate = tasaAnual / 12 (NOT effective rate)
  const tasaMensual = assumptions.tasaAnual / 12
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
 * STANDARDIZED: All calculations use valorUf (100% UF), NOT the financed amount.
 * Only dividendo uses the financed UF (montoFinanciadoUf).
 */
export function calcularPropertyResult(
  assumptions: GlobalAssumptions,
  input: PropertyInput
): PropertyResult {
  // 1) Total UF value - STANDARDIZED: valorUf is always the total (100%)
  const valorUfTotal = input.valorUf
  
  // 2) Valores base - ALL use valorUfTotal (100%)
  const valorClp = valorUfTotal * assumptions.ufActual
  const pieTeoricoClp = valorClp * assumptions.porcentajePieTeorico

  // 3) Financed amounts - ONLY used for dividendo
  // STANDARDIZED: montoFinanciadoUf = valorUf * porcentajeFinanciamiento
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

  // Gastos mensuales base: dividendo + gasto común + otros gastos (si existen)
  // Nota: otrosGastosMensualesClp puede ser 0 si no hay otros gastos
  const otrosGastosClp = input.otrosGastosMensualesClp || 0
  const gastosBaseSinPieClp =
    dividendoClp + input.gastoComunClp + otrosGastosClp

  const gastosMensualesSinPieClp = gastosBaseSinPieClp
  const gastosMensualesConPieClp = gastosBaseSinPieClp + cuotaPieMensualClp

  // Delta mensual = Ingresos - Gastos
  // Delta positivo = flujo positivo (ganancia mensual)
  // Delta negativo = flujo negativo (pérdida mensual)
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

