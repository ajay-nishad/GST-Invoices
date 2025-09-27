'use client'

import { useUser } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AuthButtons() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="flex space-x-2">
        <Button disabled>Loading...</Button>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex space-x-2">
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex space-x-2">
      <Link href="/auth/login">
        <Button variant="outline">Sign In</Button>
      </Link>
      <Link href="/auth/signup">
        <Button>Sign Up</Button>
      </Link>
    </div>
  )
}
