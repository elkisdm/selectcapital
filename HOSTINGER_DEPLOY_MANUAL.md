# Cómo hacer deploy manual en Hostinger

## Problema
Los cambios pusheados a GitHub no se reflejan automáticamente en el sitio web.

## Solución 1: Deploy manual desde panel Hostinger

1. **Accede a tu panel de Hostinger:**
   - Ve a: https://hpanel.hostinger.com
   - Inicia sesión

2. **Ve a tu sitio web:**
   - Selecciona el sitio `selectcapital.cl`
   - Ve a la sección **"Git"** o **"Deployments"**

3. **Forzar deploy:**
   - Busca el botón **"Pull changes"** o **"Deploy now"**
   - Haz clic para forzar la sincronización con GitHub

## Solución 2: Deploy por SSH (más rápido)

Si tienes acceso SSH a Hostinger:

```bash
# Conectar a Hostinger por SSH
ssh u123456789@yourdomain.com

# Ir al directorio del sitio
cd public_html

# Forzar pull de GitHub
git fetch origin
git reset --hard origin/main
git pull origin main

# Limpiar caché si es necesario
php artisan cache:clear  # Solo si usas Laravel
```

## Solución 3: Verificar webhook de GitHub

1. Ve a tu repositorio en GitHub:
   - https://github.com/elkisdm/selectcapital

2. Ve a **Settings → Webhooks**

3. Verifica que haya un webhook configurado para Hostinger

4. Si no existe o está fallando:
   - Elimínalo y crea uno nuevo
   - URL del webhook: Te la proporciona Hostinger en la sección Git
   - Content type: `application/json`
   - Secret: El que te proporciona Hostinger

## URLs correctas después del deploy:

- Landing VIVA MARÍN: https://selectcapital.cl/landing/proyecto-inmobiliario/base.html
- Página de gracias: https://selectcapital.cl/landing/proyecto-inmobiliario/gracias.html

## Verificar que el deploy funcionó:

1. Verifica el timestamp del archivo CSS:
   ```
   https://selectcapital.cl/landing/proyecto-inmobiliario/viva-marin-styles.css?v=20250118-2
   ```
   
2. Abre el navegador en modo privado e intenta acceder

3. Si sigue sin funcionar, contacta al soporte de Hostinger

## Contacto Soporte Hostinger:
- Email: support@hostinger.com
- Chat en vivo: Desde tu panel hPanel
- Teléfono: +57 1 5803658 (Colombia)

