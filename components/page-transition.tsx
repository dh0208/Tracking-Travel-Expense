"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // When the path changes, set loading state but don't block rendering
    setIsLoading(true)

    // Short timeout to allow for transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 10) // Reduced to 10ms for minimal delay

    return () => clearTimeout(timer)
  }, [pathname])

  // Return the children directly with just opacity transition
  return <div className={`transition-opacity duration-150 ${isLoading ? "opacity-90" : "opacity-100"}`}>{children}</div>
}

