import { redirect } from 'next/navigation'

export default function GuestPage() {
  redirect('/auth/signin')
}
