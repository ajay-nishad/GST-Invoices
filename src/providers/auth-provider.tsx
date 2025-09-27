'use client'

/**
 * Authentication provider for client-side
 * Manages user session state and provides auth context
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/browser'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Supabase is not configured, skip auth setup
    if (!supabase) {
      console.warn('⚠️  Supabase not configured - authentication disabled')
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        if (!supabase) return

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      }
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle user creation - create profile if needed
        if (event === 'SIGNED_IN' && session?.user) {
          await createUserProfile(session.user)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  // Create user profile if it doesn't exist
  const createUserProfile = async (user: User) => {
    if (!supabase) return

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error('Error creating profile:', error)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }

    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Convenience hook for user data
export function useUser() {
  const { user, loading } = useAuth()
  return { user, loading }
}

// Convenience hook for session data
export function useSession() {
  const { session, loading } = useAuth()
  return { session, loading }
}
