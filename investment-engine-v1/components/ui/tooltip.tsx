'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ children, content, side = 'bottom', className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [actualSide, setActualSide] = React.useState(side)
  const timeoutRef = React.useRef<NodeJS.Timeout>()
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 100)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Ajustar posición según espacio disponible
  React.useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      
      // Si el tooltip se sale por arriba, cambiar a bottom
      if (actualSide === 'top' && rect.top < 0) {
        setActualSide('bottom')
      }
      // Si se sale por abajo, cambiar a top
      else if (actualSide === 'bottom' && rect.bottom > viewportHeight) {
        setActualSide('top')
      }
      // Si se sale por la izquierda, cambiar a right
      else if (actualSide === 'left' && rect.left < 0) {
        setActualSide('right')
      }
      // Si se sale por la derecha, cambiar a left
      else if (actualSide === 'right' && rect.right > viewportWidth) {
        setActualSide('left')
      }
    }
  }, [isVisible, actualSide])

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-popover border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-popover border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-popover border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-popover border-t-transparent border-b-transparent border-l-transparent',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-50 px-4 py-3 text-sm text-popover-foreground bg-popover border border-border rounded-lg shadow-xl',
            'w-[320px] md:w-[400px] max-w-[90vw]',
            'overflow-y-auto max-h-[50vh]',
            sideClasses[actualSide],
            className
          )}
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
          <div
            className={cn(
              'absolute w-0 h-0 border-4',
              arrowClasses[actualSide]
            )}
          />
        </div>
      )}
    </div>
  )
}
