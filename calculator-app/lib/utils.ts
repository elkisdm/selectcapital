import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatters
export const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export const ufFormatter = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatCLP(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '—'
  return clpFormatter.format(Math.round(value))
}

export function formatUF(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '—'
  return `${ufFormatter.format(value)} UF`
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return ''
  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

export function parseCurrency(value: string): number {
  if (!value) return 0
  const normalized = value
    .toString()
    .replace(/[^0-9,.-]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
  const number = Number(normalized)
  return Number.isFinite(number) ? number : 0
}

export function formatCurrencyInput(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return ''
  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(value))
}

export function formatNumberInput(value: number, decimals: number = 1): string {
  if (!Number.isFinite(value) || value <= 0) return ''
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  }).format(value)
}

