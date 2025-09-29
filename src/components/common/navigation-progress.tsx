'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Show progress bar on route change
    setIsNavigating(true)

    // Hide after transition completes
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    // Listen for link clicks to show immediate feedback
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href]')

      // Check if the click is from a sidebar navigation item
      const isSidebarLink =
        target.closest('nav')?.closest('.sidebar') !== null ||
        target.closest('[data-sidebar-nav]') !== null

      if (
        link &&
        link.getAttribute('href')?.startsWith('/') &&
        !isSidebarLink
      ) {
        setIsNavigating(true)
      }
    }

    document.addEventListener('click', handleLinkClick)
    return () => document.removeEventListener('click', handleLinkClick)
  }, [])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-600 animate-pulse">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500 ease-out"
          style={{
            width: '100%',
            animation: 'progress 0.5s ease-out forwards',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
