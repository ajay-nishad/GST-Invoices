import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export async function requireUser(): Promise<User> {
  const supabase = await createClient()
  if (!supabase) {
    redirect('/auth/signin?error=configuration')
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/auth/signin?error=unauthorized')
    }

    return user
  } catch (error) {
    console.error('Error getting user:', error)
    redirect('/auth/signin?error=unauthorized')
  }
}

export async function requireUserWithProfile() {
  const supabase = await createClient()
  if (!supabase) {
    redirect('/auth/signin?error=configuration')
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/auth/signin?error=unauthorized')
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error getting profile:', profileError)
      return { user, profile: null }
    }

    return { user, profile }
  } catch (error) {
    console.error('Error getting user with profile:', error)
    redirect('/auth/signin?error=unauthorized')
  }
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient()
  if (!supabase) return null

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export async function getUserWithProfile() {
  const supabase = await createClient()
  if (!supabase) return null

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) {
      console.error('Error getting user:', error)
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error getting profile:', profileError)
      return { user, profile: null }
    }

    return { user, profile }
  } catch (error) {
    console.error('Error getting user with profile:', error)
    return null
  }
}
