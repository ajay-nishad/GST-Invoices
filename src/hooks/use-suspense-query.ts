import { useEffect, useState } from 'react'

interface QueryOptions<T> {
  queryKey: string[]
  queryFn: () => Promise<T>
  enabled?: boolean
}

interface QueryCache {
  [key: string]: {
    data?: any
    promise?: Promise<any>
    error?: Error
  }
}

const queryCache: QueryCache = {}

export function useSuspenseQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
}: QueryOptions<T>): {
  data: T | null
  isLoading: boolean
  error: Error | null
} {
  const cacheKey = JSON.stringify(queryKey)
  const [data, setData] = useState<T | null>(queryCache[cacheKey]?.data || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(
    queryCache[cacheKey]?.error || null
  )

  useEffect(() => {
    if (!enabled) return

    // Check if we have cached data
    if (queryCache[cacheKey]?.data) {
      setData(queryCache[cacheKey].data)
      setIsLoading(false)
      setError(null)
      return
    }

    // Check if we have a cached error
    if (queryCache[cacheKey]?.error) {
      setError(queryCache[cacheKey].error)
      setData(null)
      setIsLoading(false)
      return
    }

    // Check if we have a pending promise
    if (queryCache[cacheKey]?.promise) {
      setIsLoading(true)
      queryCache[cacheKey].promise
        ?.then((result) => {
          setData(result)
          setIsLoading(false)
          setError(null)
        })
        .catch((err) => {
          setError(err)
          setData(null)
          setIsLoading(false)
        })
      return
    }

    // Create new promise and cache it
    setIsLoading(true)
    setError(null)

    const promise = queryFn()
      .then((result) => {
        queryCache[cacheKey] = { data: result }
        setData(result)
        setIsLoading(false)
        return result
      })
      .catch((err) => {
        queryCache[cacheKey] = { error: err }
        setError(err)
        setData(null)
        setIsLoading(false)
        throw err
      })

    queryCache[cacheKey] = { promise }
  }, [cacheKey, enabled, queryFn])

  return { data, isLoading, error }
}

export function invalidateQuery(queryKey: string[]) {
  const cacheKey = JSON.stringify(queryKey)
  delete queryCache[cacheKey]
}

export function setQueryData<T>(queryKey: string[], data: T) {
  const cacheKey = JSON.stringify(queryKey)
  queryCache[cacheKey] = { data }
}

// Hook for mutations that can invalidate queries
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: Error, variables: TVariables) => void
    invalidateQueries?: string[][]
  }
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = async (variables: TVariables) => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await mutationFn(variables)

      // Invalidate specified queries
      options?.invalidateQueries?.forEach((queryKey) => {
        invalidateQuery(queryKey)
      })

      options?.onSuccess?.(data, variables)
      return data
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error, variables)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutate,
    isLoading,
    error,
  }
}
