'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { formatCLP } from '@/lib/utils'

export function UFIndicator() {
  const [ufValue, setUfValue] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const fetchUF = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/uf')
      if (!response.ok) throw new Error('Error al obtener UF')
      const data = await response.json()
      setUfValue(data.uf)
      setLastUpdate(new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }))
    } catch (error) {
      console.error('Error obteniendo UF:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUF()
    // Actualizar cada hora
    const interval = setInterval(fetchUF, 3600000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 glass rounded-lg border border-border">
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1 md:gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">UF:</span>
          {isLoading ? (
            <span className="text-xs md:text-sm font-medium whitespace-nowrap">...</span>
          ) : ufValue ? (
            <span className="text-xs md:text-sm font-semibold text-primary whitespace-nowrap">
              ${Math.round(ufValue).toLocaleString('es-CL')}
            </span>
          ) : (
            <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">—</span>
          )}
        </div>
        {lastUpdate && (
          <span className="text-[10px] md:text-xs text-muted-foreground/70 whitespace-nowrap hidden md:block">
            {lastUpdate}
          </span>
        )}
      </div>
      <button
        onClick={fetchUF}
        disabled={isLoading}
        className="p-1 md:p-1.5 hover:bg-accent rounded transition-colors disabled:opacity-50 flex-shrink-0"
        title="Actualizar UF"
      >
        <RefreshCw className={`h-3 w-3 md:h-3.5 md:w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}

