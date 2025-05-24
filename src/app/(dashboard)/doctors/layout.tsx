import type { ReactNode } from "react"
import { DoctorSidebar } from "@/components/doctors/sidebar"
import { DoctorHeader } from "@/components/doctors/header"

export default function DoctorsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <DoctorSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <DoctorHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 mx-[10px] md:mx-[20px]">{children}</main>
        </div>
      </div>
    </div>
  )
}
