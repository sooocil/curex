import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
