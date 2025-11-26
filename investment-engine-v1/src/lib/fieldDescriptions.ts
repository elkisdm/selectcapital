/**
 * Descripciones detalladas para tooltips de cada campo
 */

export interface FieldDescription {
  title: string
  description: string
  example?: string
  note?: string
}

export function getFieldDescription(fieldId: string): FieldDescription | undefined {
  const descriptions: Record<string, FieldDescription> = {
    ufActual: {
      title: 'UF Actual',
      description: 'Valor actual de la Unidad de Fomento (UF) en pesos chilenos. Este valor se actualiza automáticamente desde la API, pero puedes ajustarlo manualmente si es necesario.',
      example: 'Ejemplo: 39.643',
      note: 'Se actualiza automáticamente al cargar la página',
    },
    tasaAnual: {
      title: 'Tasa Anual de Interés',
      description: 'Tasa de interés anual del crédito hipotecario expresada como porcentaje. Esta tasa se aplica al monto financiado de todas las propiedades.',
      example: 'Ejemplo: 4.5% (tasa típica: 4% - 6%)',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    plazoAnios: {
      title: 'Plazo del Crédito',
      description: 'Número de años de duración del crédito hipotecario. Afecta el monto de la cuota mensual y el total de intereses pagados.',
      example: 'Ejemplo: 30 años (típico: 20 - 30 años)',
    },
    plusvaliaAnio1: {
      title: 'Plusvalía Año 1',
      description: 'Aumento porcentual esperado del valor de la propiedad durante el primer año. Suele ser mayor que los años siguientes debido a la entrega y valorización inicial.',
      example: 'Ejemplo: 5.4% (típico: 3% - 7%)',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    plusvaliaDesdeAnio2: {
      title: 'Plusvalía Años 2+',
      description: 'Aumento porcentual anual esperado del valor de la propiedad desde el segundo año en adelante. Se aplica de forma compuesta cada año.',
      example: 'Ejemplo: 5.0% (típico: 3% - 6%)',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    porcentajePieTeorico: {
      title: 'Porcentaje Pie Teórico',
      description: 'Porcentaje del valor de la propiedad que debes pagar como pie inicial. Este monto se descuenta del valor total antes de calcular el crédito.',
      example: 'Ejemplo: 10% (típico: 10% - 20%)',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    porcentajeBonoPie: {
      title: 'Porcentaje Bono Pie',
      description: 'Porcentaje del valor de la propiedad que recibirás como bono o subsidio estatal (DS19, DS1, etc.). Este monto reduce el pie que debes pagar de tu bolsillo.',
      example: 'Ejemplo: 10% (típico: 5% - 15%)',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    mesesPieEnCuotas: {
      title: 'Meses Pie en Cuotas',
      description: 'Número de meses en que puedes pagar el pie restante (después del bono) en cuotas antes de la entrega. Si es 0, el pie se paga de contado.',
      example: 'Ejemplo: 48 meses (típico: 24 - 48 meses)',
    },
    porcentajeGastosBanco: {
      title: 'Porcentaje Gastos Banco',
      description: 'Porcentaje del crédito que representa los gastos operacionales del banco (comisiones, seguros, etc.). Se calcula sobre el monto del crédito.',
      example: 'Ejemplo: 1.0% (típico: 0.5% - 2%)',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    ivaPorcentaje: {
      title: 'IVA (%)',
      description: 'Porcentaje del Impuesto al Valor Agregado aplicable. En Chile, el IVA para propiedades nuevas es típicamente 19%.',
      example: 'Ejemplo: 19%',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    ivaFactorRecuperable: {
      title: 'Factor IVA Recuperable',
      description: 'Porcentaje del IVA que puedes recuperar como crédito fiscal. Depende de si la propiedad es para arriendo (recuperable) o uso personal.',
      example: 'Ejemplo: 70% (típico: 0% - 100%)',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    horizonteAnios: {
      title: 'Horizonte de Inversión',
      description: 'Número de años que planeas mantener la propiedad antes de venderla. Este valor determina el período de cálculo de rentabilidad.',
      example: 'Ejemplo: 4 años (típico: 3 - 7 años)',
    },
    // Campos de propiedades
    nombreProyecto: {
      title: 'Nombre del Proyecto',
      description: 'Nombre identificador del proyecto inmobiliario o desarrollo. Úsalo para distinguir entre diferentes propiedades en tu portafolio.',
      example: 'Ejemplo: "Torre Central", "Viva Marín"',
    },
    comuna: {
      title: 'Comuna',
      description: 'Comuna donde se ubica la propiedad. La ubicación afecta el valor, plusvalía esperada y potencial de arriendo.',
    },
    tipologia: {
      title: 'Tipología',
      description: 'Tipo de departamento según número de dormitorios y baños. La tipología influye en el precio y demanda de arriendo.',
      example: 'Ejemplo: Studio, 1D1B, 2D2B, etc.',
    },
    m2Totales: {
      title: 'Metros Cuadrados Totales',
      description: 'Superficie total de la propiedad en metros cuadrados. Incluye todos los espacios: dormitorios, baños, cocina, living, etc.',
      example: 'Ejemplo: 60 m² (típico: 40 - 100 m²)',
    },
    valorUf: {
      title: 'Valor en UF',
      description: 'Precio de venta de la propiedad expresado en Unidades de Fomento (UF). El valor en pesos se calcula multiplicando por la UF actual.',
      example: 'Ejemplo: 2000 UF (típico: 1,000 - 5,000 UF)',
      note: 'Puede tener hasta 2 decimales',
    },
    porcentajeFinanciamiento: {
      title: 'Porcentaje de Financiamiento',
      description: 'Porcentaje del valor de la propiedad que será financiado con crédito hipotecario. El resto se paga como pie.',
      example: 'Ejemplo: 80% (típico: 80% - 90%)',
      note: 'Se redondea automáticamente a 2 decimales',
    },
    arriendoEstimadoClp: {
      title: 'Arriendo Estimado',
      description: 'Ingreso mensual estimado por concepto de arriendo en pesos chilenos. Investiga arriendos similares en la zona para un cálculo preciso.',
      example: 'Ejemplo: $500.000 (típico: $300.000 - $1.500.000)',
      note: 'Se formatea automáticamente con separadores de miles',
    },
    gastoComunClp: {
      title: 'Gasto Común',
      description: 'Costo mensual del gasto común del edificio o condominio. Incluye mantención, seguridad, áreas comunes, etc.',
      example: 'Ejemplo: $100.000 (típico: $50.000 - $200.000)',
      note: 'Se formatea automáticamente con separadores de miles',
    },
    otrosGastosMensualesClp: {
      title: 'Otros Gastos Mensuales',
      description: 'Gastos adicionales mensuales como seguros, contribuciones, mantención, etc. Puede ser 0 si no aplica.',
      example: 'Ejemplo: $50.000',
      note: 'Se formatea automáticamente con separadores de miles',
    },
    reservaClp: {
      title: 'Reserva',
      description: 'Monto que debes pagar como reserva al momento de comprar la propiedad. Este monto se suma a los costos iniciales.',
      example: 'Ejemplo: $1.000.000',
      note: 'Se formatea automáticamente con separadores de miles',
    },
    abonosInicialesClp: {
      title: 'Abonos Iniciales',
      description: 'Pagos adicionales realizados antes de la entrega de la propiedad (abonos, cuotas de pie, etc.). Puede ser 0 si no aplica.',
      example: 'Ejemplo: $2.000.000',
      note: 'Se formatea automáticamente con separadores de miles',
    },
    costosMobiliarioClp: {
      title: 'Costos de Mobiliario',
      description: 'Inversión en mobiliario y equipamiento necesario para arrendar la propiedad. Puede ser 0 si la propiedad ya viene amoblada.',
      example: 'Ejemplo: $0 o $500.000',
      note: 'Se formatea automáticamente con separadores de miles',
    },
    costosGestionClp: {
      title: 'Costos de Gestión',
      description: 'Gastos asociados a la gestión y administración de la propiedad (corretaje, trámites, etc.).',
      example: 'Ejemplo: $300.000',
      note: 'Se formatea automáticamente con separadores de miles',
    },
    aplicaBonoPie: {
      title: 'Aplica Bono Pie',
      description: 'Indica si esta propiedad es elegible para recibir bono pie o subsidio estatal. Si está marcado, se aplicará el porcentaje de bono pie configurado en supuestos globales.',
    },
    aplicaIvaInversion: {
      title: 'Aplica IVA Inversión',
      description: 'Indica si esta propiedad está sujeta a IVA por ser nueva (primera venta). Si está marcado, se aplicará el IVA configurado en supuestos globales.',
    },
    mesesGraciaDelta: {
      title: 'Meses Gracia Delta',
      description: 'Número de meses adicionales de gracia (sin pagar cuota) para este escenario específico. Útil para simular diferentes situaciones.',
      example: 'Ejemplo: 0 meses (típico: 0 - 12 meses)',
    },
  }

  return descriptions[fieldId]
}

