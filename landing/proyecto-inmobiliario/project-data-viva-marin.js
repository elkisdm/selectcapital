export const PROJECT_CONFIG = {
  version: 'v1.0',
  project: {
    name: 'VIVA MARÍN',
    commune: 'Santiago Centro',
    stage: 'Lanzamiento',
    delivery: 'Mediados 2028',
    slug: 'viva-marin',
    currency: 'UF',
    ctaPrimary: 'Quiero mi propuesta',
    ctaSecondary: 'Descargar ficha PDF',
    heroVideo: null, // Skip video for now
    heroImageFallback: '/images/hero-viva-marin.jpg', // Placeholder
    leadWhatsappNumber: '56912345678',
  },
  financials: {
    ufValue: 36500,
    annualRate: 0.049,
    financingOptions: [0.9], // 90% financing for pie 10%
    defaultFinancing: 0.9,
    maxYears: 36,
    defaultYears: 36,
    defaultLoadPercent: 0.25,
    expensesPercent: 0.004,
    insurancePercent: 0.0015,
  },
  highlights: [
    { label: 'Desde UF', value: '2.350' },
    { label: 'Tipologías', value: 'Estudio · 1D · 2D' },
    { label: 'Entrega', value: 'Mediados 2028' },
    { label: 'Pie', value: '10% · 36 cuotas TOKU' },
    { label: 'Promoción', value: '10% + 5% descuento' },
  ],
  badges: [
    'Pie 10% en cuotas',
    'Promoción 10% + 5%',
    'Preaprobación bancaria',
    'Amenidades completas',
  ],
  typologies: [
    {
      id: 'estudio-d',
      name: 'Estudio (Tipo D)',
      areaM2: 28, // Approximate
      ufPrice: 2400, // Promedio ref
      downPaymentUF: 240, // 10% of 2400
      downPaymentInstallments: 36,
      rentCLP: 450000, // Approximate
      rentSource: 'Estimado mercado',
    },
    {
      id: '1d-b-c',
      name: '1D / 1B (Tipos B–C)',
      areaM2: 45, // Approximate
      ufPrice: 3350,
      downPaymentUF: 335,
      downPaymentInstallments: 36,
      rentCLP: 580000,
      rentSource: 'Estimado mercado',
    },
    {
      id: '2d-a',
      name: '2D / 2B (Tipo A)',
      areaM2: 65, // Approximate
      ufPrice: 4700,
      downPaymentUF: 470,
      downPaymentInstallments: 36,
      rentCLP: 750000,
      rentSource: 'Estimado mercado',
    },
  ],
  gallery: [
    { type: 'image', src: '/images/fachada-viva-marin.jpg', alt: 'Fachada del proyecto VIVA MARÍN', caption: 'Fachada principal' },
    { type: 'image', src: '/images/hall-viva-marin.jpg', alt: 'Hall de acceso', caption: 'Hall de acceso' },
    { type: 'image', src: '/images/amenidades-viva-marin.jpg', alt: 'Sala gourmet y gimnasio', caption: 'Sala gourmet + Gimnasio' },
    { type: 'image', src: '/images/plantas-viva-marin.jpg', alt: 'Plantas tipo', caption: 'Plantas tipo' },
  ],
  location: {
    address: 'Marín 425, Santiago Centro',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.123456789!2d-70.6483!3d-33.4378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDI2JzE2LjAiUyA3MMKwMzgnNTMuOSJX!5e0!3m2!1sen!2scl!4v1630000000000!5m2!1sen!2scl', // Generic Santiago Centro embed
    chips: [
      { title: 'Metro', detail: 'Estación Universidad de Chile · 5 min' },
      { title: 'Comercio', detail: 'Centro comercial Santiago · 2 min' },
      { title: 'Educación', detail: 'Universidad de Chile · 3 min' },
      { title: 'Salud', detail: 'Hospital del Salvador · 8 min' },
    ],
    plusvalia: 'Centro histórico de Santiago con alta plusvalía por conectividad urbana.',
  },
  whyNow: [
    {
      title: 'Promoción lanzamiento',
      description: '10% descuento + 5% adicional en primeras unidades.',
    },
    {
      title: 'Pie flexible',
      description: '10% dividido en 7,5% (36 cuotas TOKU) + 2,5% (12 cuotas post-escritura).',
    },
    {
      title: 'Preaprobación rápida',
      description: 'Asegura precio con promesa y preaprobación bancaria.',
    },
    {
      title: 'Primeras 20 unidades',
      description: 'Beneficios exclusivos para unidades iniciales.',
    },
  ],
  accompanimentSteps: [
    {
      title: 'Diagnóstico y preaprobación',
      description: 'Evaluamos tu perfil financiero sin costo.',
    },
    {
      title: 'Reserva y promesa',
      description: 'Firma promesa con preaprobación bancaria.',
    },
    {
      title: 'Crédito y firma',
      description: 'Financiamiento y escritura.',
    },
    {
      title: 'Entrega + arriendo',
      description: 'Recibe departamento y apoyo para arriendo.',
    },
  ],
  testimonials: [
    {
      name: 'Ana P., 28 · Santiago Centro',
      quote: 'Excelente ubicación y facilidades de pago. El pie en cuotas me permitió invertir sin tanto capital inicial.',
    },
    {
      name: 'Carlos M., 35 · Providencia',
      quote: 'Proceso transparente con Select Capital. Ya estoy recibiendo arriendo mensual.',
    },
    {
      name: 'María L., 32 · Ñuñoa',
      quote: 'La asesoría fue clave para entender las condiciones y asegurar el crédito.',
    },
  ],
  partners: [
    '/images/logo_largo_principal.png',
  ],
  faq: [
    {
      question: '¿Cómo se divide el pie 10%?',
      answer: '7,5% en 36 cuotas con TOKU + 2,5% en 12 cuotas post-escritura.',
    },
    {
      question: '¿Qué necesito para promesar?',
      answer: 'Preaprobación bancaria vigente al momento de firmar la promesa.',
    },
    {
      question: '¿Cuándo se entrega?',
      answer: 'Mediados de 2028.',
    },
    {
      question: '¿Hay estacionamientos y bodegas?',
      answer: 'Sí. Estac. desde UF 550, Tandem 2° SS UF 815, Tandem + bodega UF 900, Bodega UF 100.',
    },
    {
      question: '¿Qué tipologías hay y desde cuánto?',
      answer: 'Estudio desde UF 2.350, 1D desde UF 2.908, 2D desde UF 4.630.',
    },
    {
      question: '¿Qué incluye la promoción?',
      answer: '10% descuento + 5% adicional aplicable a todas las tipologías.',
    },
    {
      question: '¿Puedo usar subsidio?',
      answer: 'Consulta disponibilidad para subsidios habitacionales.',
    },
    {
      question: '¿Cómo funciona TOKU?',
      answer: 'TOKU es un sistema de financiamiento que permite diferir el pie en cuotas.',
    },
    {
      question: '¿Hay gastos adicionales?',
      answer: 'Contribuciones, gastos comunes y seguros asociados.',
    },
    {
      question: '¿Puedo vender antes de entrega?',
      answer: 'Sí, sujeto a condiciones del contrato.',
    },
  ],
  form: {
    notionDatabaseId: 'replace-with-database-id',
    successRedirect: '/gracias.html',
    calendlyLink: 'https://calendly.com/selectcapital/asesoria',
  },
  legal: {
    address: 'Av. Apoquindo 6410, Of. 1203, Las Condes',
    whatsapp: '+56 9 1234 5678',
    email: 'contacto@selectcapital.cl',
    policiesUrl: '/politicas.html',
  },
  simulationDisclaimers: [
    'Valores referenciales en UF. Cupos y promociones sujetos a disponibilidad.',
    'Precios incluyen promoción 10% + 5%.',
    'TOKU sujeto a evaluación crediticia.',
  ],
};