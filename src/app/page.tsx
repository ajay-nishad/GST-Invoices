import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to guest invoice builder for demo purposes
  redirect('/guest')
}
