'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Upload, Trash2, FileSpreadsheet } from 'lucide-react'
import type { GlobalAssumptions, PropertyInput } from '@/src/types/investment'

interface DataManagementProps {
  assumptions: GlobalAssumptions
  properties: PropertyInput[]
  onImport: (data: { assumptions: GlobalAssumptions; properties: PropertyInput[] }) => void
  onClear: () => void
}

export function DataManagement({
  assumptions,
  properties,
  onImport,
  onClear,
}: DataManagementProps) {
  const handleExport = () => {
    try {
      const data = {
        assumptions,
        properties,
        exportDate: new Date().toISOString(),
        version: '1.0',
      }
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], {
        type: 'application/json;charset=utf-8',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `portafolio-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      
      // Limpiar después de un breve delay
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('Error exportando JSON:', error)
      alert('Error al exportar el archivo. Por favor, intenta nuevamente.')
    }
  }

  const handleExportCSV = () => {
    try {
      const lines: string[] = []
      
      // Función helper para escapar valores CSV
      const escapeCSV = (value: any): string => {
        if (value === null || value === undefined) return ''
        const str = String(value)
        // Si contiene comas, comillas o saltos de línea, envolver en comillas y escapar comillas
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`
        }
        return str
      }

      // Encabezado
      lines.push('REPORTE DE PORTAFOLIO INMOBILIARIO - SELECT CAPITAL')
      lines.push(`Fecha de exportación: ${new Date().toLocaleDateString('es-CL')}`)
      lines.push('')

      // Sección de Supuestos Globales
      lines.push('SUPUESTOS GLOBALES')
      lines.push('Parámetro,Valor')
      lines.push(`UF Actual (CLP),${assumptions.ufActual}`)
      lines.push(`Tasa Anual,${(assumptions.tasaAnual * 100).toFixed(2)}%`)
      lines.push(`Plazo (años),${assumptions.plazoAnios}`)
      lines.push(`Plusvalía Año 1,${(assumptions.plusvaliaAnio1 * 100).toFixed(2)}%`)
      lines.push(`Plusvalía Años 2+,${(assumptions.plusvaliaDesdeAnio2 * 100).toFixed(2)}%`)
      lines.push(`% Pie Teórico,${(assumptions.porcentajePieTeorico * 100).toFixed(1)}%`)
      lines.push(`% Bono Pie,${(assumptions.porcentajeBonoPie * 100).toFixed(1)}%`)
      lines.push(`Meses Pie en Cuotas,${assumptions.mesesPieEnCuotas}`)
      lines.push(`% Gastos Banco,${(assumptions.porcentajeGastosBanco * 100).toFixed(2)}%`)
      lines.push(`IVA (%),${(assumptions.ivaPorcentaje * 100).toFixed(0)}%`)
      lines.push(`Factor IVA Recuperable,${(assumptions.ivaFactorRecuperable * 100).toFixed(0)}%`)
      lines.push(`Horizonte (años),${assumptions.horizonteAnios}`)
      lines.push('')

      // Sección de Propiedades
      if (properties.length > 0) {
        lines.push('PROPIEDADES')
        // Encabezados de propiedades
        const propertyHeaders = [
          'ID',
          'Nombre del Proyecto',
          'Comuna',
          'Tipología',
          'm² Totales',
          'Valor (UF)',
          '% Financiamiento',
          'Arriendo Estimado (CLP)',
          'Gasto Común (CLP)',
          'Otros Gastos Mensuales (CLP)',
          'Reserva (CLP)',
          'Abonos Iniciales (CLP)',
          'Costos Mobiliario (CLP)',
          'Costos Gestión (CLP)',
          'Aplica Bono Pie',
          'Aplica IVA Inversión',
          'Meses Gracia Delta',
        ]
        lines.push(propertyHeaders.map(escapeCSV).join(','))

        // Datos de cada propiedad
        properties.forEach((property) => {
          const row = [
            property.id,
            property.nombreProyecto,
            property.comuna,
            property.tipologia,
            property.m2Totales,
            property.valorUf,
            (property.porcentajeFinanciamiento * 100).toFixed(1) + '%',
            property.arriendoEstimadoClp,
            property.gastoComunClp,
            property.otrosGastosMensualesClp,
            property.reservaClp,
            property.abonosInicialesClp,
            property.costosMobiliarioClp,
            property.costosGestionClp,
            property.aplicaBonoPie ? 'Sí' : 'No',
            property.aplicaIvaInversion ? 'Sí' : 'No',
            property.mesesGraciaDelta,
          ]
          lines.push(row.map(escapeCSV).join(','))
        })
      } else {
        lines.push('PROPIEDADES')
        lines.push('No hay propiedades agregadas')
      }

      // Convertir a CSV con BOM para Excel
      const csvContent = '\uFEFF' + lines.join('\n')
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `portafolio-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()

      // Limpiar después de un breve delay
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('Error exportando CSV:', error)
      alert('Error al exportar el archivo CSV. Por favor, intenta nuevamente.')
    }
  }

  const handleImport = () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json,application/json'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onerror = () => {
          alert('Error al leer el archivo. Por favor, intenta nuevamente.')
        }
        reader.onload = (event) => {
          try {
            if (!event.target?.result) {
              throw new Error('No se pudo leer el archivo')
            }

            const text = event.target.result as string
            if (!text || text.trim() === '') {
              throw new Error('El archivo está vacío')
            }

            // Limpiar el texto antes de parsear (eliminar caracteres extra al final)
            const cleanedText = text.trim()
            
            let data
            try {
              data = JSON.parse(cleanedText)
            } catch (parseError) {
              // Proporcionar un mensaje de error más útil
              if (parseError instanceof SyntaxError) {
                const match = parseError.message.match(/position (\d+)/)
                const position = match ? parseInt(match[1]) : null
                if (position) {
                  const line = cleanedText.substring(0, position).split('\n').length
                  const column = cleanedText.substring(0, position).split('\n').pop()?.length || 0
                  throw new Error(
                    `Error de formato JSON en la línea ${line}, columna ${column + 1}. ` +
                    `Verifica que el archivo sea un JSON válido sin caracteres extra.`
                  )
                }
                throw new Error(`Error de formato JSON: ${parseError.message}`)
              }
              throw parseError
            }
            
            // Validar estructura básica
            if (!data || typeof data !== 'object') {
              throw new Error('El archivo no tiene un formato JSON válido')
            }

            if (!data.assumptions || typeof data.assumptions !== 'object') {
              throw new Error('El archivo no contiene supuestos globales válidos')
            }

            if (!Array.isArray(data.properties)) {
              throw new Error('El archivo no contiene un array de propiedades válido')
            }

            onImport({
              assumptions: data.assumptions,
              properties: data.properties,
            })
            
            alert('Datos importados correctamente')
          } catch (error) {
            console.error('Error importing data:', error)
            const message = error instanceof Error ? error.message : 'Error desconocido'
            alert(`Error al importar el archivo: ${message}`)
          }
        }
        reader.readAsText(file, 'UTF-8')
      }
      input.click()
    } catch (error) {
      console.error('Error setting up file input:', error)
      alert('Error al configurar la importación. Por favor, intenta nuevamente.')
    }
  }

  const handleClear = () => {
    if (
      confirm(
        '¿Estás seguro de limpiar todos los datos? Esta acción no se puede deshacer.'
      )
    ) {
      onClear()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Datos</CardTitle>
        <CardDescription>
          Exporta, importa o limpia tus datos del portafolio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sección de Exportación */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Exportar</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={handleExport} 
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              <div className="flex flex-col items-start">
                <span>Exportar JSON</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Formato completo
                </span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExportCSV} 
              className="w-full justify-start"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              <div className="flex flex-col items-start">
                <span>Exportar CSV</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Compatible con Excel
                </span>
              </div>
            </Button>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-border" />

        {/* Sección de Importación y Limpieza */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Importar / Limpiar</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              onClick={handleImport} 
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar JSON
            </Button>
            <Button
              variant="destructive"
              onClick={handleClear}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Todo
            </Button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Nota:</span> Los datos se guardan automáticamente en tu navegador. 
            Usa exportar para hacer una copia de respaldo. El CSV es compatible con Excel y Google Sheets.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

