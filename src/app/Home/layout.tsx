'use client'


import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col overflow-auto ">
      
      <main className=" bg-teal-50">{children}</main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t bg-white">
        <p>© {new Date().getFullYear()} Curex. All rights reserved.</p> 
      </footer>
    </div>
  )
}
