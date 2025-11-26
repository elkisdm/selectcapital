# 🌐 Configuración de Dominio en Vercel

## Dominio: app.selectcapital.cl

Este proyecto está configurado para usar el subdominio `app.selectcapital.cl`.

## Pasos para Configurar el Dominio en Vercel

### 1. Agregar Dominio en Vercel Dashboard

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Ve a **Settings** → **Domains**
3. Haz clic en **Add Domain**
4. Ingresa: `app.selectcapital.cl`
5. Haz clic en **Add**

### 2. Configurar DNS en tu Proveedor de Dominio

Vercel te mostrará los registros DNS que necesitas agregar. Generalmente necesitarás:

#### Opción A: CNAME (Recomendado)
```
Tipo: CNAME
Nombre: app
Valor: cname.vercel-dns.com
```

#### Opción B: A Record (Alternativa)
```
Tipo: A
Nombre: app
Valor: 76.76.21.21
```

### 3. Verificar la Configuración

1. Espera unos minutos para que se propague el DNS
2. Vercel verificará automáticamente el dominio
3. Una vez verificado, verás un check verde ✅

### 4. SSL Automático

Vercel proporciona SSL automático (HTTPS) para todos los dominios. No necesitas configuración adicional.

## Verificación

Una vez configurado, tu aplicación estará disponible en:
- **Producción:** https://app.selectcapital.cl
- **Preview:** https://tu-proyecto.vercel.app (sigue funcionando)

## Notas Importantes

- El dominio `app.selectcapital.cl` es perfecto para separar la aplicación del sitio principal
- Vercel maneja automáticamente el SSL/HTTPS
- Los deployments automáticos funcionarán en ambos dominios
- No necesitas cambiar código, solo configuración DNS

## Troubleshooting

### El dominio no verifica

1. Verifica que los registros DNS estén correctos
2. Espera hasta 48 horas para propagación completa (generalmente es más rápido)
3. Usa herramientas como [whatsmydns.net](https://www.whatsmydns.net) para verificar propagación

### Error de SSL

- Vercel maneja SSL automáticamente
- Si hay problemas, espera unos minutos después de verificar el dominio
- Contacta soporte de Vercel si persiste

## Estructura de Dominios Recomendada

- `selectcapital.cl` → Sitio principal (landing page)
- `app.selectcapital.cl` → Motor de Inversión (este proyecto) ✅
- `www.selectcapital.cl` → Redirect a selectcapital.cl

