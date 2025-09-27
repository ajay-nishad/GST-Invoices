import { useCallback, useState, useTransition } from 'react'
import { useToastEnhanced } from './use-toast-enhanced'

interface OptimisticMutationOptions<TData, TError = Error> {
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
  successMessage?: string
  errorMessage?: string
  retryable?: boolean
}

export function useOptimisticMutation<
  TData = any,
  TVariables = any,
  TError = Error,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: OptimisticMutationOptions<TData, TError> = {}
) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<TError | null>(null)
  const [data, setData] = useState<TData | null>(null)
  const { success, error: showError } = useToastEnhanced()

  const mutate = useCallback(
    async (variables: TVariables) => {
      setError(null)

      startTransition(async () => {
        try {
          const result = await mutationFn(variables)
          setData(result)

          if (options.successMessage) {
            success(options.successMessage)
          }

          options.onSuccess?.(result)
        } catch (err) {
          const error = err as TError
          setError(error)

          const errorMessage = options.errorMessage || 'An error occurred'

          if (options.retryable) {
            showError(errorMessage, 'Click to retry', {
              label: 'Retry',
              onClick: () => mutate(variables),
            })
          } else {
            showError(errorMessage)
          }

          options.onError?.(error)
        }
      })
    },
    [mutationFn, options, success, showError]
  )

  const reset = useCallback(() => {
    setError(null)
    setData(null)
  }, [])

  return {
    mutate,
    isPending,
    error,
    data,
    reset,
  }
}
