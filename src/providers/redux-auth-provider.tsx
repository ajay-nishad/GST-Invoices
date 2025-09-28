'use client'

import { useReduxAuth } from '@/hooks/use-redux-auth'

export function ReduxAuthProvider({ children }: { children: React.ReactNode }) {
  // This component initializes the auth state when mounted
  useReduxAuth()

  return <>{children}</>
}
