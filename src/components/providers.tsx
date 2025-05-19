"use client"

import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-col overflow-x-hidden">{children}</div>
}
