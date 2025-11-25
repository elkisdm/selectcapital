import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import { type CalculatorFormData } from '../utils/validation'
import { formatCLP, formatUF } from '@/lib/utils'
import {
  calculateCreditoMax,
  calculateValorPropiedad,
  calculateDividendoEstimado,
  calculatePie,
  pesoToUF,
  evaluateProject,
} from '../utils/mortgage'

// Registrar fuente Inter si está disponible
// En producción, deberías incluir la fuente Inter en el proyecto

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#05080F',
    color: '#F8FAFC',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DAA520',
    borderBottomStyle: 'solid',
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  headerText: {
    fontSize: 10,
    color: '#DAA520',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 12,
    color: '#F8FAFC',
    opacity: 0.7,
  },
  section: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#DAA520',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 11,
  },
  label: {
    color: '#F8FAFC',
    opacity: 0.7,
  },
  value: {
    color: '#F8FAFC',
    fontWeight: 'bold',
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
  qrContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 8,
    color: '#F8FAFC',
    opacity: 0.7,
    marginTop: 5,
  },
})

interface PDFDocumentProps {
  formData: CalculatorFormData
  rentaTotal: number
  rentaAjustada: number
  creditoMax: number
  creditoMaxUF: number
  scenarios: Array<{
    ltv: number
    valorPropiedadUF: number
    valorPropiedadCLP: number
    pieUF: number
    pieCLP: number
    dividendoEstimado: number
  }>
  projectEvaluation: {
    status: 'viable' | 'marginal' | 'no_viable'
    message: string
  } | null
  recommendations: string[]
  fecha: string
}

export function PDFDocument({
  formData,
  rentaTotal,
  rentaAjustada,
  creditoMax,
  creditoMaxUF,
  scenarios,
  projectEvaluation,
  recommendations,
  fecha,
}: PDFDocumentProps) {
  const dividendo25 = (rentaAjustada * 25) / 100
  const dividendo30 = (rentaAjustada * 30) / 100
  const dividendo35 = (rentaAjustada * 35) / 100

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>PROPUESTA SELECT CAPITAL</Text>
            <Text style={styles.title}>Calculadora Hipotecaria</Text>
            <Text style={styles.subtitle}>Generado el {fecha}</Text>
          </View>
        </View>

        {/* Datos del Cliente */}
        {formData.enableClientData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del Cliente</Text>
            {formData.nombre && (
              <View style={styles.row}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{formData.nombre}</Text>
              </View>
            )}
            {formData.rut && (
              <View style={styles.row}>
                <Text style={styles.label}>RUT:</Text>
                <Text style={styles.value}>{formData.rut}</Text>
              </View>
            )}
            {formData.email && (
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{formData.email}</Text>
              </View>
            )}
            {formData.telefono && (
              <View style={styles.row}>
                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.value}>{formData.telefono}</Text>
              </View>
            )}
          </View>
        )}

        {/* Renta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Renta</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Renta Principal:</Text>
            <Text style={styles.value}>{formatCLP(formData.renta1)}</Text>
          </View>
          {formData.complementaRenta && formData.renta2 && (
            <View style={styles.row}>
              <Text style={styles.label}>Renta Complementaria:</Text>
              <Text style={styles.value}>{formatCLP(formData.renta2)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Renta Total:</Text>
            <Text style={styles.value}>{formatCLP(rentaTotal)}</Text>
          </View>
          {formData.tipoIngreso && (
            <View style={styles.row}>
              <Text style={styles.label}>Renta Ajustada ({formData.tipoIngreso === 'dependiente_fijo' ? '100%' : formData.tipoIngreso === 'dependiente_variable' ? '80%' : '70%'}):</Text>
              <Text style={styles.value}>{formatCLP(rentaAjustada)}</Text>
            </View>
          )}
        </View>

        {/* Capacidad Hipotecaria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Capacidad Hipotecaria</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Dividendo Máximo (25% - Estándar):</Text>
            <Text style={styles.value}>{formatCLP(dividendo25)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dividendo Máximo (30%):</Text>
            <Text style={styles.value}>{formatCLP(dividendo30)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dividendo Máximo (35%):</Text>
            <Text style={styles.value}>{formatCLP(dividendo35)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Crédito Máximo:</Text>
            <Text style={styles.value}>{formatCLP(creditoMax)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Crédito Máximo (UF):</Text>
            <Text style={styles.value}>{formatUF(creditoMaxUF)}</Text>
          </View>
        </View>

        {/* Escenarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escenarios de Financiamiento</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>LTV</Text>
              <Text style={styles.tableHeader}>Valor Propiedad</Text>
              <Text style={styles.tableHeader}>Pie</Text>
              <Text style={styles.tableHeader}>Dividendo</Text>
            </View>
            {scenarios.map((scenario) => (
              <View key={scenario.ltv} style={styles.tableRow}>
                <Text style={styles.tableCell}>{scenario.ltv}%</Text>
                <Text style={styles.tableCell}>
                  {formatUF(scenario.valorPropiedadUF)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatUF(scenario.pieUF)}
                </Text>
                <Text style={styles.tableCell}>
                  {formatCLP(scenario.dividendoEstimado)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Evaluación del Proyecto */}
        {projectEvaluation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evaluación del Proyecto</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {projectEvaluation.status.toUpperCase()}: {projectEvaluation.message}
              </Text>
            </View>
          </View>
        )}

        {/* Recomendaciones */}
        {recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recomendaciones</Text>
            {recommendations.map((rec, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 10, color: '#F8FAFC', opacity: 0.8 }}>
                  • {rec}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Glosario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Glosario de Términos</Text>
          <View style={{ marginBottom: 12, padding: 10, backgroundColor: 'rgba(218, 165, 32, 0.1)', borderRadius: 4, borderWidth: 1, borderColor: 'rgba(218, 165, 32, 0.3)' }}>
            <Text style={{ fontSize: 9, color: '#DAA520', fontWeight: 'bold', marginBottom: 4 }}>
              📖 Cómo leer este glosario
            </Text>
            <Text style={{ fontSize: 8, color: '#F8FAFC', opacity: 0.8 }}>
              • Los términos están ordenados alfabéticamente para facilitar la búsqueda{'\n'}
              • Usa este glosario como referencia mientras revisas tus resultados{'\n'}
              • Consulta los términos cuando tengas dudas sobre conceptos financieros
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Dividendo
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Es el pago mensual que realizas al banco por tu crédito hipotecario. Incluye capital e intereses, calculado mediante el sistema de amortización francesa.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                LTV (Loan-to-Value)
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Relación entre el monto del crédito y el valor de la propiedad. Por ejemplo, un LTV del 80% significa que el banco financia el 80% del valor de la propiedad y tú debes aportar el 20% restante como pie.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Pie
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Es el monto inicial que debes pagar de tu propio dinero para adquirir la propiedad. Se calcula como el porcentaje del valor de la propiedad que no está cubierto por el crédito hipotecario.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Tasa de Interés
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Porcentaje anual que el banco cobra por prestarte el dinero. Esta tasa se aplica mensualmente dividida entre 12 meses.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Plazo
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Tiempo total en años que tienes para pagar el crédito hipotecario. Los plazos comunes son 20, 25 y 30 años.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Amortización Francesa
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Sistema de pago donde el dividendo mensual se mantiene constante durante todo el plazo del crédito. Al inicio, pagas más intereses y menos capital; al final, más capital y menos intereses.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Renta Ajustada
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Porcentaje de tu renta que el banco considera para calcular tu capacidad de pago. Varía según tu tipo de ingreso: Dependiente fijo (100%), Dependiente variable (80%), Independiente (70%).
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Capacidad de Endeudamiento
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Porcentaje máximo de tu renta que puedes destinar al pago de dividendos. Generalmente se considera entre 25% y 35% de tu renta ajustada.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Crédito Máximo
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Monto máximo que un banco puede prestarte basado en tu capacidad de pago, tasa de interés y plazo seleccionado.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                UF (Unidad de Fomento)
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Unidad de cuenta reajustable según la inflación, utilizada en Chile para créditos hipotecarios y transacciones inmobiliarias. Su valor se actualiza diariamente.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Valor Propiedad
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Precio total de la propiedad inmobiliaria que deseas adquirir, expresado en UF o pesos chilenos.
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#DAA520', marginBottom: 4 }}>
                Búsqueda Inversa
              </Text>
              <Text style={{ fontSize: 9, color: '#F8FAFC', opacity: 0.8, lineHeight: 1.4 }}>
                Herramienta que te permite evaluar si un proyecto inmobiliario específico es viable según tu capacidad de crédito actual.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Select Capital</Text>
          <Text>contacto@selectcapital.cl</Text>
          <Text>+56 9 6601 3182</Text>
          <View style={styles.qrContainer}>
            <Text style={styles.qrText}>
              Escanea el código QR para contactarnos por WhatsApp
            </Text>
            {/* QR code se generaría aquí con una librería como qrcode */}
          </View>
        </View>
      </Page>
    </Document>
  )
}

