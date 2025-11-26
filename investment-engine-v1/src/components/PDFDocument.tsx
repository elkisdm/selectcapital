import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import type { PortfolioResult, GlobalAssumptions } from '@/src/types/investment'
import { formatCLP, formatPercentage } from '@/lib/utils'

/**
 * NOTA SOBRE TIPOGRAFÍAS PROFESIONALES:
 * 
 * Para usar tipografías personalizadas (Inter, DM Sans, IBM Plex, etc.):
 * 
 * 1. Coloca los archivos .ttf en /public/fonts/
 * 2. Registra la fuente antes de usar:
 * 
 * Font.register({
 *   family: 'Inter',
 *   src: '/fonts/inter-regular.ttf'
 * });
 * 
 * 3. Actualiza fontFamily en los estilos a 'Inter'
 * 
 * Por ahora usamos 'Helvetica' (default) que es confiable en todos los sistemas.
 */

interface PDFDocumentProps {
  portfolio: PortfolioResult
  assumptions: GlobalAssumptions
  fecha: string
}

// Componente Section para evitar cortes de página
const Section: React.FC<{ children: React.ReactNode; wrap?: boolean }> = ({ children, wrap = true }) => (
  <View style={{ marginBottom: 32, breakInside: 'avoid', pageBreakInside: 'avoid' }} wrap={wrap}>
    {children}
  </View>
)

// Componente KPI para métricas con layout fijo
const KPI: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <View style={styles.kpiItem}>
    <Text style={styles.kpiLabel}>{title}</Text>
    <Text style={styles.kpiValue}>{value}</Text>
  </View>
)

const styles = StyleSheet.create({
  // Portada
  cover: {
    flexDirection: 'column',
    backgroundColor: '#05080F',
    color: '#F8FAFC',
    paddingTop: 120,
    paddingBottom: 50,
    paddingHorizontal: 48,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Helvetica',
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 12,
    letterSpacing: 1,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#F8FAFC',
    opacity: 0.8,
    marginBottom: 8,
  },
  coverDate: {
    fontSize: 14,
    color: '#F8FAFC',
    opacity: 0.6,
    marginTop: 40,
  },
  // Página de contenido
  page: {
    flexDirection: 'column',
    backgroundColor: '#05080F',
    color: '#F8FAFC',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
  },
  // Header de contenido
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(218, 165, 32, 0.3)',
    borderBottomStyle: 'solid',
  },
  headerText: {
    fontSize: 10,
    color: '#DAA520',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 11,
    color: '#F8FAFC',
    opacity: 0.7,
  },
  // Secciones
  section: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#DAA520',
    letterSpacing: 0.5,
  },
  // Separador
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  // Filas y valores
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 11,
    paddingVertical: 4,
  },
  label: {
    color: '#F8FAFC',
    opacity: 0.7,
    width: '55%',
  },
  value: {
    color: '#F8FAFC',
    fontWeight: 'bold',
    width: '45%',
    textAlign: 'right',
  },
  // Grid de KPIs (2 columnas fijas)
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  kpiItem: {
    width: '48%',
    marginBottom: 12,
  },
  kpiLabel: {
    fontSize: 9,
    color: '#F8FAFC',
    opacity: 0.7,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 11,
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
  // Cards de propiedades (con breakInside)
  propertyCard: {
    marginBottom: 24,
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  propertyWrapper: {
    marginBottom: 24,
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  avoidBreak: {
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  },
  propertyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#F8FAFC',
  },
  propertySubtitle: {
    fontSize: 10,
    color: '#F8FAFC',
    opacity: 0.6,
    marginBottom: 10,
  },
  // Grid de propiedades (2 columnas fijas)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 9,
    color: '#F8FAFC',
    opacity: 0.7,
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 10,
    color: '#F8FAFC',
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: 'rgba(218, 165, 32, 0.1)',
    padding: 20,
    borderRadius: 6,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(218, 165, 32, 0.3)',
    breakInside: 'avoid',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#DAA520',
  },
  badge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(53, 225, 166, 0.2)',
    borderRadius: 4,
    marginTop: 10,
  },
  badgeText: {
    fontSize: 10,
    color: '#35E1A6',
    marginLeft: 5,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 9,
    color: '#F8FAFC',
    opacity: 0.5,
    textAlign: 'center',
  },
  table: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
  },
  tableHeader: {
    flex: 1,
    fontSize: 9,
    color: '#F8FAFC',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#F8FAFC',
  },
})

export const PDFDocument: React.FC<PDFDocumentProps> = ({
  portfolio,
  assumptions,
  fecha,
}) => {
  return (
    <Document>
      {/* Portada */}
      <Page size="A4" style={styles.cover}>
        <Text style={styles.coverTitle}>Reporte Select Capital</Text>
        <Text style={styles.coverSubtitle}>Motor de Inversión Inmobiliaria</Text>
        <Text style={styles.coverDate}>{fecha}</Text>
      </Page>

      {/* Contenido */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} wrap={false}>
          <View>
            <Text style={styles.headerText}>REPORTE SELECT CAPITAL</Text>
            <Text style={styles.title}>Motor de Inversión Inmobiliaria</Text>
            <Text style={styles.subtitle}>Generado el {fecha}</Text>
          </View>
        </View>

        {/* Resumen del Portafolio */}
        <Section wrap={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen del Portafolio</Text>
            <View style={styles.summary}>
              <View style={styles.kpiGrid}>
                <KPI title="Inversión Total" value={formatCLP(portfolio.inversionTotalClp)} />
                <KPI title="Ganancia Bruta Total" value={formatCLP(portfolio.gananciaBrutaTotalClp)} />
                <KPI title="Ganancia Neta Total" value={formatCLP(portfolio.gananciaNetaTotalClp)} />
                <KPI title="Ganancia Total" value={formatCLP(portfolio.gananciaTotalClp)} />
                <KPI title="ROI Total" value={formatPercentage(portfolio.roiTotal)} />
                <KPI title="Delta Mensual (con pie)" value={formatCLP(portfolio.deltaMensualConPieTotalClp)} />
                <KPI title="Delta Mensual (sin pie)" value={formatCLP(portfolio.deltaMensualSinPieTotalClp)} />
                <KPI 
                  title={`Plusvalía Total (${assumptions.horizonteAnios} años)`} 
                  value={formatCLP(portfolio.plusvaliaHorizonteTotalClp)} 
                />
                <KPI title="Bono Pie Total" value={formatCLP(portfolio.bonoPieTotalClp)} />
                <KPI title="IVA Recuperable Total" value={formatCLP(portfolio.ivaTotalRecuperableClp)} />
              </View>
            </View>
          </View>
        </Section>

        {/* Separador */}
        <View style={styles.divider} />

        {/* Supuestos Globales */}
        <Section>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Supuestos Globales</Text>
            <View style={styles.row}>
              <Text style={styles.label}>UF Actual:</Text>
              <Text style={styles.value}>${assumptions.ufActual.toLocaleString('es-CL')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tasa Anual:</Text>
              <Text style={styles.value}>{(assumptions.tasaAnual * 100).toFixed(2)}%</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Plazo del Crédito:</Text>
              <Text style={styles.value}>{assumptions.plazoAnios} años</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Horizonte de Inversión:</Text>
              <Text style={styles.value}>{assumptions.horizonteAnios} años</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Plusvalía Año 1:</Text>
              <Text style={styles.value}>{(assumptions.plusvaliaAnio1 * 100).toFixed(2)}%</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Plusvalía Años 2+:</Text>
              <Text style={styles.value}>{(assumptions.plusvaliaDesdeAnio2 * 100).toFixed(2)}%</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>% Pie Teórico:</Text>
              <Text style={styles.value}>{(assumptions.porcentajePieTeorico * 100).toFixed(1)}%</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>% Bono Pie:</Text>
              <Text style={styles.value}>{(assumptions.porcentajeBonoPie * 100).toFixed(1)}%</Text>
            </View>
          </View>
        </Section>

        {/* Separador */}
        <View style={styles.divider} />

        {/* Propiedades - Envuelto para evitar cortes */}
        <Section>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Propiedades ({portfolio.properties.length})
            </Text>
            <View style={styles.avoidBreak}>
              {portfolio.properties.map((result, index) => (
                <View key={result.input.id} style={styles.propertyWrapper}>
                  <View style={styles.propertyCard}>
                    <Text style={styles.propertyTitle}>
                      {index + 1}. {result.input.nombreProyecto}
                    </Text>
                    <Text style={styles.propertySubtitle}>
                      {result.input.comuna} • {result.input.tipologia} • {result.input.m2Totales} m²
                    </Text>
                    <View style={styles.grid}>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Valor Propiedad:</Text>
                        <Text style={styles.gridValue}>{formatCLP(result.valorClp)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Dividendo Mensual:</Text>
                        <Text style={styles.gridValue}>{formatCLP(result.dividendoClp)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Inversión Total:</Text>
                        <Text style={styles.gridValue}>{formatCLP(result.inversionTotalPropiedadClp)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Ganancia Bruta (4 años):</Text>
                        <Text style={styles.gridValue}>{formatCLP(result.gananciaBrutaClp)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Ganancia Neta (4 años):</Text>
                        <Text style={styles.gridValue}>{formatCLP(result.gananciaNetaClp)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>ROI sobre Inversión:</Text>
                        <Text style={styles.gridValue}>{formatPercentage(result.roiSobreInversion)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Delta Mensual (con pie):</Text>
                        <Text style={styles.gridValue}>{formatCLP(result.deltaMensualConPieClp)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Delta Mensual (sin pie):</Text>
                        <Text style={styles.gridValue}>{formatCLP(result.deltaMensualSinPieClp)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Plusvalía ({assumptions.horizonteAnios} años):</Text>
                        <Text style={styles.gridValue}>{formatCLP(result.plusvaliaHorizonteClp)}</Text>
                      </View>
                      <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Rentabilidad Bruta:</Text>
                        <Text style={styles.gridValue}>{formatPercentage(result.rentabilidadBruta)}</Text>
                      </View>
                      {result.bonoPieClp > 0 && (
                        <View style={styles.gridItem}>
                          <Text style={styles.gridLabel}>Bono Pie:</Text>
                          <Text style={styles.gridValue}>{formatCLP(result.bonoPieClp)}</Text>
                        </View>
                      )}
                      {result.ivaRecuperableClp > 0 && (
                        <View style={styles.gridItem}>
                          <Text style={styles.gridLabel}>IVA Recuperable:</Text>
                          <Text style={styles.gridValue}>{formatCLP(result.ivaRecuperableClp)}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Select Capital</Text>
          <Text>contacto@selectcapital.cl</Text>
          <Text>+56 9 6601 3182</Text>
        </View>
      </Page>
    </Document>
  )
}

