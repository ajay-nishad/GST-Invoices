import { useCallback, useState } from 'react'
import { useToastEnhanced } from './use-toast-enhanced'

interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
  onRetry?: (attempt: number) => void
  onMaxRetriesReached?: () => void
}

interface UseMutationWithRetryOptions<TData, TError = Error>
  extends RetryOptions {
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
  successMessage?: string
  errorMessage?: string
}

export function useMutationWithRetry<
  TData = any,
  TVariables = any,
  TError = Error,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationWithRetryOptions<TData, TError> = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true,
    onRetry,
    onMaxRetriesReached,
    onSuccess,
    onError,
    successMessage,
    errorMessage,
  } = options

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<TError | null>(null)
  const [data, setData] = useState<TData | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { success, error: showError } = useToastEnhanced()

  const executeWithRetry = useCallback(
    async (variables: TVariables, attempt = 0): Promise<void> => {
      try {
        setError(null)
        const result = await mutationFn(variables)
        setData(result)
        setRetryCount(0)

        if (successMessage) {
          success(successMessage)
        }

        onSuccess?.(result)
      } catch (err) {
        const error = err as TError

        if (attempt < maxRetries) {
          const nextAttempt = attempt + 1
          setRetryCount(nextAttempt)
          onRetry?.(nextAttempt)

          const delay = exponentialBackoff
            ? retryDelay * Math.pow(2, attempt)
            : retryDelay

          setTimeout(() => {
            executeWithRetry(variables, nextAttempt)
          }, delay)
        } else {
          setError(error)
          setRetryCount(0)
          onMaxRetriesReached?.()

          const message =
            errorMessage || 'Operation failed after multiple attempts'
          showError(message, undefined, {
            label: 'Retry',
            onClick: () => mutate(variables),
          })

          onError?.(error)
        }
      }
    },
    [
      mutationFn,
      maxRetries,
      retryDelay,
      exponentialBackoff,
      onRetry,
      onMaxRetriesReached,
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      success,
      showError,
    ]
  )

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true)
      setRetryCount(0)

      try {
        await executeWithRetry(variables, 0)
      } finally {
        setIsLoading(false)
      }
    },
    [executeWithRetry]
  )

  const reset = useCallback(() => {
    setError(null)
    setData(null)
    setRetryCount(0)
  }, [])

  return {
    mutate,
    isLoading,
    error,
    data,
    retryCount,
    reset,
  }
}

// Hook for automatic retry with exponential backoff
export function useAutoRetry<T>(
  asyncFn: () => Promise<T>,
  dependencies: any[] = [],
  options: RetryOptions = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    exponentialBackoff = true,
    onRetry,
    onMaxRetriesReached,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const executeWithRetry = useCallback(
    async (attempt = 0): Promise<void> => {
      try {
        setError(null)
        const result = await asyncFn()
        setData(result)
        setRetryCount(0)
      } catch (err) {
        const error = err as Error

        if (attempt < maxRetries) {
          const nextAttempt = attempt + 1
          setRetryCount(nextAttempt)
          onRetry?.(nextAttempt)

          const delay = exponentialBackoff
            ? retryDelay * Math.pow(2, attempt)
            : retryDelay

          setTimeout(() => {
            executeWithRetry(nextAttempt)
          }, delay)
        } else {
          setError(error)
          setRetryCount(0)
          onMaxRetriesReached?.()
        }
      }
    },
    [
      asyncFn,
      maxRetries,
      retryDelay,
      exponentialBackoff,
      onRetry,
      onMaxRetriesReached,
    ]
  )

  const execute = useCallback(async () => {
    setIsLoading(true)
    setRetryCount(0)

    try {
      await executeWithRetry(0)
    } finally {
      setIsLoading(false)
    }
  }, [executeWithRetry])

  return {
    data,
    error,
    isLoading,
    retryCount,
    execute,
    retry: () => execute(),
  }
}
