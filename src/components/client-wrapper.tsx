"use client"

import { useEffect } from "react"
import type { ReactNode } from "react"

export default function ClientWrapper({ children }: { children: ReactNode }) {
  // Apply any client-side-only modifications here
  useEffect(() => {
    // This runs only on the client after hydration
    document.documentElement.classList.add("overflow-x-hidden")
    document.body.classList.add("overflow-x-hidden")
  }, [])

  return <>{children}</>
}
