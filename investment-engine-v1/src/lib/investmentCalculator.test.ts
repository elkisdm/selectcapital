import { describe, it, expect } from 'vitest'
import {
  calcularDividendo,
  calcularPlusvalia,
  calcularInversionTotalPropiedad,
  calcularPropertyResult,
  calcularPortfolioResult,
} from './investmentCalculator'
import type { GlobalAssumptions, PropertyInput } from '@/src/types/investment'

describe('calcularDividendo', () => {
  const assumptions: GlobalAssumptions = {
    ufActual: 40000,
    tasaAnual: 0.045, // 4.5%
    plazoAnios: 30,
    plusvaliaAnio1: 0.054,
    plusvaliaDesdeAnio2: 0.05,
    porcentajePieTeorico: 0.10,
    porcentajeBonoPie: 0.10,
    mesesPieEnCuotas: 48,
    porcentajeGastosBanco: 0.01,
    ivaPorcentaje: 0.19,
    ivaFactorRecuperable: 0.70,
    horizonteAnios: 4,
  }

  it('debe calcular dividendo correctamente para un monto válido', () => {
    const montoFinanciadoUf = 2000 // 2000 UF
    const result = calcularDividendo(assumptions, montoFinanciadoUf)

    expect(result.dividendoUf).toBeGreaterThan(0)
    expect(result.dividendoClp).toBe(result.dividendoUf * assumptions.ufActual)
  })

  it('debe retornar 0 para monto inválido', () => {
    const result = calcularDividendo(assumptions, 0)
    expect(result.dividendoUf).toBe(0)
    expect(result.dividendoClp).toBe(0)
  })

  it('debe retornar 0 para monto negativo', () => {
    const result = calcularDividendo(assumptions, -100)
    expect(result.dividendoUf).toBe(0)
    expect(result.dividendoClp).toBe(0)
  })
})

describe('calcularPlusvalia', () => {
  const assumptions: GlobalAssumptions = {
    ufActual: 40000,
    tasaAnual: 0.045,
    plazoAnios: 30,
    plusvaliaAnio1: 0.054, // 5.4% año 1
    plusvaliaDesdeAnio2: 0.05, // 5% años siguientes
    porcentajePieTeorico: 0.10,
    porcentajeBonoPie: 0.10,
    mesesPieEnCuotas: 48,
    porcentajeGastosBanco: 0.01,
    ivaPorcentaje: 0.19,
    ivaFactorRecuperable: 0.70,
    horizonteAnios: 4,
  }

  it('debe calcular plusvalía para 1 año', () => {
    const valorUfInicial = 2000
    const result = calcularPlusvalia(assumptions, valorUfInicial)

    const precioEsperado = valorUfInicial * (1 + assumptions.plusvaliaAnio1)
    expect(result.precioUfFuturo).toBeCloseTo(precioEsperado, 2)
    expect(result.plusvaliaHorizonteClp).toBeGreaterThan(0)
  })

  it('debe calcular plusvalía para múltiples años', () => {
    const assumptions4Anios: GlobalAssumptions = {
      ...assumptions,
      horizonteAnios: 4,
    }
    const valorUfInicial = 2000
    const result = calcularPlusvalia(assumptions4Anios, valorUfInicial)

    // Año 1: 2000 * 1.054 = 2108
    // Año 2: 2108 * 1.05 = 2213.4
    // Año 3: 2213.4 * 1.05 = 2324.07
    // Año 4: 2324.07 * 1.05 = 2440.27
    expect(result.precioUfFuturo).toBeCloseTo(2440.27, 0)
    expect(result.plusvaliaHorizonteClp).toBeGreaterThan(0)
  })
})

describe('calcularInversionTotalPropiedad', () => {
  const assumptions: GlobalAssumptions = {
    ufActual: 40000,
    tasaAnual: 0.045,
    plazoAnios: 30,
    plusvaliaAnio1: 0.054,
    plusvaliaDesdeAnio2: 0.05,
    porcentajePieTeorico: 0.10,
    porcentajeBonoPie: 0.10,
    mesesPieEnCuotas: 48,
    porcentajeGastosBanco: 0.01,
    ivaPorcentaje: 0.19,
    ivaFactorRecuperable: 0.70,
    horizonteAnios: 4,
  }

  const input: PropertyInput = {
    id: 'test-1',
    nombreProyecto: 'Test',
    comuna: 'Santiago',
    tipologia: '2D2B',
    m2Totales: 60,
    valorUf: 2000,
    porcentajeFinanciamiento: 0.8,
    arriendoEstimadoClp: 500000,
    gastoComunClp: 100000,
    otrosGastosMensualesClp: 50000,
    reservaClp: 1000000,
    abonosInicialesClp: 2000000,
    costosMobiliarioClp: 500000,
    costosGestionClp: 300000,
    aplicaBonoPie: false,
    aplicaIvaInversion: false,
    mesesGraciaDelta: 0,
  }

  it('debe calcular inversión total correctamente', () => {
    const valorClp = 80000000
    const gastosBancoClp = 800000
    const piePagadoClp = 8000000

    const result = calcularInversionTotalPropiedad(
      assumptions,
      input,
      valorClp,
      gastosBancoClp,
      piePagadoClp
    )

    const esperado =
      input.reservaClp +
      input.abonosInicialesClp +
      piePagadoClp +
      gastosBancoClp +
      input.costosMobiliarioClp +
      input.costosGestionClp

    expect(result).toBe(esperado)
  })
})

describe('calcularPropertyResult', () => {
  const assumptions: GlobalAssumptions = {
    ufActual: 40000,
    tasaAnual: 0.045,
    plazoAnios: 30,
    plusvaliaAnio1: 0.054,
    plusvaliaDesdeAnio2: 0.05,
    porcentajePieTeorico: 0.10,
    porcentajeBonoPie: 0.10,
    mesesPieEnCuotas: 48,
    porcentajeGastosBanco: 0.01,
    ivaPorcentaje: 0.19,
    ivaFactorRecuperable: 0.70,
    horizonteAnios: 4,
  }

  it('debe calcular resultado completo sin bono pie ni IVA', () => {
    const input: PropertyInput = {
      id: 'test-1',
      nombreProyecto: 'Test Propiedad',
      comuna: 'Santiago',
      tipologia: '2D2B',
      m2Totales: 60,
      valorUf: 2000,
      porcentajeFinanciamiento: 0.8,
      arriendoEstimadoClp: 500000,
      gastoComunClp: 100000,
      otrosGastosMensualesClp: 50000,
      reservaClp: 1000000,
      abonosInicialesClp: 2000000,
      costosMobiliarioClp: 0,
      costosGestionClp: 300000,
      aplicaBonoPie: false,
      aplicaIvaInversion: false,
      mesesGraciaDelta: 0,
    }

    const result = calcularPropertyResult(assumptions, input)

    expect(result.valorClp).toBe(2000 * 40000)
    expect(result.bonoPieClp).toBe(0)
    expect(result.ivaTotalClp).toBe(0)
    expect(result.ivaRecuperableClp).toBe(0)
    expect(result.dividendoClp).toBeGreaterThan(0)
    expect(result.deltaMensualConPieClp).toBeDefined()
    expect(result.roiSobreInversion).toBeDefined()
  })

  it('debe calcular resultado con bono pie y IVA', () => {
    const input: PropertyInput = {
      id: 'test-2',
      nombreProyecto: 'Test Propiedad 2',
      comuna: 'Las Condes',
      tipologia: '1D1B',
      m2Totales: 45,
      valorUf: 1500,
      porcentajeFinanciamiento: 0.9,
      arriendoEstimadoClp: 400000,
      gastoComunClp: 80000,
      otrosGastosMensualesClp: 40000,
      reservaClp: 500000,
      abonosInicialesClp: 1000000,
      costosMobiliarioClp: 500000,
      costosGestionClp: 200000,
      aplicaBonoPie: true,
      aplicaIvaInversion: true,
      mesesGraciaDelta: 0,
    }

    const result = calcularPropertyResult(assumptions, input)

    expect(result.bonoPieClp).toBeGreaterThan(0)
    expect(result.ivaTotalClp).toBeGreaterThan(0)
    expect(result.ivaRecuperableClp).toBeGreaterThan(0)
    expect(result.gananciaBonoPieClp).toBe(result.bonoPieClp)
  })
})

describe('calcularPortfolioResult', () => {
  const assumptions: GlobalAssumptions = {
    ufActual: 40000,
    tasaAnual: 0.045,
    plazoAnios: 30,
    plusvaliaAnio1: 0.054,
    plusvaliaDesdeAnio2: 0.05,
    porcentajePieTeorico: 0.10,
    porcentajeBonoPie: 0.10,
    mesesPieEnCuotas: 48,
    porcentajeGastosBanco: 0.01,
    ivaPorcentaje: 0.19,
    ivaFactorRecuperable: 0.70,
    horizonteAnios: 4,
  }

  it('debe calcular portafolio con múltiples propiedades', () => {
    const properties: PropertyInput[] = [
      {
        id: 'prop-1',
        nombreProyecto: 'Propiedad 1',
        comuna: 'Santiago',
        tipologia: '2D2B',
        m2Totales: 60,
        valorUf: 2000,
        porcentajeFinanciamiento: 0.8,
        arriendoEstimadoClp: 500000,
        gastoComunClp: 100000,
        otrosGastosMensualesClp: 50000,
        reservaClp: 1000000,
        abonosInicialesClp: 2000000,
        costosMobiliarioClp: 0,
        costosGestionClp: 300000,
        aplicaBonoPie: false,
        aplicaIvaInversion: false,
        mesesGraciaDelta: 0,
      },
      {
        id: 'prop-2',
        nombreProyecto: 'Propiedad 2',
        comuna: 'Las Condes',
        tipologia: '1D1B',
        m2Totales: 45,
        valorUf: 1500,
        porcentajeFinanciamiento: 0.9,
        arriendoEstimadoClp: 400000,
        gastoComunClp: 80000,
        otrosGastosMensualesClp: 40000,
        reservaClp: 500000,
        abonosInicialesClp: 1000000,
        costosMobiliarioClp: 500000,
        costosGestionClp: 200000,
        aplicaBonoPie: true,
        aplicaIvaInversion: true,
        mesesGraciaDelta: 0,
      },
    ]

    const result = calcularPortfolioResult(assumptions, properties)

    expect(result.properties).toHaveLength(2)
    expect(result.inversionTotalClp).toBeGreaterThan(0)
    expect(result.gananciaTotalClp).toBeGreaterThan(0)
    expect(result.roiTotal).toBeDefined()
    expect(result.deltaMensualConPieTotalClp).toBeDefined()
  })

  it('debe manejar portafolio vacío', () => {
    const result = calcularPortfolioResult(assumptions, [])

    expect(result.properties).toHaveLength(0)
    expect(result.inversionTotalClp).toBe(0)
    expect(result.gananciaTotalClp).toBe(0)
    expect(result.roiTotal).toBe(0)
  })
})

