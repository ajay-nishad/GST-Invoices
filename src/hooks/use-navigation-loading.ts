'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function useNavigationLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
    }

    const handleComplete = () => {
      setIsLoading(false)
    }

    // Start loading on route change
    handleStart()

    // Complete loading after a short delay to ensure smooth transition
    const timer = setTimeout(handleComplete, 100)

    return () => {
      clearTimeout(timer)
      handleComplete()
    }
  }, [pathname, searchParams])

  return isLoading
}

export function useNavigationState() {
  const [navigationState, setNavigationState] = useState<{
    isLoading: boolean
    from: string | null
    to: string | null
  }>({
    isLoading: false,
    from: null,
    to: null,
  })

  const pathname = usePathname()

  useEffect(() => {
    setNavigationState((prev) => ({
      isLoading: false,
      from: prev.to,
      to: pathname,
    }))
  }, [pathname])

  const startNavigation = (to: string) => {
    setNavigationState((prev) => ({
      isLoading: true,
      from: prev.to,
      to,
    }))
  }

  return {
    ...navigationState,
    startNavigation,
  }
}
