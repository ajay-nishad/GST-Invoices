'use client'

import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import { ReactNode } from 'react'

interface ReduxProviderProps {
  children: ReactNode
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  // Use the singleton store instance instead of creating a new one
  return <Provider store={store}>{children}</Provider>
}
