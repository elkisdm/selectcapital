# PDF server-side (Next.js + Playwright)

Este folder contiene una referencia completa para el endpoint `POST /api/proposal-pdf` que renderiza la propuesta con la estética Liquid Glass.

## Arquitectura sugerida
1. **App Router** (`app/api/proposal-pdf/route.ts`) o Pages (`pages/api/proposal-pdf.ts`).
2. **Templating** con Handlebars (o React Server Components). Aquí usamos Handlebars para inyectar datos en `proposal-template.ts`/`.html`.
3. **Render headless** mediante `playwright-core` (Chromium). Alternativa: `puppeteer-core` + `chrome-aws-lambda` cuando se despliegue en Vercel.
4. **Storage opcional**: subir el PDF resultante a S3/Cloudflare R2 y devolver URL firmada. En esta referencia lo retornamos como descarga directa.

## Dependencias
```bash
npm install playwright-core handlebars
# en Vercel/CI agrega:
npx playwright install chromium --with-deps
```

Si prefieres Puppeteer:
```bash
npm install puppeteer-core chrome-aws-lambda
```

## Handler (App Router)
`pdf/app-route-example.ts` ilustra el endpoint:
- Lee el JSON del body (`clientName`, `projectName`, montos ya formateados).
- Compila el template (`Handlebars.compile`).
- Abre Chromium headless (`--no-sandbox` para serverless) y genera el PDF con márgenes A4.
- Responde con `Content-Type: application/pdf` y `Content-Disposition: attachment`.

## Template
- `pdf/proposal-template.ts` es un string con placeholders Handlebars. Usa la misma paleta glass (bordes 28px, blur sutil).
- `pdf/proposal-template.html` sirve para previsualizar el diseño localmente (abrir en el navegador para ajustar estilos antes de copiar al string).

### Datos esperados
```json
{
  "clientName": "Ana Pérez",
  "clientRut": "12.345.678-5",
  "projectName": "Mirador La Florida",
  "priceUF": "2.600",
  "priceCLP": "$95.000.000",
  "downPaymentUF": "520",
  "downPaymentCLP": "$19.000.000",
  "loanUF": "2.080",
  "loanCLP": "$76.000.000",
  "dividendCLP": "$480.000",
  "dividendUF": "13.1",
  "rentCLP": "$520.000",
  "netFlow": "+$20.000",
  "rate": "4,5%",
  "term": 30,
  "notes": "Incluye administración Select Capital por 12 meses",
  "logoUrl": "https://www.selectcapital.cl/logo.png",
  "issuedAt": "11/11/2025"
}
```

Se recomienda mandar montos ya formateados (`Intl.NumberFormat` en el backend) para mantener consistencia con el idioma del cliente.

## Integración con el front existente
1. En el CTA “Descargar propuesta” del landing (`index.html`), hacer `fetch('/api/proposal-pdf', { method: 'POST', body: JSON.stringify(data) })` y transformar la respuesta en Blob para gatillar `URL.createObjectURL`. En Next/React puede usarse `useTransition` + spinner.
2. Reutiliza los mismos cálculos del componente `<Calculator />` para poblar el payload (pie, dividendo, flujo). El objeto devuelto por `onQuote` ya incluye todo.
3. Log eventos de conversión (GA4/Meta) cuando el PDF se genere exitosamente.

## Hardening / producción
- **Timeouts**: limita la generación a <5 s; aborta si Playwright demora (`Promise.race`).
- **Rate limiting**: protege el endpoint (por IP o token).
- **Cache**: usa hash del payload; si ya existe en S3, devuelve link inmediato.
- **Observabilidad**: loggea tamaño del PDF, payload anonimizado y errores de render.
