import { z } from 'zod'

/**
 * Schema de validación para el formulario de calculadora
 */
export const calculatorSchema = z.object({
  // Datos del cliente (opcionales)
  enableClientData: z.boolean().default(false),
  nombre: z.string().optional(),
  rut: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  telefono: z.string().optional(),

  // Tipos de ingreso (múltiples opciones permitidas)
  tipoIngresoDependienteFijo: z.boolean().default(false),
  tipoIngresoDependienteVariable: z.boolean().default(false),
  tipoIngresoIndependiente: z.boolean().default(false),

  // Renta
  renta1: z.number().min(1, 'La renta debe ser mayor a 0'),
  complementaRenta: z.boolean().default(false),
  renta2: z.number().min(0, 'La renta no puede ser negativa').optional(),

  // Deudas
  deudaMensualTotal: z.number().min(0, 'La cuota no puede ser negativa').default(0),
  deudaTotal: z.number().min(0, 'La deuda no puede ser negativa').default(0),

  // Parámetros hipotecarios
  tasaInteres: z.number().min(1, 'La tasa debe ser al menos 1%').max(8, 'La tasa no puede exceder 8%'),
  plazo: z.enum(['20', '25', '30'], {
    required_error: 'Selecciona un plazo',
  }),

  // Financiamiento (al menos uno debe estar seleccionado)
  ltv80: z.boolean().default(false),
  ltv85: z.boolean().default(false),
  ltv90: z.boolean().default(false),

  // Búsqueda inversa (opcional)
  enableBusquedaInversa: z.boolean().default(false),
  valorUFProyecto: z.number().min(0, 'El valor no puede ser negativo').optional(),

  // Valor UF (se pasa desde el page, no desde el formulario)
  valorUF: z.number().optional(),
}).refine(
  (data) => data.tipoIngresoDependienteFijo || data.tipoIngresoDependienteVariable || data.tipoIngresoIndependiente,
  {
    message: 'Selecciona al menos un tipo de ingreso',
    path: ['tipoIngresoDependienteFijo'],
  }
).refine(
  (data) => data.ltv80 || data.ltv85 || data.ltv90,
  {
    message: 'Selecciona al menos una opción de financiamiento',
    path: ['ltv80'],
  }
).refine(
  (data) => {
    if (data.enableClientData) {
      return data.nombre && data.nombre.length > 0
    }
    return true
  },
  {
    message: 'El nombre es requerido cuando se habilitan los datos del cliente',
    path: ['nombre'],
  }
).refine(
  (data) => {
    if (data.complementaRenta && data.renta2 !== undefined) {
      return data.renta2 >= 0
    }
    return true
  },
  {
    message: 'Si complementas renta, el valor debe ser válido',
    path: ['renta2'],
  }
).refine(
  (data) => {
    if (data.enableBusquedaInversa) {
      return data.valorUFProyecto && data.valorUFProyecto > 0
    }
    return true
  },
  {
    message: 'Ingresa el valor del proyecto en UF',
    path: ['valorUFProyecto'],
  }
)

export type CalculatorFormData = z.infer<typeof calculatorSchema>
