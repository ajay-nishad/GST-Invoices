'use client'

import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import {
  setUser,
  setSession,
  setLoading,
  setError,
  clearAuth,
  setAuthState,
} from '@/lib/slices/auth-slice'
import { createClient } from '@/lib/supabase/browser'
import type { User, Session } from '@supabase/supabase-js'

export function useReduxAuth() {
  const dispatch = useAppDispatch()
  const { user, session, loading, error } = useAppSelector(
    (state) => state.auth
  )

  const supabase = createClient()

  useEffect(() => {
    if (!supabase) {
      dispatch(setLoading(false))
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          dispatch(setError(error.message))
        } else {
          dispatch(
            setAuthState({
              user: session?.user ?? null,
              session: session,
            })
          )
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        dispatch(
          setError(error instanceof Error ? error.message : 'Unknown error')
        )
      } finally {
        dispatch(setLoading(false))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      dispatch(
        setAuthState({
          user: session?.user ?? null,
          session: session,
        })
      )
    })

    return () => subscription.unsubscribe()
  }, [dispatch, supabase])

  const signOut = useCallback(async () => {
    if (!supabase) return

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        dispatch(setError(error.message))
      } else {
        dispatch(clearAuth())
      }
    } catch (error) {
      console.error('Error signing out:', error)
      dispatch(
        setError(error instanceof Error ? error.message : 'Unknown error')
      )
    }
  }, [dispatch, supabase])

  return {
    user,
    session,
    loading,
    error,
    signOut,
  }
}

export function useReduxUser() {
  const { user, loading } = useAppSelector((state) => state.auth)
  return { user, loading }
}

export function useReduxSession() {
  const { session, loading } = useAppSelector((state) => state.auth)
  return { session, loading }
}
