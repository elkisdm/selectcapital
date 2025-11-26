# Motor de Inversión Inmobiliaria

Aplicación Next.js para calcular la rentabilidad de portafolios inmobiliarios.

## Características

- **Motor de cálculo puro TypeScript**: Funciones puras sin dependencias de React
- **Cálculo de múltiples propiedades**: Analiza portafolios completos
- **Métricas completas**: ROI, rentabilidades, plusvalía, flujos mensuales
- **UI responsive**: Diseño mobile-first con TailwindCSS
- **Tests unitarios**: Cobertura de tests con Vitest

## Estructura del Proyecto

```
investment-engine-v1/
├── app/                    # Next.js App Router
│   ├── api/uf/            # API para obtener valor UF
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── src/
│   ├── types/             # Tipos TypeScript
│   │   └── investment.ts
│   ├── lib/               # Motor de cálculo
│   │   ├── investmentCalculator.ts
│   │   └── investmentCalculator.test.ts
│   └── components/        # Componentes React
│       ├── GlobalAssumptionsForm.tsx
│       ├── PropertyForm.tsx
│       ├── PropertyList.tsx
│       ├── PropertyCard.tsx
│       └── PortfolioSummary.tsx
└── components/ui/         # Componentes UI reutilizables
```

## Instalación

```bash
cd investment-engine-v1
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
npm start
```

## Uso

1. **Configura supuestos globales**: Establece parámetros como tasa de interés, plusvalía, etc.
2. **Añade propiedades**: Agrega propiedades al portafolio con sus características
3. **Revisa resultados**: Visualiza métricas individuales y agregadas del portafolio

## Tecnologías

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Vitest
- Radix UI

## Licencia

Privado - Select Capital

