'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const glossaryTerms = [
  {
    term: 'Dividendo',
    definition: 'Es el pago mensual que realizas al banco por tu crédito hipotecario. Incluye capital e intereses, calculado mediante el sistema de amortización francesa.',
  },
  {
    term: 'LTV (Loan-to-Value)',
    definition: 'Relación entre el monto del crédito y el valor de la propiedad. Por ejemplo, un LTV del 80% significa que el banco financia el 80% del valor de la propiedad y tú debes aportar el 20% restante como pie.',
  },
  {
    term: 'Pie',
    definition: 'Es el monto inicial que debes pagar de tu propio dinero para adquirir la propiedad. Se calcula como el porcentaje del valor de la propiedad que no está cubierto por el crédito hipotecario.',
  },
  {
    term: 'Tasa de Interés',
    definition: 'Porcentaje anual que el banco cobra por prestarte el dinero. Esta tasa se aplica mensualmente dividida entre 12 meses.',
  },
  {
    term: 'Plazo',
    definition: 'Tiempo total en años que tienes para pagar el crédito hipotecario. Los plazos comunes son 20, 25 y 30 años.',
  },
  {
    term: 'Amortización Francesa',
    definition: 'Sistema de pago donde el dividendo mensual se mantiene constante durante todo el plazo del crédito. Al inicio, pagas más intereses y menos capital; al final, más capital y menos intereses.',
  },
  {
    term: 'Renta Ajustada',
    definition: 'Porcentaje de tu renta que el banco considera para calcular tu capacidad de pago. Varía según tu tipo de ingreso: Dependiente fijo (100%), Dependiente variable (80%), Independiente (70%).',
  },
  {
    term: 'Capacidad de Endeudamiento',
    definition: 'Porcentaje máximo de tu renta que puedes destinar al pago de dividendos. Generalmente se considera entre 25% y 35% de tu renta ajustada.',
  },
  {
    term: 'Crédito Máximo',
    definition: 'Monto máximo que un banco puede prestarte basado en tu capacidad de pago, tasa de interés y plazo seleccionado.',
  },
  {
    term: 'UF (Unidad de Fomento)',
    definition: 'Unidad de cuenta reajustable según la inflación, utilizada en Chile para créditos hipotecarios y transacciones inmobiliarias. Su valor se actualiza diariamente.',
  },
  {
    term: 'Valor Propiedad',
    definition: 'Precio total de la propiedad inmobiliaria que deseas adquirir, expresado en UF o pesos chilenos.',
  },
  {
    term: 'Búsqueda Inversa',
    definition: 'Herramienta que te permite evaluar si un proyecto inmobiliario específico es viable según tu capacidad de crédito actual.',
  },
]

export function Glossary() {
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set())

  const toggleTerm = (term: string) => {
    const newExpanded = new Set(expandedTerms)
    if (newExpanded.has(term)) {
      newExpanded.delete(term)
    } else {
      newExpanded.add(term)
    }
    setExpandedTerms(newExpanded)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Glosario de Términos</CardTitle>
              <CardDescription>
                Guía de conceptos clave para entender tu capacidad hipotecaria
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 glass rounded-lg border border-primary/20">
            <h3 className="font-semibold text-sm mb-2 text-primary">📖 Cómo leer este glosario</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Haz clic en cualquier término para ver su definición completa</li>
              <li>Los términos están ordenados alfabéticamente para facilitar la búsqueda</li>
              <li>Usa este glosario como referencia mientras revisas tus resultados</li>
            </ul>
          </div>
          <div className="space-y-2">
            {glossaryTerms.map((item, index) => {
              const isExpanded = expandedTerms.has(item.term)
              return (
                <motion.div
                  key={item.term}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => toggleTerm(item.term)}
                    className="w-full text-left p-3 glass rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{item.term}</h4>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    {isExpanded && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 text-sm text-muted-foreground leading-relaxed"
                      >
                        {item.definition}
                      </motion.p>
                    )}
                  </button>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}




