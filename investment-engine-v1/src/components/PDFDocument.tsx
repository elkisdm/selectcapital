import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { PortfolioResult, GlobalAssumptions } from '@/src/types/investment'
import { formatCLP, formatPercentage } from '@/lib/utils'
import fs from 'fs'
import path from 'path'

interface AdvisorData {
  nombre: string
  telefono: string
}

interface PDFDocumentProps {
  portfolio: PortfolioResult
  assumptions: GlobalAssumptions
  fecha: string
  advisor?: AdvisorData
}

// Paleta de colores premium
const colors = {
  navy: '#0A1530',
  navySecondary: '#1B2A41',
  white: '#FFFFFF',
  lightBg: '#F5F7FA',
  green: '#00C897',
  orange: '#E47911',
  blueLight: '#88A2D0',
  grayDark: '#1A1A1A',
  grayMedium: '#6B7280',
  grayLight: '#E5E7EB',
}

const styles = StyleSheet.create({
  // Página principal
  page: {
    flexDirection: 'column',
    backgroundColor: colors.lightBg,
    padding: 0,
    fontFamily: 'Helvetica',
  },
  // Header premium
  header: {
    backgroundColor: colors.navy,
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 48,
    color: colors.white,
    minHeight: 140, // Tamaño fijo para header
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    height: 32,
    width: 'auto',
    maxWidth: 200,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 0.5,
  },
  headerDate: {
    fontSize: 9,
    color: colors.white,
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.85,
    marginBottom: 4,
  },
  headerContact: {
    fontSize: 8,
    color: colors.white,
    opacity: 0.65,
    marginTop: 6,
  },
  // Hero section - Tamaño adaptativo según número de propiedades
  hero: {
    backgroundColor: colors.navy,
    padding: 24,
    marginHorizontal: 48,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 10,
  },
  heroTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.9,
  },
  heroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  heroItem: {
    width: '48%',
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 9,
    color: colors.white,
    opacity: 0.7,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  heroValueOrange: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.orange,
  },
  heroValueGreen: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.green,
  },
  // Contenido principal - Sin minHeight para permitir mejor distribución
  content: {
    paddingHorizontal: 48,
    paddingBottom: 24,
    paddingTop: 20,
    flexGrow: 1,
  },
  // Tabla comparativa - Tamaño según número de propiedades
  section: {
    marginBottom: 24,
  },
  // Sección compacta para múltiples propiedades
  sectionCompact: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  table: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.navySecondary,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: colors.grayDark,
  },
  tableCellBold: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.grayDark,
  },
  tableCellGreen: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.green,
  },
  tableCellOrange: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.orange,
  },
  // Property Card premium - Sin minHeight para mejor distribución
  propertyCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.grayLight,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  } as any,
  // Card compacta para múltiples propiedades
  propertyCardCompact: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.grayLight,
  } as any,
  propertyCardHeader: {
    backgroundColor: colors.navy,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.orange,
  },
  propertyCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  propertyCardSubtitle: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.8,
  },
  propertyCardContent: {
    padding: 20,
  },
  propertyMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  propertyMetric: {
    width: '48%',
    marginBottom: 16,
    paddingRight: 12,
  },
  propertyMetricLabel: {
    fontSize: 8,
    color: colors.grayMedium,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  propertyMetricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.grayDark,
  },
  propertyMetricValueGreen: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.green,
  },
  propertyMetricValueOrange: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.orange,
  },
  propertyMetricValueLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.grayDark,
  },
  propertyMetricValueLargeOrange: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.orange,
  },
  // Gráfico de plusvalía
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 16,
  },
  chartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartBarLabel: {
    width: 60,
    fontSize: 9,
    color: colors.grayDark,
    fontWeight: 'bold',
  },
  chartBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  chartBarFill: {
    height: '100%',
    backgroundColor: colors.blueLight,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chartBarValue: {
    fontSize: 8,
    color: colors.white,
    fontWeight: 'bold',
  },
  // Footer premium - Tamaño adaptativo
  footer: {
    backgroundColor: colors.navy,
    padding: 24,
    marginTop: 'auto',
    color: colors.white,
  },
  footerLogoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  footerLogo: {
    height: 24,
    width: 'auto',
    maxWidth: 150,
    opacity: 0.9,
  },
  footerQuote: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  footerInfo: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginTop: 12,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.grayLight,
    marginVertical: 24,
  },
})

// Componente para calcular proyección anual de plusvalía
const calculateAnnualProjection = (
  assumptions: GlobalAssumptions,
  initialValue: number
) => {
  const years = []
  let currentValue = initialValue

  for (let year = 1; year <= assumptions.horizonteAnios; year++) {
    const factor =
      year === 1
        ? 1 + assumptions.plusvaliaAnio1
        : 1 + assumptions.plusvaliaDesdeAnio2
    currentValue = currentValue * factor
    years.push({
      year: 2024 + year,
      value: currentValue,
    })
  }

  return years
}

export const PDFDocument: React.FC<PDFDocumentProps> = ({
  portfolio,
  assumptions,
  fecha,
  advisor,
}) => {
  // Valores por defecto si no se proporciona advisor
  const advisorNombre = advisor?.nombre || 'Asesor'
  const advisorTelefono = advisor?.telefono || ''
  
  // Determinar si usar layout compacto (más de 2 propiedades)
  const isCompactLayout = portfolio.properties.length > 2
  
  // Calcular proyección de plusvalía para la primera propiedad
  const firstProperty = portfolio.properties[0]
  const annualProjection = firstProperty
    ? calculateAnnualProjection(assumptions, firstProperty.valorClp)
    : []

  const maxProjectionValue = Math.max(
    ...annualProjection.map((p) => p.value),
    firstProperty?.valorClp || 0
  )

  // Cargar logos para react-pdf
  // En react-pdf con Next.js, necesitamos rutas absolutas desde process.cwd()
  const getImagePath = (imageName: string): string => {
    try {
      // Rutas posibles según el entorno (desarrollo vs producción)
      const possiblePaths = [
        path.join(process.cwd(), 'public', 'images', imageName),
        path.join(process.cwd(), '..', 'public', 'images', imageName),
        // Para Next.js build
        path.join(process.cwd(), '.next', 'server', 'app', '..', '..', '..', 'public', 'images', imageName),
      ]
      
      // Buscar la primera ruta que exista
      for (const imagePath of possiblePaths) {
        try {
          if (fs.existsSync(imagePath)) {
            return imagePath
          }
        } catch (e) {
          // Continuar con la siguiente ruta
          continue
        }
      }
      
      // Si ninguna ruta funciona, retornar la ruta estándar
      // react-pdf intentará cargarla y fallará silenciosamente si no existe
      return path.join(process.cwd(), 'public', 'images', imageName)
    } catch (error) {
      // En caso de error, retornar ruta por defecto
      console.warn(`Warning: Could not resolve image path for ${imageName}:`, error)
      return path.join(process.cwd(), 'public', 'images', imageName)
    }
  }
  
  const logoBlanco = getImagePath('logo_blanco.png')
  const logoLargo = getImagePath('logo_largo_principal.png')

  // Componente de Header reutilizable
  const HeaderComponent = () => (
        <View style={styles.header}>
          <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <Image src={logoBlanco} style={styles.logo} />
        </View>
            <Text style={styles.headerDate}>{fecha}</Text>
          </View>
          <Text style={styles.headerTitle}>
            Propuesta de Inversión Inmobiliaria
          </Text>
          {portfolio.properties.length > 0 && (
            <Text style={styles.headerSubtitle}>
          {portfolio.properties.length === 1
            ? portfolio.properties[0].input.nombreProyecto
            : `${portfolio.properties.length} Propiedades Seleccionadas`}
            </Text>
          )}
          {advisorTelefono && (
            <Text style={styles.headerContact}>
              {advisorNombre} – Asesor | WhatsApp: {advisorTelefono}
            </Text>
          )}
        </View>
  )

  // Componente de Footer reutilizable
  const FooterComponent = () => (
    <View style={styles.footer}>
      <View style={styles.footerLogoContainer}>
        <Image src={logoLargo} style={styles.footerLogo} />
      </View>
      <Text style={styles.footerQuote}>
        "Construimos inversión con análisis, estrategia y claridad."
      </Text>
      <Text style={styles.footerInfo}>
        {advisorNombre} – Asesor Inmobiliario
      </Text>
      {advisorTelefono && (
        <Text style={styles.footerInfo}>WhatsApp: {advisorTelefono}</Text>
      )}
      <Text style={styles.footerInfo}>contacto@selectcapital.cl</Text>
    </View>
  )

  return (
    <Document>
      {/* Página 1: Header + Resumen + Tabla Comparativa */}
      <Page size="A4" style={styles.page} wrap={false}>
        <HeaderComponent />

        {/* Hero Section - Métricas Principales */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Resumen del Portafolio</Text>
          <View style={styles.heroGrid}>
            <View style={styles.heroItem}>
              <Text style={styles.heroLabel}>Inversión Total</Text>
              <Text style={styles.heroValue}>
                {formatCLP(portfolio.inversionTotalClp)}
              </Text>
            </View>
            <View style={styles.heroItem}>
              <Text style={styles.heroLabel}>Ganancia Bruta (4 años)</Text>
              <Text style={styles.heroValueGreen}>
                {formatCLP(portfolio.gananciaBrutaTotalClp)}
              </Text>
            </View>
            <View style={styles.heroItem}>
              <Text style={styles.heroLabel}>Ganancia Neta (4 años)</Text>
              <Text style={styles.heroValueOrange}>
                {formatCLP(portfolio.gananciaNetaTotalClp)}
              </Text>
            </View>
            <View style={styles.heroItem}>
              <Text style={styles.heroLabel}>ROI Total</Text>
              <Text style={styles.heroValue}>
                {formatPercentage(portfolio.roiTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tabla Comparativa - Solo si hay múltiples propiedades */}
        {portfolio.properties.length > 1 && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Análisis de Portafolio</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>
                  Propiedad
                </Text>
                <Text style={styles.tableHeaderCell}>Valor</Text>
                <Text style={styles.tableHeaderCell}>Inversión</Text>
                <Text style={styles.tableHeaderCell}>G. Bruta</Text>
                <Text style={styles.tableHeaderCell}>G. Neta</Text>
                <Text style={styles.tableHeaderCell}>Plusvalía</Text>
                <Text style={styles.tableHeaderCell}>ROI</Text>
              </View>
              {portfolio.properties.map((result, index) => (
                <View key={result.input.id} style={styles.tableRow}>
                  <Text style={[styles.tableCellBold, { flex: 1.2 }]}>
                    {index + 1}. {result.input.nombreProyecto}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatCLP(result.valorClp)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatCLP(result.inversionTotalPropiedadClp)}
                  </Text>
                  <Text style={styles.tableCellGreen}>
                    {formatCLP(result.gananciaBrutaClp)}
                  </Text>
                  <Text style={styles.tableCellOrange}>
                    {formatCLP(result.gananciaNetaClp)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatCLP(result.plusvaliaHorizonteClp)}
                  </Text>
                  <Text style={styles.tableCellGreen}>
                    {formatPercentage(result.roiSobreInversion)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          </View>
        )}

        {/* Si solo hay 1 propiedad, mostrar su card en la primera página */}
        {portfolio.properties.length === 1 && (
          <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                Propiedad Detallada
            </Text>
            {portfolio.properties.map((result, index) => (
              <View key={result.input.id} style={styles.propertyCard}>
                <View style={styles.propertyCardHeader}>
                  <Text style={styles.propertyCardTitle}>
                    {index + 1}. {result.input.nombreProyecto}
                  </Text>
                  <Text style={styles.propertyCardSubtitle}>
                    {result.input.comuna} • {result.input.tipologia} •{' '}
                    {result.input.m2Totales} m²
                  </Text>
                </View>
                <View style={styles.propertyCardContent}>
                  <View style={styles.propertyMetrics}>
                    <View style={styles.propertyMetric}>
                      <Text style={styles.propertyMetricLabel}>
                        Valor Propiedad
                      </Text>
                      <Text style={styles.propertyMetricValueLarge}>
                        {formatCLP(result.valorClp)}
                      </Text>
                    </View>
                    <View style={styles.propertyMetric}>
                      <Text style={styles.propertyMetricLabel}>
                        Dividendo Mensual
                      </Text>
                      <Text style={styles.propertyMetricValue}>
                        {formatCLP(result.dividendoClp)}
                      </Text>
                    </View>
                    <View style={styles.propertyMetric}>
                      <Text style={styles.propertyMetricLabel}>
                        Inversión Total
                      </Text>
                      <Text style={styles.propertyMetricValueLarge}>
                        {formatCLP(result.inversionTotalPropiedadClp)}
                      </Text>
                    </View>
                    <View style={styles.propertyMetric}>
                      <Text style={styles.propertyMetricLabel}>
                        Ganancia Bruta (4 años)
                      </Text>
                      <Text style={styles.propertyMetricValueGreen}>
                        {formatCLP(result.gananciaBrutaClp)}
                      </Text>
                    </View>
                    <View style={styles.propertyMetric}>
                      <Text style={styles.propertyMetricLabel}>
                        Ganancia Neta (4 años)
                      </Text>
                      <Text style={styles.propertyMetricValueOrange}>
                        {formatCLP(result.gananciaNetaClp)}
                      </Text>
                    </View>
                    <View style={styles.propertyMetric}>
                      <Text style={styles.propertyMetricLabel}>
                        Plusvalía ({assumptions.horizonteAnios} años)
                      </Text>
                      <Text style={styles.propertyMetricValueGreen}>
                        {formatCLP(result.plusvaliaHorizonteClp)}
                      </Text>
                    </View>
                    {result.bonoPieClp > 0 && (
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>Bono Pie</Text>
                        <Text style={styles.propertyMetricValueGreen}>
                          {formatCLP(result.bonoPieClp)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.propertyMetric}>
                      <Text style={styles.propertyMetricLabel}>
                        Rentabilidad Bruta
                      </Text>
                      <Text style={styles.propertyMetricValue}>
                        {formatPercentage(result.rentabilidadBruta)}
                      </Text>
                    </View>
                    <View style={styles.propertyMetric}>
                      <Text style={styles.propertyMetricLabel}>
                        ROI Individual
                      </Text>
                      <Text style={styles.propertyMetricValueGreen}>
                        {formatPercentage(result.roiSobreInversion)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
          </View>
        )}

        <FooterComponent />
      </Page>

      {/* Páginas adicionales: Una propiedad por página (si hay múltiples) */}
      {portfolio.properties.length > 1 &&
        portfolio.properties.map((result, index) => (
          <Page key={result.input.id} size="A4" style={styles.page} wrap={false}>
            <HeaderComponent />
            <View style={styles.content}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Propiedad {index + 1} de {portfolio.properties.length}
                </Text>
                <View style={styles.propertyCard}>
                  <View style={styles.propertyCardHeader}>
                    <Text style={styles.propertyCardTitle}>
                      {index + 1}. {result.input.nombreProyecto}
                    </Text>
                    <Text style={styles.propertyCardSubtitle}>
                      {result.input.comuna} • {result.input.tipologia} •{' '}
                      {result.input.m2Totales} m²
                    </Text>
                  </View>
                  <View style={styles.propertyCardContent}>
                    <View style={styles.propertyMetrics}>
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>
                          Valor Propiedad
                        </Text>
                        <Text style={styles.propertyMetricValueLarge}>
                          {formatCLP(result.valorClp)}
                        </Text>
                      </View>
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>
                          Dividendo Mensual
                        </Text>
                        <Text style={styles.propertyMetricValue}>
                          {formatCLP(result.dividendoClp)}
                        </Text>
                      </View>
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>
                          Inversión Total
                        </Text>
                        <Text style={styles.propertyMetricValueLarge}>
                          {formatCLP(result.inversionTotalPropiedadClp)}
                        </Text>
                      </View>
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>
                          Ganancia Bruta (4 años)
                        </Text>
                        <Text style={styles.propertyMetricValueGreen}>
                          {formatCLP(result.gananciaBrutaClp)}
                        </Text>
                      </View>
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>
                          Ganancia Neta (4 años)
                        </Text>
                        <Text style={styles.propertyMetricValueOrange}>
                          {formatCLP(result.gananciaNetaClp)}
                        </Text>
                      </View>
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>
                          Plusvalía ({assumptions.horizonteAnios} años)
                        </Text>
                        <Text style={styles.propertyMetricValueGreen}>
                          {formatCLP(result.plusvaliaHorizonteClp)}
                        </Text>
                      </View>
                      {result.bonoPieClp > 0 && (
                        <View style={styles.propertyMetric}>
                          <Text style={styles.propertyMetricLabel}>Bono Pie</Text>
                          <Text style={styles.propertyMetricValueGreen}>
                            {formatCLP(result.bonoPieClp)}
                          </Text>
                        </View>
                      )}
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>
                          Rentabilidad Bruta
                        </Text>
                        <Text style={styles.propertyMetricValue}>
                          {formatPercentage(result.rentabilidadBruta)}
                        </Text>
                      </View>
                      <View style={styles.propertyMetric}>
                        <Text style={styles.propertyMetricLabel}>
                          ROI Individual
                        </Text>
                        <Text style={styles.propertyMetricValueGreen}>
                          {formatPercentage(result.roiSobreInversion)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <FooterComponent />
          </Page>
        ))}

      {/* Última página: Proyección de Plusvalía (solo si hay 1-2 propiedades) */}
      {firstProperty &&
        annualProjection.length > 0 &&
        portfolio.properties.length <= 2 && (
          <Page size="A4" style={styles.page} wrap={false}>
            <HeaderComponent />
            <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Proyección de Plusvalía ({assumptions.horizonteAnios} años)
              </Text>
              <View style={styles.chartContainer}>
                  {annualProjection.map((projection) => {
                  const percentage =
                    (projection.value / maxProjectionValue) * 100
                  return (
                    <View key={projection.year} style={styles.chartBar}>
                        <Text style={styles.chartBarLabel}>
                          {projection.year}
                        </Text>
                      <View style={styles.chartBarContainer}>
                        <View
                          style={[
                            styles.chartBarFill,
                            { width: `${percentage}%` },
                          ]}
                        >
                          <Text style={styles.chartBarValue}>
                            {formatCLP(projection.value)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
        </View>
            <FooterComponent />
          </Page>
        )}
    </Document>
  )
}
