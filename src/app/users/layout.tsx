'use client'


import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex items-center justify-center h-16 border-b bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-curex  flex items-center justify-center">
            <span className="text-white  font-bold text-xl">C</span>
          </div>
          <span 
          onClick={() => (window.location.href = "/")}
          
          className="text-3xl text-tealish font-bold text-curex hover:cursor-pointer">Curex</span>
        </div>
      </div>
      <main className="flex-1 flex items-center justify-center bg-teal-50">{children}</main>
      <footer className="py-4 text-center text-sm text-muted-foreground border-t bg-white">
        <p>© {new Date().getFullYear()} Curex. All rights reserved.</p> 
      </footer>
    </div>
  )
}
