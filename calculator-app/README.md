# Calculadora Hipotecaria Select Capital

Aplicación Next.js 14 para calcular capacidad hipotecaria con generación de PDF.

## Características

- ✅ Cálculo de capacidad hipotecaria basado en amortización francesa
- ✅ Múltiples escenarios de financiamiento (80%, 85%, 90% LTV)
- ✅ Evaluación de proyectos inmobiliarios
- ✅ Recomendaciones dinámicas personalizadas
- ✅ Generación de PDF con resultados completos
- ✅ Integración con API de UF (mindicador.cl)
- ✅ Diseño elegante con tema Select Capital (negro/dorado)
- ✅ Totalmente responsive

## Tecnologías

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** con tema personalizado
- **shadcn/ui** para componentes
- **react-hook-form** + **zod** para validación
- **@react-pdf/renderer** para generación de PDF
- **framer-motion** para animaciones

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en desarrollo:

```bash
npm run dev
```

3. Abrir en el navegador:

```
http://localhost:3000/calculator
```

## Estructura del Proyecto

```
calculator-app/
├── app/
│   ├── calculator/
│   │   ├── page.tsx              # Página principal
│   │   ├── actions.ts             # Server Actions (PDF)
│   │   ├── components/
│   │   │   ├── Form.tsx           # Formulario
│   │   │   ├── Results.tsx        # Resultados
│   │   │   ├── Recommendation.tsx # Recomendaciones
│   │   │   └── PDFDocument.tsx    # Componente PDF
│   │   └── utils/
│   │       ├── mortgage.ts        # Lógica financiera
│   │       └── validation.ts     # Validaciones
│   ├── api/
│   │   └── uf/
│   │       └── route.ts           # API endpoint UF
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── ui/                        # Componentes shadcn/ui
├── lib/
│   └── utils.ts                   # Utilidades
└── public/
    └── images/                    # Assets (logo, etc.)
```

## Funcionalidades

### Cálculo Hipotecario

- **Dividendo Máximo**: Calculado automáticamente para 25%, 30% y 35% de endeudamiento
- **Crédito Máximo**: Basado en amortización francesa
- **Escenarios LTV**: Evalúa 80%, 85% y 90% de financiamiento
- **Búsqueda Inversa**: Evalúa si un proyecto específico es viable

### Generación de PDF

El PDF generado incluye:
- Datos del cliente (opcional)
- Renta y capacidad hipotecaria
- Escenarios de financiamiento
- Evaluación del proyecto
- Recomendaciones personalizadas

### API UF

Endpoint `/api/uf` que obtiene el valor actualizado de la UF desde mindicador.cl con fallback a valor manual.

## Scripts

- `npm run dev` - Desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter

## Notas

- El valor UF por defecto es 37.000 CLP (actualizable desde la API)
- La tasa de interés por defecto es 4.5%
- El plazo por defecto es 30 años
- Los cálculos están basados en amortización francesa estándar

## Próximos Pasos

- [ ] Agregar tests unitarios
- [ ] Implementar QR code en PDF
- [ ] Agregar más fuentes de datos para UF
- [ ] Mejorar validaciones de RUT
- [ ] Agregar historial de cálculos

