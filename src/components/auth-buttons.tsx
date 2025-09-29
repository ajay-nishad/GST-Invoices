'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignOutButton } from '@/components/sign-out-button'
import { useUser } from '@/providers/auth-provider'

export function AuthButtons() {
  const { user, loading } = useUser()

  if (loading) {
    return <Button disabled>Loading...</Button>
  }

  if (user) {
    return (
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/dashboard" prefetch={true}>
            Dashboard
          </Link>
        </Button>
        <SignOutButton variant="outline" />
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button asChild>
        <Link href="/auth/signin" prefetch={true}>
          Sign In
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/auth/signup" prefetch={true}>
          Sign Up
        </Link>
      </Button>
    </div>
  )
}
