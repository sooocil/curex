import type { ReactNode } from "react"
import ClientWrapper from "@/components/client-wrapper"

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <ClientWrapper>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        
      </div>
    </ClientWrapper>
  )
}
