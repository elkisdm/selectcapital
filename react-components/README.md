# Select Capital - React UI primitives

Este paquete informal agrupa los tres componentes solicitados (Hero, ProjectCard y Calculator) en TypeScript/React.

## Uso rapido

```tsx
import { Hero, ProjectCard, Calculator } from './react-components';
```

Los componentes estan disenados para convivir con Tailwind o estilos basados en los tokens del diseno \"Liquid Glass\". Puedes sobreescribir clases via `className`.

### Hero

```tsx
<Hero
  pill="Proximo lanzamiento 11/11"
  eyebrow="Select Capital"
  title="Inversion inmobiliaria Mirador La Florida"
  description="Evento presencial con cupos limitados, asesores 1:1 y condiciones preferentes."
  metrics={[
    { label: 'Capacidad', value: '60 personas', helper: '42 inscritos' },
    { label: 'UBICACION', value: 'Best Western Premier', helper: 'Las Condes' }
  ]}
  highlights={[
    { title: 'Pie en cuotas', description: 'Divide el pie en hasta 24 cuotas.' },
    { title: 'Agenda 1:1', description: 'Reserva asesoria personalizada.' }
  ]}
  eventDetails={[
    { label: 'Fecha', value: '11 de noviembre - 19:30' },
    { label: 'Direccion', value: 'Alonso de Cordova 5727' }
  ]}
  media={{ src: '/images/evento.jpg', alt: 'Sala del evento' }}
  ctas=[
    { label: 'Reservar cupo', href: '#form' },
    { label: 'WhatsApp', href: 'https://wa.me/56966013182', variant: 'secondary', external: true }
  ]
/>
```

### ProjectCard

```tsx
<ProjectCard
  title="Mirador La Florida"
  location="La Florida - RM"
  priceUF="2.600"
  pieLabel="Pie 20% en 24 cuotas"
  deliveryLabel="Entrega 1S 2029"
  rentNetLabel="$180.000 CLP"
  badges={[
    { label: 'Pie en cuotas', tone: 'jade' },
    { label: 'Garantia de arriendo', tone: 'cobre' }
  ]}
  kpis={[
    { label: 'Yield neto', value: '5,4%', helper: 'Sin plusvalia', trend: 'up' },
    { label: 'Flujo neto', value: '$25.000', helper: 'Despues de dividendos' }
  ]}
  cover={{ src: '/images/evento.jpg', alt: 'Render del proyecto' }}
  actions=[
    { label: 'Ver propuesta', href: '/propuesta.pdf' },
    { label: 'Compartir', variant: 'ghost', onClick: () => console.log('share') }
  ]
/>
```

### Calculator

El componente mantiene estado interno pero expone resultados via `onQuote`.

```tsx
<Calculator
  initialValues={{ propertyPriceUF: 3000, downPaymentPercent: 25 }}
  onQuote={(result) => {
    console.log('Flujo neto', result.netFlowCLP);
  }}
/>
```

> Nota: Si necesitas sincronizar los estilos, comparte las variables CSS/Tailwind declaradas en `select_capital_liquid_glass_design_system_v_1.md`.
