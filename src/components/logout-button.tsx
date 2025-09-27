'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      const { error } = await signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      {loading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}
