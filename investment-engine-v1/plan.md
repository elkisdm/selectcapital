1) Motor de cálculo — interfaces TypeScript + pseudocódigo

La idea: módulo puro, sin React, que reciba GlobalAssumptions + PropertyInput[] y devuelva métricas listas para mostrar.

1.1. Tipos base
// Supuestos globales del simulador
export interface GlobalAssumptions {
  ufActual: number;                 // CLP por UF
  tasaAnual: number;                // ej: 0.045 para 4,5%
  plazoAnios: number;               // ej: 30
  plusvaliaAnio1: number;           // ej: 0.054
  plusvaliaDesdeAnio2: number;      // ej: 0.05
  porcentajePieTeorico: number;     // ej: 0.10  -> 10%
  porcentajeBonoPie: number;        // ej: 0.10  -> 10% de pie bonificado
  mesesPieEnCuotas: number;         // ej: 48
  porcentajeGastosBanco: number;    // ej: 0.01  -> 1% valor escritura
  ivaPorcentaje: number;            // ej: 0.19
  ivaFactorRecuperable: number;     // ej: 0.70  -> parte realmente recuperable
  horizonteAnios: number;           // ej: 4
}

// Inputs de cada propiedad
export interface PropertyInput {
  id: string;
  nombreProyecto: string;
  comuna: string;
  tipologia: string;              // "1D1B", "2D2B", etc.
  m2Totales: number;

  valorUf: number;                // valor a escriturar en UF
  porcentajeFinanciamiento: number; // 0.8, 0.9, etc.

  arriendoEstimadoClp: number;
  gastoComunClp: number;
  otrosGastosMensualesClp: number;

  reservaClp: number;
  abonosInicialesClp: number;

  costosMobiliarioClp: number;    // opcional (para IVA inversión)
  costosGestionClp: number;       // gestión CI, corretaje, etc.

  aplicaBonoPie: boolean;
  aplicaIvaInversion: boolean;
  mesesGraciaDelta: number;       // meses que quieres cubrir delta (escenario)
}


Resultados por propiedad:

export interface PropertyResult {
  input: PropertyInput;

  // Valores base
  valorClp: number;           // valorUf * ufActual
  pieTeoricoClp: number;      // valorClp * porcentajePieTeorico
  bonoPieClp: number;         // si aplicaBonoPie, pieTeoricoClp, si no 0

  montoFinanciadoUf: number;
  montoFinanciadoClp: number;
  gastosBancoClp: number;

  // Crédito
  dividendoUf: number;
  dividendoClp: number;

  // Pie en cuotas
  piePagadoClp: number;           // lo que realmente paga el cliente de pie
  pieRestanteClp: number;
  cuotaPieMensualClp: number;     // 0 si no aplica

  // Flujo mensual
  ingresoBrutoMensualClp: number; // arriendo
  gastosMensualesConPieClp: number;
  gastosMensualesSinPieClp: number;

  deltaMensualConPieClp: number;
  deltaMensualSinPieClp: number;

  // Inversión total
  inversionTotalPropiedadClp: number; // todo lo que sale del bolsillo

  // Rentabilidades
  rentabilidadBruta: number;                  // arriendo anual / valor propiedad
  rentabilidadNetaSobreValorConPie: number;   // flujo neto anual / valorClp
  rentabilidadNetaSobreInversionConPie: number; // flujo neto anual / inversión

  // Plusvalía y horizonte
  precioUfFuturo: number;
  precioClpFuturo: number;
  plusvaliaHorizonteClp: number;

  // IVA inversión
  ivaTotalClp: number;
  ivaRecuperableClp: number;

  // Ganancias acumuladas
  gananciaBonoPieClp: number;
  gananciaFlujoHorizonteClp: number;
  gananciaTotalClp: number;

  roiSobreInversion: number; // gananciaTotal / inversionTotalPropiedad
}


Resultado a nivel portafolio:

export interface PortfolioResult {
  properties: PropertyResult[];

  inversionTotalClp: number;
  gananciaTotalClp: number;
  roiTotal: number;

  deltaMensualConPieTotalClp: number;
  deltaMensualSinPieTotalClp: number;

  plusvaliaHorizonteTotalClp: number;
  bonoPieTotalClp: number;
  ivaTotalRecuperableClp: number;
}

1.2. Funciones principales (pseudocódigo)
a) calcularDividendo
function calcularDividendo(
  assumptions: GlobalAssumptions,
  montoFinanciadoUf: number
): { dividendoUf: number; dividendoClp: number } {
  // Excel-style: tasaAnual is treated as NOMINAL annual rate
  // Monthly rate = tasaAnual / 12 (NOT effective rate)
  const tasaMensual = assumptions.tasaAnual / 12;
  const nMeses = assumptions.plazoAnios * 12;

  if (tasaMensual <= 0 || nMeses <= 0 || montoFinanciadoUf <= 0) {
    return { dividendoUf: 0, dividendoClp: 0 };
  }

  // Fórmula PMT clásica (sin signo negativo en el retorno)
  const dividendoUf =
    (montoFinanciadoUf * tasaMensual) /
    (1 - Math.pow(1 + tasaMensual, -nMeses));

  const dividendoClp = dividendoUf * assumptions.ufActual;

  return { dividendoUf, dividendoClp };
}

b) calcularPlusvalia
function calcularPlusvalia(
  assumptions: GlobalAssumptions,
  valorUfInicial: number
): {
  precioUfFuturo: number;
  precioClpFuturo: number;
  plusvaliaHorizonteClp: number;
} {
  let precioUf = valorUfInicial;

  for (let anio = 1; anio <= assumptions.horizonteAnios; anio++) {
    const factor =
      anio === 1
        ? 1 + assumptions.plusvaliaAnio1
        : 1 + assumptions.plusvaliaDesdeAnio2;

    precioUf = precioUf * factor;
  }

  const precioClpFuturo = precioUf * assumptions.ufActual;
  const valorClpInicial = valorUfInicial * assumptions.ufActual;
  const plusvaliaHorizonteClp = precioClpFuturo - valorClpInicial;

  return { precioUfFuturo: precioUf, precioClpFuturo, plusvaliaHorizonteClp };
}

c) calcularInversionTotalPropiedad
function calcularInversionTotalPropiedad(
  assumptions: GlobalAssumptions,
  input: PropertyInput,
  valorClp: number,
  gastosBancoClp: number,
  piePagadoClp: number
): number {
  const inversion =
    input.reservaClp +
    input.abonosInicialesClp +
    piePagadoClp +
    gastosBancoClp +
    input.costosMobiliarioClp +
    input.costosGestionClp;

  // Podrías añadir otros conceptos si aparecen proyectos más complejos.
  return Math.max(inversion, 0);
}

d) calcularPropertyResult
function calcularPropertyResult(
  assumptions: GlobalAssumptions,
  input: PropertyInput
): PropertyResult {
  // 1) Valores base
  const valorClp = input.valorUf * assumptions.ufActual;
  const pieTeoricoClp = valorClp * assumptions.porcentajePieTeorico;

  const montoFinanciadoUf =
    input.valorUf * input.porcentajeFinanciamiento;
  const montoFinanciadoClp = montoFinanciadoUf * assumptions.ufActual;

  const gastosBancoClp = valorClp * assumptions.porcentajeGastosBanco;

  // 2) Bono pie
  const bonoPieClp = input.aplicaBonoPie ? pieTeoricoClp : 0;

  // 3) Pie pagado y cuota mensual de pie
  const pieRestanteClp = Math.max(
    pieTeoricoClp - input.reservaClp - input.abonosInicialesClp - bonoPieClp,
    0
  );

  const cuotaPieMensualClp =
    assumptions.mesesPieEnCuotas > 0
      ? pieRestanteClp / assumptions.mesesPieEnCuotas
      : 0;

  const piePagadoClp = pieRestanteClp + input.reservaClp + input.abonosInicialesClp;

  // 4) Crédito / dividendo
  const { dividendoUf, dividendoClp } = calcularDividendo(
    assumptions,
    montoFinanciadoUf
  );

  // 5) Flujos mensuales
  const ingresoBrutoMensualClp = input.arriendoEstimadoClp;

  const gastosBaseSinPieClp =
    dividendoClp + input.gastoComunClp + input.otrosGastosMensualesClp;

  const gastosMensualesSinPieClp = gastosBaseSinPieClp;
  const gastosMensualesConPieClp = gastosBaseSinPieClp + cuotaPieMensualClp;

  const deltaMensualSinPieClp =
    ingresoBrutoMensualClp - gastosMensualesSinPieClp;
  const deltaMensualConPieClp =
    ingresoBrutoMensualClp - gastosMensualesConPieClp;

  // 6) Inversión total
  const inversionTotalPropiedadClp = calcularInversionTotalPropiedad(
    assumptions,
    input,
    valorClp,
    gastosBancoClp,
    piePagadoClp
  );

  // 7) Rentabilidades
  const flujoNetoAnualConPieClp = deltaMensualConPieClp * 12;

  const rentabilidadBruta =
    valorClp > 0 ? (input.arriendoEstimadoClp * 12) / valorClp : 0;

  const rentabilidadNetaSobreValorConPie =
    valorClp > 0 ? flujoNetoAnualConPieClp / valorClp : 0;

  const rentabilidadNetaSobreInversionConPie =
    inversionTotalPropiedadClp > 0
      ? flujoNetoAnualConPieClp / inversionTotalPropiedadClp
      : 0;

  // 8) Plusvalía
  const {
    precioUfFuturo,
    precioClpFuturo,
    plusvaliaHorizonteClp,
  } = calcularPlusvalia(assumptions, input.valorUf);

  // 9) IVA inversión
  let ivaTotalClp = 0;
  let ivaRecuperableClp = 0;

  if (input.aplicaIvaInversion) {
    const baseIvaClp = valorClp; // simplificación
    ivaTotalClp = baseIvaClp * assumptions.ivaPorcentaje;
    ivaRecuperableClp = ivaTotalClp * assumptions.ivaFactorRecuperable;
  }

  // 10) Ganancias
  const gananciaBonoPieClp = bonoPieClp;
  const gananciaFlujoHorizonteClp =
    deltaMensualConPieClp * 12 * assumptions.horizonteAnios;

  const gananciaTotalClp =
    plusvaliaHorizonteClp +
    gananciaBonoPieClp +
    ivaRecuperableClp +
    gananciaFlujoHorizonteClp;

  const roiSobreInversion =
    inversionTotalPropiedadClp > 0
      ? gananciaTotalClp / inversionTotalPropiedadClp
      : 0;

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
    gananciaTotalClp,
    roiSobreInversion,
  };
}

e) calcularPortfolioResult
function calcularPortfolioResult(
  assumptions: GlobalAssumptions,
  properties: PropertyInput[]
): PortfolioResult {
  const propertyResults = properties.map((p) =>
    calcularPropertyResult(assumptions, p)
  );

  let inversionTotalClp = 0;
  let gananciaTotalClp = 0;
  let deltaMensualConPieTotalClp = 0;
  let deltaMensualSinPieTotalClp = 0;
  let plusvaliaHorizonteTotalClp = 0;
  let bonoPieTotalClp = 0;
  let ivaTotalRecuperableClp = 0;

  for (const r of propertyResults) {
    inversionTotalClp += r.inversionTotalPropiedadClp;
    gananciaTotalClp += r.gananciaTotalClp;
    deltaMensualConPieTotalClp += r.deltaMensualConPieClp;
    deltaMensualSinPieTotalClp += r.deltaMensualSinPieClp;
    plusvaliaHorizonteTotalClp += r.plusvaliaHorizonteClp;
    bonoPieTotalClp += r.gananciaBonoPieClp;
    ivaTotalRecuperableClp += r.ivaRecuperableClp;
  }

  const roiTotal =
    inversionTotalClp > 0 ? gananciaTotalClp / inversionTotalClp : 0;

  return {
    properties: propertyResults,
    inversionTotalClp,
    gananciaTotalClp,
    roiTotal,
    deltaMensualConPieTotalClp,
    deltaMensualSinPieTotalClp,
    plusvaliaHorizonteTotalClp,
    bonoPieTotalClp,
    ivaTotalRecuperableClp,
  };
}


Con esto tienes el core matemático bien definido.

2) Prompt para Cursor (para implementar todo esto)


Eres un senior full-stack developer trabajando en Cursor.

Vamos a construir una calculadora de inversión inmobiliaria para un proyecto llamado “Select Capital Calculator”.

### Stack objetivo

- Frontend: React + TypeScript (Vite o Next.js, tú eliges, pero usa App Router si usas Next).
- Estilos: TailwindCSS, mobile-first.
- Sin backend en el MVP: toda la lógica de cálculo corre en el cliente.
- Arquitectura limpia: motor de cálculo aislado en un módulo puro de TypeScript con tests.

---

## 1. Estructura de archivos

Crea algo equivalente a:

- `src/types/investment.ts`
- `src/lib/investmentCalculator.ts`
- `src/components/GlobalAssumptionsForm.tsx`
- `src/components/PropertyForm.tsx`
- `src/components/PropertyList.tsx`
- `src/components/PropertyCard.tsx`
- `src/components/PortfolioSummary.tsx`
- `src/pages` o `src/app` según framework, con una página principal `CalculatorPage`.

---

## 2. Modelos de datos (copiar literal)

En `src/types/investment.ts` define estos tipos:

```ts
export interface GlobalAssumptions {
  ufActual: number;
  tasaAnual: number;
  plazoAnios: number;
  plusvaliaAnio1: number;
  plusvaliaDesdeAnio2: number;
  porcentajePieTeorico: number;
  porcentajeBonoPie: number;
  mesesPieEnCuotas: number;
  porcentajeGastosBanco: number;
  ivaPorcentaje: number;
  ivaFactorRecuperable: number;
  horizonteAnios: number;
}

export interface PropertyInput {
  id: string;
  nombreProyecto: string;
  comuna: string;
  tipologia: string;
  m2Totales: number;
  valorUf: number;
  porcentajeFinanciamiento: number;
  arriendoEstimadoClp: number;
  gastoComunClp: number;
  otrosGastosMensualesClp: number;
  reservaClp: number;
  abonosInicialesClp: number;
  costosMobiliarioClp: number;
  costosGestionClp: number;
  aplicaBonoPie: boolean;
  aplicaIvaInversion: boolean;
  mesesGraciaDelta: number;
}

export interface PropertyResult {
  input: PropertyInput;
  valorClp: number;
  pieTeoricoClp: number;
  bonoPieClp: number;
  montoFinanciadoUf: number;
  montoFinanciadoClp: number;
  gastosBancoClp: number;
  dividendoUf: number;
  dividendoClp: number;
  piePagadoClp: number;
  pieRestanteClp: number;
  cuotaPieMensualClp: number;
  ingresoBrutoMensualClp: number;
  gastosMensualesConPieClp: number;
  gastosMensualesSinPieClp: number;
  deltaMensualConPieClp: number;
  deltaMensualSinPieClp: number;
  inversionTotalPropiedadClp: number;
  rentabilidadBruta: number;
  rentabilidadNetaSobreValorConPie: number;
  rentabilidadNetaSobreInversionConPie: number;
  precioUfFuturo: number;
  precioClpFuturo: number;
  plusvaliaHorizonteClp: number;
  ivaTotalClp: number;
  ivaRecuperableClp: number;
  gananciaBonoPieClp: number;
  gananciaFlujoHorizonteClp: number;
  gananciaTotalClp: number;
  roiSobreInversion: number;
}

export interface PortfolioResult {
  properties: PropertyResult[];
  inversionTotalClp: number;
  gananciaTotalClp: number;
  roiTotal: number;
  deltaMensualConPieTotalClp: number;
  deltaMensualSinPieTotalClp: number;
  plusvaliaHorizonteTotalClp: number;
  bonoPieTotalClp: number;
  ivaTotalRecuperableClp: number;
}

3. Motor de cálculo

En src/lib/investmentCalculator.ts implementa funciones puras:

calcularDividendo(assumptions, montoFinanciadoUf)

calcularPlusvalia(assumptions, valorUfInicial)

calcularInversionTotalPropiedad(...)

calcularPropertyResult(assumptions, input)

calcularPortfolioResult(assumptions, properties)

Sigue este pseudocódigo y conviértelo a TypeScript real:

calcularDividendo:

// Excel-style: tasaAnual is treated as NOMINAL annual rate
tasaMensual = tasaAnual / 12

nMeses = plazoAnios * 12

Fórmula PMT:

dividendoUf = (montoFinanciadoUf * tasaMensual) / (1 - (1 + tasaMensual)^(-nMeses))

dividendoClp = dividendoUf * ufActual

calcularPlusvalia:

Partir de precioUf = valorUfInicial.

Para cada año hasta horizonteAnios:

Año 1 → multiplicar por (1 + plusvaliaAnio1)

Años siguientes → multiplicar por (1 + plusvaliaDesdeAnio2).

precioClpFuturo = precioUf * ufActual

valorClpInicial = valorUfInicial * ufActual

plusvaliaHorizonteClp = precioClpFuturo - valorClpInicial

En calcularPropertyResult implementa exactamente la lógica siguiente:

valorClp = valorUf * ufActual

pieTeoricoClp = valorClp * porcentajePieTeorico

montoFinanciadoUf = valorUf * porcentajeFinanciamiento

montoFinanciadoClp = montoFinanciadoUf * ufActual

gastosBancoClp = valorClp * porcentajeGastosBanco

bonoPieClp = aplicaBonoPie ? pieTeoricoClp : 0

pieRestanteClp = max(pieTeoricoClp - reservaClp - abonosInicialesClp - bonoPieClp, 0)

cuotaPieMensualClp = mesesPieEnCuotas > 0 ? pieRestanteClp / mesesPieEnCuotas : 0

piePagadoClp = pieRestanteClp + reservaClp + abonosInicialesClp

Usa calcularDividendo para obtener dividendoUf, dividendoClp.

Calcula flujos mensuales:

ingresoBrutoMensualClp = arriendoEstimadoClp

gastosBaseSinPieClp = dividendoClp + gastoComunClp + otrosGastosMensualesClp

gastosMensualesSinPieClp = gastosBaseSinPieClp

gastosMensualesConPieClp = gastosBaseSinPieClp + cuotaPieMensualClp

deltaMensualSinPieClp = ingresoBrutoMensualClp - gastosMensualesSinPieClp

deltaMensualConPieClp = ingresoBrutoMensualClp - gastosMensualesConPieClp

Inversión total:

inversionTotalPropiedadClp = reserva + abonosIniciales + piePagadoClp + gastosBancoClp + costosMobiliarioClp + costosGestionClp

Rentabilidades:

flujoNetoAnualConPieClp = deltaMensualConPieClp * 12

rentabilidadBruta = (arriendoEstimadoClp * 12) / valorClp

rentabilidadNetaSobreValorConPie = flujoNetoAnualConPieClp / valorClp

rentabilidadNetaSobreInversionConPie = flujoNetoAnualConPieClp / inversionTotalPropiedadClp

Plusvalía:

Usa calcularPlusvalia para obtener precioUfFuturo, precioClpFuturo, plusvaliaHorizonteClp.

IVA inversión:

Si aplicaIvaInversion:

ivaTotalClp = valorClp * ivaPorcentaje

ivaRecuperableClp = ivaTotalClp * ivaFactorRecuperable

Si no, ambos 0.

Ganancias:

gananciaBonoPieClp = bonoPieClp

gananciaFlujoHorizonteClp = deltaMensualConPieClp * 12 * horizonteAnios

gananciaTotalClp = plusvaliaHorizonteClp + gananciaBonoPieClp + ivaRecuperableClp + gananciaFlujoHorizonteClp

roiSobreInversion = gananciaTotalClp / inversionTotalPropiedadClp

Devuelve un PropertyResult con todos estos valores rellenados.

calcularPortfolioResult:

Mapear properties → PropertyResult[].

Acumular:

inversionTotalClp = suma de inversionTotalPropiedadClp.

gananciaTotalClp = suma de gananciaTotalClp.

deltaMensualConPieTotalClp = suma de deltaMensualConPieClp.

deltaMensualSinPieTotalClp = suma de deltaMensualSinPieClp.

plusvaliaHorizonteTotalClp = suma de plusvaliaHorizonteClp.

bonoPieTotalClp = suma de gananciaBonoPieClp.

ivaTotalRecuperableClp = suma de ivaRecuperableClp.

roiTotal = gananciaTotalClp / inversionTotalClp.

Añade tests unitarios básicos en un archivo src/lib/investmentCalculator.test.ts usando Vitest o Jest.

4. UI (MVP)

GlobalAssumptionsForm:

Formulario simple con inputs numéricos para todos los campos de GlobalAssumptions.

PropertyForm:

Form para crear/editar PropertyInput (sin todos los campos avanzados al inicio si es mucho).

PropertyList:

Lista editable de propiedades con botón “Añadir propiedad”.

PropertyCard:

Muestra datos clave de PropertyResult:

Nombre, comuna, valor, dividendo, delta mensual, inversión, ROI, plusvalía, bono pie, IVA.

PortfolioSummary:

Muestra inversionTotalClp, gananciaTotalClp, roiTotal, deltaMensualConPieTotalClp.

Cada vez que cambie un input, recalcula usando las funciones del motor y refresca las vistas.

Estilo: Tailwind, mobile-first, cards con bordes redondeados, tipografía limpia, usar colores suaves y usar verde/rojo solo para números de flujo/ROI.