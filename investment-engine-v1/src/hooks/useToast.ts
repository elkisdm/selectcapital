import { useState, useCallback } from 'react'
import type { Toast, ToastType } from '@/components/ui/toast'

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback(
    (title: string, type: ToastType = 'info', description?: string, duration?: number) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const newToast: Toast = {
        id,
        title,
        description,
        type,
        duration: duration !== undefined ? duration : 5000,
      }

      setToasts((prev) => [...prev, newToast])
      return id
    },
    []
  )

  const closeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string, duration?: number) => {
      return showToast(title, 'success', description, duration)
    },
    [showToast]
  )

  const error = useCallback(
    (title: string, description?: string, duration?: number) => {
      return showToast(title, 'error', description, duration)
    },
    [showToast]
  )

  const info = useCallback(
    (title: string, description?: string, duration?: number) => {
      return showToast(title, 'info', description, duration)
    },
    [showToast]
  )

  const warning = useCallback(
    (title: string, description?: string, duration?: number) => {
      return showToast(title, 'warning', description, duration)
    },
    [showToast]
  )

  return {
    toasts,
    showToast,
    closeToast,
    success,
    error,
    info,
    warning,
  }
}

