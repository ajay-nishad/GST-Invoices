'use client'

import { useEffect } from 'react'
import { useToastEnhanced } from '@/hooks/use-toast-enhanced'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const toastIcons = {
  default: Info,
  success: CheckCircle,
  destructive: AlertCircle,
  warning: AlertTriangle,
}

export function EnhancedToastProvider() {
  const { toasts, dismiss } = useToastEnhanced()

  // Auto-dismiss toasts after their duration
  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration) {
        const timer = setTimeout(() => {
          dismiss(toast.id)
        }, toast.duration)

        return () => clearTimeout(timer)
      }
    })
  }, [toasts, dismiss])

  return (
    <RadixToastProvider>
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.variant || 'default']

        return (
          <Toast
            key={toast.id}
            variant={toast.variant}
            onOpenChange={(open) => {
              if (!open) {
                dismiss(toast.id)
              }
            }}
            className="group"
          >
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="grid gap-1 flex-1">
                <ToastTitle className="text-sm font-semibold">
                  {toast.title}
                </ToastTitle>
                {toast.description && (
                  <ToastDescription className="text-sm opacity-90">
                    {toast.description}
                  </ToastDescription>
                )}
              </div>
              {toast.action && (
                <ToastAction
                  altText={toast.action.label}
                  onClick={toast.action.onClick}
                  className="ml-auto"
                >
                  {toast.action.label}
                </ToastAction>
              )}
              <ToastClose className="ml-2" />
            </div>
          </Toast>
        )
      })}
      <ToastViewport />
    </RadixToastProvider>
  )
}

// Global toast functions for easier usage
export const toast = {
  success: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    // This will be implemented via a context or global state
    console.log('Success toast:', { title, description, action })
  },
  error: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    console.log('Error toast:', { title, description, action })
  },
  warning: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    console.log('Warning toast:', { title, description, action })
  },
  info: (
    title: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    console.log('Info toast:', { title, description, action })
  },
}
