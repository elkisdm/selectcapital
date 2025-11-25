'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { calculatorSchema, type CalculatorFormData } from '../utils/validation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { parseCurrency, formatNumber, formatCurrencyInput, formatNumberInput } from '@/lib/utils'
import { calculateDividendoMax, calculateRentaAjustada } from '../utils/mortgage'
import { useState } from 'react'

interface FormProps {
  onSubmit: (data: CalculatorFormData) => void
  onGeneratePDF?: () => void
  hasResults?: boolean
}

export function Form({ onSubmit, hasResults = false }: FormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      enableClientData: false,
      nombre: '',
      rut: '',
      email: '',
      telefono: '',
      tipoIngresoDependienteFijo: false,
      tipoIngresoDependienteVariable: false,
      tipoIngresoIndependiente: false,
      renta1: 0,
      complementaRenta: false,
      renta2: 0,
      deudaMensualTotal: 0,
      deudaTotal: 0,
      tasaInteres: 4.5,
      plazo: '30',
      ltv80: true,
      ltv85: true,
      ltv90: false,
      enableBusquedaInversa: false,
      valorUFProyecto: undefined,
    },
  })

  const watchAllFields = watch()
  const renta1 = watchAllFields.renta1 || 0
  const renta2 = watchAllFields.renta2 || 0
  const complementaRenta = watchAllFields.complementaRenta
  const enableClientData = watchAllFields.enableClientData
  const tiposIngreso = {
    dependienteFijo: watchAllFields.tipoIngresoDependienteFijo,
    dependienteVariable: watchAllFields.tipoIngresoDependienteVariable,
    independiente: watchAllFields.tipoIngresoIndependiente,
  }

  const rentaTotal = (renta1 || 0) + (complementaRenta ? (renta2 || 0) : 0)
  
  // Calcular renta ajustada según tipos de ingreso
  const rentaAjustada = calculateRentaAjustada(rentaTotal, tiposIngreso)

  // Calcular dividendo máximo con 25% fijo
  const dividendoMax = calculateDividendoMax(rentaAjustada)

  // Determinar el porcentaje aplicado
  let porcentajeAplicado = '0%'
  if (tiposIngreso.independiente) {
    porcentajeAplicado = '70%'
  } else if (tiposIngreso.dependienteVariable) {
    porcentajeAplicado = '80%'
  } else if (tiposIngreso.dependienteFijo) {
    porcentajeAplicado = '100%'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      {/* Búsqueda Inversa - Al inicio */}
      <Card className="shadow-sm border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">Búsqueda Inversa</CardTitle>
              <CardDescription className="text-xs mt-1">
                ¿Ya tienes un proyecto en mente? Ingresa su valor y te mostramos los requerimientos
              </CardDescription>
            </div>
            <Controller
              name="enableBusquedaInversa"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    if (!checked) {
                      setValue('valorUFProyecto', undefined)
                    }
                  }}
                />
              )}
            />
          </div>
        </CardHeader>
        {watchAllFields.enableBusquedaInversa && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Label htmlFor="valorUFProyecto">Valor del Proyecto (UF) *</Label>
              <Controller
                name="valorUFProyecto"
                control={control}
                render={({ field }) => (
                  <Input
                    id="valorUFProyecto"
                    type="text"
                    placeholder="2.800"
                    value={(field.value || 0) > 0 ? formatNumberInput(field.value!, 1) : ''}
                    onChange={(e) => {
                      const parsed = parseCurrency(e.target.value)
                      field.onChange(parsed)
                    }}
                  />
                )}
              />
              {errors.valorUFProyecto && (
                <p className="text-sm text-destructive">{errors.valorUFProyecto.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Al calcular, verás los requerimientos específicos para acceder a este proyecto (pie, dividendo, etc.)
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Datos del Cliente (Opcional) */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 md:pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Datos del Cliente</CardTitle>
              <CardDescription>Opcional: Incluir en el PDF generado</CardDescription>
            </div>
            <Controller
              name="enableClientData"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardHeader>
        {enableClientData && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <Input
                    id="nombre"
                    placeholder="Juan Pérez"
                    {...field}
                  />
                )}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">{errors.nombre.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Controller
                name="rut"
                control={control}
                render={({ field }) => (
                  <Input
                    id="rut"
                    placeholder="12.345.678-9"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono/WhatsApp</Label>
                <Controller
                  name="telefono"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="telefono"
                      placeholder="+56 9 1234 5678"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tipo de Ingreso (Múltiple) */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg">Tipo de Ingreso</CardTitle>
          <CardDescription>Selecciona todos los que apliquen (puedes combinar)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Controller
              name="tipoIngresoDependienteFijo"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="tipoIngresoDependienteFijo"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="flex-1">
              <Label htmlFor="tipoIngresoDependienteFijo" className="cursor-pointer font-normal">
                Dependiente - Ingreso Fijo (100%)
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Sueldo fijo mensual con contrato
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Controller
              name="tipoIngresoDependienteVariable"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="tipoIngresoDependienteVariable"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="flex-1">
              <Label htmlFor="tipoIngresoDependienteVariable" className="cursor-pointer font-normal">
                Dependiente - Ingreso Variable (80%)
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Con comisiones o bonos variables
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Controller
              name="tipoIngresoIndependiente"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="tipoIngresoIndependiente"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="flex-1">
              <Label htmlFor="tipoIngresoIndependiente" className="cursor-pointer font-normal">
                Independiente con Boletas (70%)
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Trabajo independiente o freelance
              </p>
            </div>
          </div>
          {(errors.tipoIngresoDependienteFijo) && (
            <p className="text-sm text-destructive">
              Selecciona al menos un tipo de ingreso
            </p>
          )}
          <div className="p-3 glass rounded-lg border border-muted mt-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Nota:</strong> Si seleccionas múltiples tipos, se aplicará el porcentaje más conservador para el cálculo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Renta */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg">Renta</CardTitle>
          <CardDescription>Ingresos mensuales totales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="renta1">Renta Principal *</Label>
            <Controller
              name="renta1"
              control={control}
              render={({ field }) => (
                <Input
                  id="renta1"
                  type="text"
                  placeholder="1.500.000"
                  value={field.value > 0 ? formatCurrencyInput(field.value) : ''}
                  onChange={(e) => {
                    const parsed = parseCurrency(e.target.value)
                    field.onChange(parsed)
                  }}
                />
              )}
            />
            {errors.renta1 && (
              <p className="text-sm text-destructive">{errors.renta1.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="complementaRenta"
              control={control}
              render={({ field }) => (
                <Switch
                  id="complementaRenta"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="complementaRenta" className="cursor-pointer">
              Complementa con otra renta
            </Label>
          </div>
          {complementaRenta && (
            <div className="space-y-2">
              <Label htmlFor="renta2">Renta Complementaria</Label>
              <Controller
                name="renta2"
                control={control}
                render={({ field }) => (
                  <Input
                    id="renta2"
                    type="text"
                    placeholder="500.000"
                    value={(field.value || 0) > 0 ? formatCurrencyInput(field.value || 0) : ''}
                    onChange={(e) => {
                      const parsed = parseCurrency(e.target.value)
                      field.onChange(parsed)
                    }}
                  />
                )}
              />
              {errors.renta2 && (
                <p className="text-sm text-destructive">{errors.renta2.message}</p>
              )}
            </div>
          )}
          <div className="pt-2 border-t border-border space-y-1">
            <p className="text-sm text-muted-foreground">
              Renta Total: <span className="font-semibold text-foreground">{formatNumber(rentaTotal)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Renta Ajustada ({porcentajeAplicado}): <span className="font-semibold text-primary">{formatNumber(rentaAjustada)}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Dividendo Máximo (25%): <span className="font-semibold text-primary">{formatNumber(dividendoMax)}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deudas */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg">Deudas</CardTitle>
          <CardDescription>Cuotas mensuales y deuda total</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deudaMensualTotal">Cuota Mensual Total</Label>
            <Controller
              name="deudaMensualTotal"
              control={control}
              render={({ field }) => (
                <Input
                  id="deudaMensualTotal"
                  type="text"
                  placeholder="200.000"
                  value={field.value > 0 ? formatCurrencyInput(field.value) : ''}
                  onChange={(e) => {
                    const parsed = parseCurrency(e.target.value)
                    field.onChange(parsed)
                  }}
                />
              )}
            />
            {errors.deudaMensualTotal && (
              <p className="text-sm text-destructive">{errors.deudaMensualTotal.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="deudaTotal">Deuda Total</Label>
            <Controller
              name="deudaTotal"
              control={control}
              render={({ field }) => (
                <Input
                  id="deudaTotal"
                  type="text"
                  placeholder="5.000.000"
                  value={field.value > 0 ? formatCurrencyInput(field.value) : ''}
                  onChange={(e) => {
                    const parsed = parseCurrency(e.target.value)
                    field.onChange(parsed)
                  }}
                />
              )}
            />
            {errors.deudaTotal && (
              <p className="text-sm text-destructive">{errors.deudaTotal.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parámetros Hipotecarios */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg">Parámetros Hipotecarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tasaInteres">Tasa de Interés Anual (%)</Label>
            <Controller
              name="tasaInteres"
              control={control}
              render={({ field }) => (
                <Input
                  id="tasaInteres"
                  type="text"
                  placeholder="4.5"
                  value={field.value > 0 ? formatNumberInput(field.value, 1) : ''}
                  onChange={(e) => {
                    const parsed = parseCurrency(e.target.value)
                    field.onChange(parsed)
                  }}
                />
              )}
            />
            {errors.tasaInteres && (
              <p className="text-sm text-destructive">{errors.tasaInteres.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="plazo">Plazo (años)</Label>
            <Controller
              name="plazo"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="plazo">
                    <SelectValue placeholder="Selecciona un plazo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20 años</SelectItem>
                    <SelectItem value="25">25 años</SelectItem>
                    <SelectItem value="30">30 años</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.plazo && (
              <p className="text-sm text-destructive">{errors.plazo.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financiamiento */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg">Financiamiento</CardTitle>
          <CardDescription>Selecciona las opciones de LTV a evaluar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="ltv80"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="ltv80"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="ltv80" className="cursor-pointer font-normal">
              80% LTV (20% pie)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="ltv85"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="ltv85"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="ltv85" className="cursor-pointer font-normal">
              85% LTV (15% pie)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="ltv90"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="ltv90"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="ltv90" className="cursor-pointer font-normal">
              90% LTV (10% pie)
            </Label>
          </div>
          {(errors.ltv80 || errors.ltv85 || errors.ltv90) && (
            <p className="text-sm text-destructive">
              Selecciona al menos una opción de financiamiento
            </p>
          )}
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="pt-4">
        <Button type="submit" className="w-full" size="lg">
          {watchAllFields.enableBusquedaInversa ? 'Evaluar Proyecto' : 'Calcular Capacidad'}
        </Button>
      </div>
    </form>
  )
}
