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

  // IMPORTANT: valorUf can be EITHER:
  // A) Total property value (100% UF) - when valorUfTotal is provided or valorUf is clearly total
  // B) Financed value (80/85/90% UF) - when valorUf is the credit amount
  // The engine will auto-detect and normalize to valorUfTotal
  valorUf: number;                // valor a escriturar en UF (may be total or financed)
  valorUfTotal?: number;          // Optional: explicitly provide total UF (100%)
  valorFinanciadoUf?: number;     // Optional: explicitly provide financed UF
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

// Resultados por propiedad
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
  gananciaBrutaClp: number; // plusvaliaHorizonteClp + bonoPieClp
  gananciaNetaClp: number; // plusvaliaHorizonteClp + bonoPieClp + gananciaFlujoHorizonteClp
  gananciaTotalClp: number; // plusvaliaHorizonteClp + bonoPieClp + gananciaFlujoHorizonteClp + ivaRecuperableClp

  roiSobreInversion: number; // gananciaTotal / inversionTotalPropiedad
}

// Resultado a nivel portafolio
export interface PortfolioResult {
  properties: PropertyResult[];

  inversionTotalClp: number;
  gananciaBrutaTotalClp: number;
  gananciaNetaTotalClp: number;
  gananciaTotalClp: number;
  roiTotal: number;

  deltaMensualConPieTotalClp: number;
  deltaMensualSinPieTotalClp: number;

  plusvaliaHorizonteTotalClp: number;
  bonoPieTotalClp: number;
  ivaTotalRecuperableClp: number;
}

