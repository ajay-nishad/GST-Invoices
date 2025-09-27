'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/browser'

interface SignOutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children?: React.ReactNode
}

export function SignOutButton({
  variant = 'outline',
  size = 'default',
  className,
  children = 'Sign Out',
}: SignOutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setLoading(true)

    try {
      const supabase = createClient()
      if (!supabase) {
        throw new Error('Supabase client not configured')
      }

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign out error:', error)
        // Still redirect even if there's an error
      }

      // Redirect to home page
      router.push('/')
    } catch (err) {
      console.error('Sign out error:', err)
      // Still redirect even if there's an error
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? 'Signing out...' : children}
    </Button>
  )
}
