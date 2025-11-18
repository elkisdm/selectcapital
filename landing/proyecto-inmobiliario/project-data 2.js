export const PROJECT_CONFIG = {
  version: 'v1.0',
  project: {
    name: 'Mirador La Florida',
    commune: 'La Florida',
    stage: 'Verde',
    delivery: 'Q4 2026',
    slug: 'mirador-la-florida',
    currency: 'UF',
    ctaPrimary: 'Quiero mi propuesta',
    ctaSecondary: 'Descargar ficha PDF',
    heroVideo: {
      src: 'https://cdn.selectcapital.cl/projects/mirador-la-florida/hero.webm',
      poster: '/images/hero-la-florida.jpg',
      type: 'video/webm',
    },
    heroImageFallback: '/images/hero-la-florida.jpg',
    leadWhatsappNumber: '56912345678',
  },
  financials: {
    ufValue: 36500,
    annualRate: 0.049,
    financingOptions: [0.8, 0.9],
    defaultFinancing: 0.8,
    maxYears: 30,
    defaultYears: 30,
    defaultLoadPercent: 0.25,
    expensesPercent: 0.004,
    insurancePercent: 0.0015,
  },
  highlights: [
    { label: 'Desde UF', value: '2.190' },
    { label: 'Tipologías', value: 'Studio · 1D · 2D' },
    { label: 'Entrega', value: 'Q4 2026' },
    { label: 'Etapa', value: 'Verde' },
    { label: 'Pie', value: 'UF 219 · 18 cuotas' },
    { label: 'Administración', value: 'Arriendo garantizado 12 meses' },
  ],
  badges: [
    'Pie en 18 cuotas',
    'Arriendo estimado $520.000',
    'Rentabilidad 7,2%',
    'A pasos del Metro Vicuña Mackenna',
  ],
  typologies: [
    {
      id: 'studio-28',
      name: 'Studio — 28 m²',
      areaM2: 28,
      ufPrice: 2190,
      downPaymentUF: 219,
      downPaymentInstallments: 18,
      rentCLP: 420000,
      rentSource: 'Portal Inmobiliario · 2025',
    },
    {
      id: '1d1b-38',
      name: '1D · 1B — 38 m²',
      areaM2: 38,
      ufPrice: 2590,
      downPaymentUF: 259,
      downPaymentInstallments: 24,
      rentCLP: 520000,
      rentSource: 'Toctoc · 2025',
    },
    {
      id: '2d2b-58',
      name: '2D · 2B — 58 m²',
      areaM2: 58,
      ufPrice: 3390,
      downPaymentUF: 339,
      downPaymentInstallments: 24,
      rentCLP: 680000,
      rentSource: 'Toctoc · 2025',
    },
  ],
  gallery: [
    { type: 'image', src: '/images/hero-la-florida.jpg', alt: 'Vista exterior del proyecto', caption: 'Fachada principal' },
    { type: 'image', src: '/images/evento.jpg', alt: 'Cowork y amenidades', caption: 'Cowork + Amenidades' },
    { type: 'image', src: '/images/elkis.PNG', alt: 'Gimnasio equipado', caption: 'Gimnasio equipado' },
    { type: 'video', src: 'https://cdn.selectcapital.cl/projects/mirador-la-florida/tour.mp4', alt: 'Video tour departamento piloto', caption: 'Video tour 360°' },
  ],
  location: {
    address: 'Av. La Florida 7890, La Florida',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!...', // Replace with actual embed
    chips: [
      { title: 'Metro', detail: 'Línea 5 · 4 minutos caminando' },
      { title: 'Comercio', detail: 'Mall Plaza Vespucio · 6 min' },
      { title: 'Educación', detail: 'DUOC UC · 10 min' },
      { title: 'Salud', detail: 'Clínica Vespucio · 7 min' },
    ],
    plusvalia: 'Plusvalía histórica comuna: 8,4% anual · Fuente: Toctoc 2020-2024',
  },
  whyNow: [
    {
      title: 'Tasas estables',
      description: 'Tasas hipotecarias promedian 4,9% en bancos tradicionales (ago 2025).',
      link: 'https://www.comparabien.cl/hipotecas/tasas',
    },
    {
      title: 'Entrega asegurada',
      description: 'Etapa verde con avance de obra 35% y entrega comprometida para Q4 2026.',
    },
    {
      title: 'Alta demanda de arriendo',
      description: 'Ocupación de 97% en departamentos 1D en La Florida (Fuente: Portal Inmobiliario).',
    },
  ],
  accompanimentSteps: [
    {
      title: 'Diagnóstico',
      description: 'Analizamos tu renta, ahorro y objetivo para definir tipologías posibles.',
    },
    {
      title: 'Reserva',
      description: 'Te acompañamos en la elección y coordinación de la reserva 100% online.',
    },
    {
      title: 'Crédito y firma',
      description: 'Pre-aprobación hipotecaria, gestión de banco y coordinación con la inmobiliaria.',
    },
    {
      title: 'Entrega + arriendo',
      description: 'Recibimos el departamento, lo publicamos y arrendamos en menos de 30 días.',
    },
  ],
  testimonials: [
    {
      name: 'Carolina, 32 · Ñuñoa',
      quote: 'Reservé mi primer departamento para inversión con pie en cuotas y arriendo asegurado.',
    },
    {
      name: 'Mario, 41 · Puente Alto',
      quote: 'La asesoría fue clave para entender mis números y asegurar el crédito hipotecario.',
    },
    {
      name: 'Valentina, 28 · La Florida',
      quote: 'En 48 horas recibí mi propuesta con dividendo, arriendo estimado y retorno proyectado.',
    },
  ],
  partners: [
    '/images/logo_largo.png',
    '/images/logo_blanco.png',
  ],
  faq: [
    {
      question: '¿Cómo funciona el pie en cuotas?',
      answer: 'Puedes financiar el 20% en hasta 24 cuotas reajustables en UF. Sin interés adicional.',
    },
    {
      question: '¿Qué pasa si no califico al crédito?',
      answer: 'Trabajamos con varios bancos y mutuarias. Si no calificas, devolvemos tu pie según cláusulas de retracto.',
    },
    {
      question: '¿Cuánto se demora en arrendar?',
      answer: 'Nuestro partner administra y arrienda en promedio dentro de 30 días después de la entrega.',
    },
    {
      question: '¿Qué gastos debo considerar?',
      answer: 'Dividendo, gastos comunes de $60.000 aprox., contribuciones estimadas UF 1,2 y seguro de incendio.',
    },
    {
      question: '¿Puedo comprar para vivir?',
      answer: 'Sí. Tenemos tipologías con terrazas y opciones de entrega inmediata en torres anteriores.',
    },
    {
      question: '¿Cómo se calcula el arriendo estimado?',
      answer: 'Usamos fuentes públicas (Toctoc/Portal Inmobiliario) y datos propietarios del corredor aliado.',
    },
    {
      question: '¿Puedo usar subsidio DS1 o DS19?',
      answer: 'Este proyecto aplica para DS19 tramo 3. Te ayudamos con la postulación.',
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
    'Resultados estimados según tasa referencial 4,9% anual y UF $36.500.',
    'Los montos pueden variar según evaluación bancaria y perfil crediticio.',
    'Incluye estimación de seguros e impuestos asociados (0,55% adicional).',
  ],
};

