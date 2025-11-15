const template = `<!doctype html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <title>Propuesta Select Capital</title>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #05080F; color: #F8FAFC; margin: 0; padding: 48px 64px; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .badge { border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); padding: 6px 14px; font-size: 0.75rem; letter-spacing: 0.2em; }
    .card { border-radius: 28px; border: 1px solid rgba(255,255,255,0.14); padding: 24px; margin-bottom: 24px; background: rgba(255,255,255,0.06); }
    .kpi-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
    .kpi span { display: block; }
    .kpi-title { font-size: 0.75rem; letter-spacing: 0.3em; color: rgba(248,250,252,0.72); }
    .kpi-value { font-size: 2rem; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
    th { text-align: left; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.7rem; color: rgba(248,250,252,0.72); padding-bottom: 8px; }
    td { padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.08); }
    footer { margin-top: 36px; font-size: 0.75rem; color: rgba(248,250,252,0.48); }
  </style>
</head>
<body>
  <header>
    <div>
      <p class="badge">PROPUESTA SELECT CAPITAL</p>
      <h1>{{projectName}}</h1>
      <p>Cliente: {{clientName}} · RUT {{clientRut}}</p>
    </div>
    {{#if logoUrl}}
    <img src="{{logoUrl}}" alt="Select Capital" width="140" />
    {{/if}}
  </header>

  <section class="card">
    <h2>Resumen financiero</h2>
    <div class="kpi-grid">
      <div class="kpi">
        <span class="kpi-title">Pie estimado</span>
        <span class="kpi-value">{{downPaymentUF}} UF</span>
        <span>{{downPaymentCLP}}</span>
      </div>
      <div class="kpi">
        <span class="kpi-title">Dividendo mensual</span>
        <span class="kpi-value">{{dividendCLP}}</span>
        <span>{{dividendUF}} UF</span>
      </div>
      <div class="kpi">
        <span class="kpi-title">Renta proyectada</span>
        <span class="kpi-value">{{rentCLP}}</span>
      </div>
      <div class="kpi">
        <span class="kpi-title">Flujo estimado</span>
        <span class="kpi-value">{{netFlow}}</span>
      </div>
    </div>
  </section>

  <section class="card">
    <h2>Detalle del financiamiento</h2>
    <table>
      <thead>
        <tr>
          <th>Concepto</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Precio unidad</td>
          <td>{{priceUF}} UF ({{priceCLP}})</td>
        </tr>
        <tr>
          <td>Pie</td>
          <td>{{downPaymentUF}} UF · {{downPaymentCLP}}</td>
        </tr>
        <tr>
          <td>Crédito</td>
          <td>{{loanUF}} UF · {{loanCLP}}</td>
        </tr>
        <tr>
          <td>Tasa / plazo</td>
          <td>{{rate}} · {{term}} años</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="card">
    <h2>Notas del asesor</h2>
    <p>{{notes}}</p>
  </section>

  <footer>
    Generado el {{issuedAt}} · Select Capital · contacto@selectcapital.cl · +56 9 6601 3182
  </footer>
</body>
</html>`;

export default template;
