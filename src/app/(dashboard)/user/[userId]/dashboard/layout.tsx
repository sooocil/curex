import type { ReactNode } from "react"
import { UserSidebar } from "@/components/dashboard/sidebar"
import { UserHeader } from "@/components/dashboard/header"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <UserSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <UserHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 mx-[10px] md:mx-[20px]">{children}</main>
        </div>
      </div>
    </div>
  )
}

