import { useState, useCallback } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
}

export function useToastEnhanced() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      action,
      duration = 5000,
    }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast = { id, title, description, variant, action, duration }

      setToasts((prev) => [...prev, newToast])

      // Auto remove after specified duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)

      return id
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string, action?: Toast['action']) => {
      return toast({ title, description, variant: 'success', action })
    },
    [toast]
  )

  const error = useCallback(
    (title: string, description?: string, action?: Toast['action']) => {
      return toast({ title, description, variant: 'destructive', action })
    },
    [toast]
  )

  const warning = useCallback(
    (title: string, description?: string, action?: Toast['action']) => {
      return toast({ title, description, variant: 'warning', action })
    },
    [toast]
  )

  return {
    toast,
    success,
    error,
    warning,
    dismiss,
    toasts,
  }
}
